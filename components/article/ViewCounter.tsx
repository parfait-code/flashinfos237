// components/article/ViewCounter.tsx
'use client';

import { useEffect } from 'react';

interface ViewCounterProps {
  articleId: string;
}

export default function ViewCounter({ articleId }: ViewCounterProps) {
  useEffect(() => {
    // Utiliser sessionStorage pour suivre les articles déjà vus
    const viewedArticles = sessionStorage.getItem('viewedArticles') || '';
    const viewedArticlesArray = viewedArticles.split(',').filter(Boolean);
    
    // Vérifier si cet article a déjà été vu dans cette session
    if (!viewedArticlesArray.includes(articleId)) {
      const incrementViewCount = async () => {
        try {
          const res = await fetch(`/api/articles/${articleId}/view`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            // Ajouter un cache-buster pour éviter la mise en cache
            cache: 'no-store',
          });
          
          if (res.ok) {
            // Ajouter l'ID de l'article à la liste des articles vus
            viewedArticlesArray.push(articleId);
            sessionStorage.setItem('viewedArticles', viewedArticlesArray.join(','));
          }
        } catch (error) {
          console.error('Failed to increment view count:', error);
        }
      };

      // Utiliser requestIdleCallback pour exécuter lorsque le navigateur est inactif
      // Avec un fallback pour les navigateurs qui ne le supportent pas
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => incrementViewCount(), { timeout: 5000 });
      } else {
        // Délai plus long pour éviter les comptages multiples
        setTimeout(incrementViewCount, 3000);
      }
    }
  }, [articleId]);

  return null;
}