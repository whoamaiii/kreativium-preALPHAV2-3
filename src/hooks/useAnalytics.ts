import { useQuery } from '@tanstack/react-query';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { format, eachDayOfInterval } from 'date-fns';

interface AnalyticsOptions {
  from: Date;
  to: Date;
}

export function useAnalytics({ from, to }: AnalyticsOptions) {
  return useQuery({
    queryKey: ['analytics', from.toISOString(), to.toISOString()],
    queryFn: async () => {
      // Fetch user activity
      const userActivityQuery = query(
        collection(db, 'userActivity'),
        where('timestamp', '>=', from),
        where('timestamp', '<=', to),
        orderBy('timestamp')
      );
      const userActivitySnapshot = await getDocs(userActivityQuery);
      const userActivity = userActivitySnapshot.docs.map(doc => doc.data());

      // Fetch content metrics
      const contentQuery = query(
        collection(db, 'content'),
        where('createdAt', '>=', from),
        where('createdAt', '<=', to)
      );
      const contentSnapshot = await getDocs(contentQuery);
      const content = contentSnapshot.docs.map(doc => doc.data());

      // Calculate daily metrics
      const dailyData = eachDayOfInterval({ start: from, end: to }).map(date => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayActivity = userActivity.filter(a => 
          format(new Date(a.timestamp), 'yyyy-MM-dd') === dateStr
        );

        return {
          date: dateStr,
          activeUsers: new Set(dayActivity.map(a => a.userId)).size,
          quizAttempts: dayActivity.filter(a => a.type === 'quiz_attempt').length,
          memoryGames: dayActivity.filter(a => a.type === 'memory_game').length,
        };
      });

      // Calculate overview metrics
      const overview = {
        totalUsers: new Set(userActivity.map(a => a.userId)).size,
        totalQuizAttempts: userActivity.filter(a => a.type === 'quiz_attempt').length,
        totalMemoryGames: userActivity.filter(a => a.type === 'memory_game').length,
        averageScore: content.reduce((acc, c) => acc + (c.score || 0), 0) / content.length || 0,
      };

      // Calculate content metrics
      const contentMetrics = {
        quizzes: content.filter(c => c.type === 'quiz').length,
        memoryGames: content.filter(c => c.type === 'memory_game').length,
        categories: content.filter(c => c.type === 'category').length,
        mediaFiles: content.filter(c => c.type === 'media').length,
      };

      // Calculate category breakdown
      const categoryBreakdown = content
        .filter(c => c.category)
        .reduce((acc: Record<string, number>, c) => {
          acc[c.category] = (acc[c.category] || 0) + 1;
          return acc;
        }, {});

      return {
        overview,
        dailyData,
        contentMetrics,
        categoryBreakdown,
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}