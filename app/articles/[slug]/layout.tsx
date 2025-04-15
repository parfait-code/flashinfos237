// app/articles/[slug]/layout.tsx
import { Metadata } from 'next';
import { articleService } from '@/services/firebase/articleService';
import { ArticleStatus } from '@/types/article';

// Mise à jour du type Props pour refléter que params est une Promise
type Props = {
  params: Promise<{ slug: string }>
  children: React.ReactNode
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  try {
    // Attendre la résolution de params avant d'utiliser ses propriétés
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    
    // Récupérer tous les articles pour trouver celui avec le slug correspondant
    const { articles } = await articleService.getArticles({
      status: ArticleStatus.PUBLISHED,
      limit: 100
    });
    
    const article = articles.find(article => article.slug === slug);
    
    // Si l'article n'est pas trouvé, retourner des métadonnées par défaut
    if (!article) {
      return {
        title: 'Article non trouvé',
        description: 'Cet article n\'existe pas ou n\'est plus disponible.'
      };
    }
    
    // Convertir et vérifier la date de publication avant de la transformer en ISO string
    let publishedTimeISO;
    if (article.publishedAt) {
      const publishedDate = new Date(article.publishedAt);
      // Vérifier si la date est valide avant de la convertir
      if (!isNaN(publishedDate.getTime())) {
        publishedTimeISO = publishedDate.toISOString();
      }
    }
    
    // Créer les balises Open Graph pour le partage sur les réseaux sociaux
    return {
      title: article.title,
      description: article.summary || `Découvrez l'article "${article.title}" sur notre site.`,
      openGraph: {
        title: article.title,
        description: article.summary || `Découvrez l'article "${article.title}" sur notre site.`,
        images: article.imageUrl ? [{ url: article.imageUrl }] : undefined,
        type: 'article',
        publishedTime: publishedTimeISO,
        authors: article.authorName ? [article.authorName] : undefined,
        tags: article.tags || []
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.summary || `Découvrez l'article "${article.title}" sur notre site.`,
        images: article.imageUrl ? [article.imageUrl] : undefined
      }
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des métadonnées:', error);
    return {
      title: 'Erreur de chargement',
      description: 'Une erreur est survenue lors du chargement de l\'article.'
    };
  }
}

// Mise à jour également du type dans la définition du layout
export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return children;
}