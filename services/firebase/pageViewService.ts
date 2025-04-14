import { collection, addDoc, Timestamp, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/config/firebase';

export const pageViewService = {
  /**
   * Enregistre une vue de page dans la collection pageViews
   * Regroupe les vues par article et par jour pour des analyses efficaces
   */
  async recordPageView(articleId: string) {
    try {
      // Obtenir la date d'aujourd'hui (sans heure/minutes/secondes)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTimestamp = Timestamp.fromDate(today);
      
      // Vérifier s'il existe déjà un enregistrement pour cet article aujourd'hui
      const pageViewsRef = collection(db, 'pageViews');
      const pageViewQuery = query(
        pageViewsRef,
        where('articleId', '==', articleId),
        where('date', '==', todayTimestamp)
      );
      
      const querySnapshot = await getDocs(pageViewQuery);
      
      if (!querySnapshot.empty) {
        // Mettre à jour l'enregistrement existant
        const viewDoc = querySnapshot.docs[0];
        const currentCount = viewDoc.data().count || 0;
        
        await updateDoc(doc(db, 'pageViews', viewDoc.id), {
          count: currentCount + 1,
          lastUpdated: Timestamp.now()
        });
      } else {
        // Créer un nouvel enregistrement
        await addDoc(pageViewsRef, {
          articleId,
          date: todayTimestamp,
          timestamp: Timestamp.now(),
          lastUpdated: Timestamp.now(),
          count: 1
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error recording page view:', error);
      return false;
    }
  },
  
  /**
   * Récupère le nombre total de vues pour un article spécifique
   */
  async getTotalViewsForArticle(articleId: string): Promise<number> {
    try {
      const pageViewsRef = collection(db, 'pageViews');
      const pageViewQuery = query(
        pageViewsRef,
        where('articleId', '==', articleId)
      );
      
      const querySnapshot = await getDocs(pageViewQuery);
      
      let totalViews = 0;
      querySnapshot.forEach(doc => {
        const data = doc.data();
        totalViews += data.count || 0;
      });
      
      return totalViews;
    } catch (error) {
      console.error('Error getting total views for article:', error);
      return 0;
    }
  },
  
  /**
   * Récupère le nombre total de vues pour une période donnée
   */
  async getViewsForPeriod(startDate: Date, endDate: Date): Promise<number> {
    try {
      const startTimestamp = Timestamp.fromDate(startDate);
      const endTimestamp = Timestamp.fromDate(endDate);
      
      const pageViewsRef = collection(db, 'pageViews');
      const pageViewQuery = query(
        pageViewsRef,
        where('date', '>=', startTimestamp),
        where('date', '<=', endTimestamp)
      );
      
      const querySnapshot = await getDocs(pageViewQuery);
      
      let totalViews = 0;
      querySnapshot.forEach(doc => {
        const data = doc.data();
        totalViews += data.count || 0;
      });
      
      return totalViews;
    } catch (error) {
      console.error('Error getting views for period:', error);
      return 0;
    }
  }
};