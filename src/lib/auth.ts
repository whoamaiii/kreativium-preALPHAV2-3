import { auth } from './firebase';
import { signInWithCustomToken, signOut } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface TokenData {
  exp: number;
  iat: number;
  uid: string;
}

class AuthManager {
  private static instance: AuthManager;
  private refreshPromise: Promise<string> | null = null;
  private tokenExpirationTimer: number | null = null;
  private readonly TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minutes before expiry
  private readonly MAX_RETRY_ATTEMPTS = 3;
  private retryCount = 0;

  private constructor() {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  private handleOnline = async () => {
    if (auth.currentUser) {
      try {
        await this.refreshAccessToken(await this.getStoredRefreshToken(auth.currentUser.uid));
      } catch (error) {
        console.error('Failed to refresh token on reconnect:', error);
        this.handleAuthError(error);
      }
    }
  };

  private handleOffline = () => {
    if (this.tokenExpirationTimer) {
      window.clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  };

  private async getStoredRefreshToken(userId: string): Promise<string> {
    try {
      const tokenDoc = await getDoc(doc(db, 'refreshTokens', userId));
      if (!tokenDoc.exists() || tokenDoc.data()?.invalidated) {
        throw new Error('No valid refresh token found');
      }
      return tokenDoc.data().token;
    } catch (error) {
      throw new Error('Failed to retrieve refresh token');
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
    if (this.refreshPromise) {
      return this.refreshPromise as Promise<TokenResponse>;
    }

    this.refreshPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
          throw new Error(`Failed to refresh token: ${response.statusText}`);
        }

        const data = await response.json();
        const userCredential = await signInWithCustomToken(auth, data.customToken);
        const accessToken = await userCredential.user.getIdToken();
        const expiresIn = 3600 * 1000; // 1 hour in milliseconds

        await this.updateRefreshToken(userCredential.user.uid, data.refreshToken);
        this.scheduleTokenRefresh(expiresIn);
        this.retryCount = 0;

        resolve({
          accessToken,
          refreshToken: data.refreshToken,
          expiresIn,
        });
      } catch (error) {
        this.retryCount++;
        
        if (this.retryCount < this.MAX_RETRY_ATTEMPTS) {
          const backoffDelay = Math.pow(2, this.retryCount) * 1000;
          setTimeout(() => {
            this.refreshPromise = null;
            this.refreshAccessToken(refreshToken)
              .then(resolve)
              .catch(reject);
          }, backoffDelay);
        } else {
          this.handleAuthError(error);
          reject(error);
        }
      } finally {
        this.refreshPromise = null;
      }
    });

    return this.refreshPromise;
  }

  private async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const tokenDoc = doc(db, 'refreshTokens', userId);
    await setDoc(tokenDoc, {
      token: refreshToken,
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
    }, { merge: true });
  }

  private scheduleTokenRefresh(expiresIn: number): void {
    if (this.tokenExpirationTimer) {
      window.clearTimeout(this.tokenExpirationTimer);
    }

    const refreshTime = expiresIn - this.TOKEN_EXPIRY_BUFFER;
    this.tokenExpirationTimer = window.setTimeout(async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const tokenDoc = await getDoc(doc(db, 'refreshTokens', user.uid));
          const refreshToken = tokenDoc.data()?.token;
          if (refreshToken) {
            await this.refreshAccessToken(refreshToken);
          }
        } catch (error) {
          this.handleAuthError(error);
        }
      }
    }, refreshTime);
  }

  private async handleAuthError(error: unknown): Promise<void> {
    console.error('Auth error:', error);
    
    try {
      await this.invalidateSession();
      window.dispatchEvent(new CustomEvent('auth:error', {
        detail: {
          message: error instanceof Error ? error.message : 'Authentication error occurred',
          timestamp: new Date().toISOString(),
        }
      }));
    } catch (signOutError) {
      console.error('Error during sign out:', signOutError);
    }
  }

  async invalidateSession(): Promise<void> {
    if (this.tokenExpirationTimer) {
      window.clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        const tokenDoc = doc(db, 'refreshTokens', user.uid);
        await setDoc(tokenDoc, { invalidated: true }, { merge: true });
      }
      await signOut(auth);
      
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Error invalidating session:', error);
      throw error;
    }
  }

  async getValidToken(): Promise<string | null> {
    try {
      const user = auth.currentUser;
      if (!user) return null;

      const tokenDoc = await getDoc(doc(db, 'refreshTokens', user.uid));
      const data = tokenDoc.data();

      if (!data || data.invalidated) {
        await this.invalidateSession();
        return null;
      }

      const token = await user.getIdToken(true);
      const expiresIn = 3600 * 1000; // 1 hour in milliseconds

      if (expiresIn <= this.TOKEN_EXPIRY_BUFFER) {
        return this.refreshAccessToken(data.token).then(response => response.accessToken);
      }

      return token;
    } catch (error) {
      this.handleAuthError(error);
      return null;
    }
  }

  cleanup(): void {
    if (this.tokenExpirationTimer) {
      window.clearTimeout(this.tokenExpirationTimer);
    }
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }
}

export const authManager = AuthManager.getInstance();