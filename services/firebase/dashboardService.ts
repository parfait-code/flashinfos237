import { collection, query, where, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { DashboardStats, CategoryStat, ArticleStat, UserGrowthStat, ViewsByDayStat } from '@/types';

// Obtenir les statistiques pour le dashboard
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // Obtenir le nombre total d'articles
    const articlesRef = collection(db, 'articles');
    const articlesSnapshot = await getDocs(articlesRef);
    const totalArticles = articlesSnapshot.size;

    // Obtenir le nombre total de catégories
    const categoriesRef = collection(db, 'categories');
    const categoriesSnapshot = await getDocs(categoriesRef);
    const totalCategories = categoriesSnapshot.size;

    // Obtenir le nombre total d'utilisateurs
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);
    const totalUsers = usersSnapshot.size;

    // Calculer le nombre total de vues
    let totalViews = 0;
    articlesSnapshot.forEach((doc) => {
      const data = doc.data();
      totalViews += data.viewCount || 0;
    });

    // Obtenir les articles publiés aujourd'hui
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = Timestamp.fromDate(today);
    
    const todayArticlesQuery = query(
      articlesRef,
      where('publishedAt', '>=', todayTimestamp)
    );
    const todayArticlesSnapshot = await getDocs(todayArticlesQuery);
    const articlesPublishedToday = todayArticlesSnapshot.size;

    // Obtenir les articles publiés cette semaine
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    oneWeekAgo.setHours(0, 0, 0, 0);
    const oneWeekAgoTimestamp = Timestamp.fromDate(oneWeekAgo);
    
    const weekArticlesQuery = query(
      articlesRef,
      where('publishedAt', '>=', oneWeekAgoTimestamp)
    );
    const weekArticlesSnapshot = await getDocs(weekArticlesQuery);
    const articlesPublishedThisWeek = weekArticlesSnapshot.size;

    // Obtenir les articles publiés ce mois
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    oneMonthAgo.setHours(0, 0, 0, 0);
    const oneMonthAgoTimestamp = Timestamp.fromDate(oneMonthAgo);
    
    const monthArticlesQuery = query(
      articlesRef,
      where('publishedAt', '>=', oneMonthAgoTimestamp)
    );
    const monthArticlesSnapshot = await getDocs(monthArticlesQuery);
    const articlesPublishedThisMonth = monthArticlesSnapshot.size;

    // Obtenir les catégories les plus populaires
    const categoryMap = new Map<string, { id: string, name: string, count: number }>();
    
    // Récupérer toutes les catégories pour avoir leurs noms
    const categoriesMap = new Map<string, string>();
    categoriesSnapshot.forEach(doc => {
      const data = doc.data();
      categoriesMap.set(doc.id, data.name);
    });
    
    // Compter les articles par catégorie
    articlesSnapshot.forEach((doc) => {
      const data = doc.data();
      const categoryIds = data.categoryIds || [];
      
      categoryIds.forEach((catId: string) => {
        const categoryName = categoriesMap.get(catId) || 'Catégorie inconnue';
        const existing = categoryMap.get(catId);
        if (existing) {
          existing.count += 1;
        } else {
          categoryMap.set(catId, { id: catId, name: categoryName, count: 1 });
        }
      });
    });
    
    // Tri des catégories par nombre d'articles
    const sortedCategories = [...categoryMap.values()].sort((a, b) => b.count - a.count);
    const topCategories: CategoryStat[] = sortedCategories.slice(0, 5);

    // Obtenir les articles les plus vus
    const topArticlesQuery = query(
      articlesRef,
      orderBy('viewCount', 'desc'),
      limit(5)
    );
    const topArticlesSnapshot = await getDocs(topArticlesQuery);
    
    const topArticles: ArticleStat[] = [];
    topArticlesSnapshot.forEach((doc) => {
      const data = doc.data();
      topArticles.push({
        id: doc.id,
        title: data.title,
        views: data.viewCount || 0,
        likes: data.likeCount || 0,
        comments: data.commentCount || 0,
      });
    });

    // Statistiques de croissance des utilisateurs
    // Calculer par mois sur les 6 derniers mois
    const userGrowth: UserGrowthStat[] = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      date.setDate(1); // Premier jour du mois
      date.setHours(0, 0, 0, 0);
      
      const nextMonth = new Date(date);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      
      const startOfMonth = Timestamp.fromDate(date);
      const startOfNextMonth = Timestamp.fromDate(nextMonth);
      
      const usersInMonthQuery = query(
        usersRef,
        where('createdAt', '>=', startOfMonth),
        where('createdAt', '<', startOfNextMonth)
      );
      
      const usersInMonthSnapshot = await getDocs(usersInMonthQuery);
      const monthName = date.toISOString().substring(0, 7); // Format YYYY-MM
      
      userGrowth.push({
        date: monthName,
        count: usersInMonthSnapshot.size
      });
    }

    // Vues par jour (sur les 7 derniers jours)
    const viewsByDay: ViewsByDayStat[] = [];
    
    // Récupérer les données des 7 derniers jours
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      
      const startOfDay = Timestamp.fromDate(date);
      const startOfNextDay = Timestamp.fromDate(nextDay);
      
      // Pour les vues, nous devons rechercher dans une collection "views" ou similaire
      // Si vous n'avez pas une telle collection, vous pouvez adapter cette logique
      const viewsRef = collection(db, 'pageViews'); // Supposons que vous avez une collection "pageViews"
      
      let totalDayViews = 0;
      
      if (viewsRef) {
        try {
          const viewsQuery = query(
            viewsRef,
            where('timestamp', '>=', startOfDay),
            where('timestamp', '<', startOfNextDay)
          );
          
          const viewsSnapshot = await getDocs(viewsQuery);
          viewsSnapshot.forEach(doc => {
            const data = doc.data();
            totalDayViews += data.count || 1;
          });
        } catch (error) {
          console.warn('La collection pageViews peut ne pas exister:', error);
          // Calcul alternatif basé sur les articles consultés ce jour-là (approximatif)
          const viewedArticlesQuery = query(
            articlesRef,
            where('lastViewedAt', '>=', startOfDay),
            where('lastViewedAt', '<', startOfNextDay)
          );
          
          try {
            const viewedArticlesSnapshot = await getDocs(viewedArticlesQuery);
            totalDayViews = viewedArticlesSnapshot.size;
          } catch (error) {
            console.warn('Impossible de calculer les vues alternatives:', error);
          }
        }
      }
      
      const formattedDate = date.toISOString().split('T')[0]; // Format YYYY-MM-DD
      
      viewsByDay.push({
        date: formattedDate,
        views: totalDayViews
      });
    }

    return {
      totalArticles,
      totalCategories,
      totalUsers,
      totalViews,
      articlesPublishedToday,
      articlesPublishedThisWeek,
      articlesPublishedThisMonth,
      topCategories,
      topArticles,
      userGrowth,
      viewsByDay,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};