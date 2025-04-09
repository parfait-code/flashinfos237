export interface DashboardStats {
    totalArticles: number;
    totalCategories: number;
    totalUsers: number;
    totalViews: number;
    articlesPublishedToday: number;
    articlesPublishedThisWeek: number;
    articlesPublishedThisMonth: number;
    topCategories: CategoryStat[];
    topArticles: ArticleStat[];
    userGrowth: UserGrowthStat[];
    viewsByDay: ViewsByDayStat[];
  }
  
  export interface CategoryStat {
    id: string;
    name: string;
    count: number;
  }
  
  export interface ArticleStat {
    id: string;
    title: string;
    views: number;
    likes: number;
    comments: number;
  }
  
  export interface UserGrowthStat {
    date: string;
    count: number;
  }
  
  export interface ViewsByDayStat {
    date: string;
    views: number;
  }
  