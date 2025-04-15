// app/categories/[slug]/layout.tsx
import { Metadata } from 'next';
import { categoryService } from '@/services/firebase/categoryService';

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
    
    // Récupérer toutes les catégories pour trouver celle avec le slug correspondant
    const categories = await categoryService.getCategories();
    const category = categories.find(cat => cat.slug === slug);
    
    // Si la catégorie n'est pas trouvée, retourner des métadonnées par défaut
    if (!category) {
      return {
        title: 'FlashInfos237 | Actualités du Cameroun et International',
        description: 'Cette catégorie n\'existe pas ou n\'est plus disponible sur FlashInfos237.'
      };
    }
    
    return {
      title: `${category.name} `,
      description: category.description || `Découvrez les dernières actualités du Cameroun et du monde dans la catégorie ${category.name} sur FlashInfos237`,
      openGraph: {
        title: `${category.name} | FlashInfos237`,
        description: category.description || `Actualités camerounaises et internationales dans la catégorie ${category.name}`,
        images: category.imageUrl ? [{ url: category.imageUrl }] : undefined,
        type: 'website',
        siteName: 'FlashInfos237'
      },
      twitter: {
        card: 'summary_large_image',
        title: `${category.name} | FlashInfos237`,
        description: category.description || `Actualités camerounaises et internationales dans la catégorie ${category.name}`,
        images: category.imageUrl ? [category.imageUrl] : undefined,
        site: '@flashinfos237'
      },
      alternates: {
        canonical: `https://flashinfos237.com/categories/${slug}`
      }
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des métadonnées:', error);
    return {
      title: 'Catégories | FlashInfos237',
      description: 'Explorez les catégories d\'actualités du Cameroun et du monde entier sur FlashInfos237'
    };
  }
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}