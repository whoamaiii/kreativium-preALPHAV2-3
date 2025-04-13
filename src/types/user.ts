export interface User {
  id: string;
  name: string;
  role: 'child' | 'teacher' | 'admin';
}
