// components/article/ViewCounter.tsx
'use client';

import { useEffect, useRef } from 'react';

interface ViewCounterProps {
  articleId: string;
}

export default function ViewCounter({ articleId }: ViewCounterProps) {
  const hasIncremented = useRef(false);

  useEffect(() => {
    // Ne s'exécute qu'une seule fois par montage du composant
    if (hasIncremented.current) return;

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
            cache: 'no-store',
          });
          
          if (res.ok) {
            // Ajouter l'ID de l'article à la liste des articles vus
            viewedArticlesArray.push(articleId);
            sessionStorage.setItem('viewedArticles', viewedArticlesArray.join(','));
            hasIncremented.current = true;
          }
        } catch (error) {
          console.error('Failed to increment view count:', error);
        }
      };

      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => incrementViewCount(), { timeout: 5000 });
      } else {
        setTimeout(incrementViewCount, 3000);
      }
    } else {
      // Marquer comme déjà incrémenté si l'article est dans sessionStorage
      hasIncremented.current = true;
    }
  }, [articleId]);

  return null;
}