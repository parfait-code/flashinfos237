// app/sitemap.ts
import { MetadataRoute } from 'next'
import { articleService } from '@/services/firebase/articleService'
import { categoryService } from '@/services/firebase/categoryService'
import { ArticleStatus } from '@/types/article'

// Types for changeFrequency
type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

// Helper function to ensure valid dates
function ensureValidDate(dateInput: any): Date {
  if (!dateInput) return new Date();
  
  try {
    const date = new Date(dateInput);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return new Date(); // Return current date if invalid
    }
    return date;
  } catch (error) {
    return new Date(); // Return current date on any error
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // URL de base du site
  const baseUrl = 'https://flashinfos237.com'

  try {
    // Récupérer toutes les catégories
    const categories = await categoryService.getCategories()
    
    // Récupérer tous les articles publiés
    const { articles } = await articleService.getArticles({
      status: ArticleStatus.PUBLISHED,
      limit: 1000 // Ajustez selon votre volume d'articles
    })

    // Pages statiques du site
    const staticPages = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as ChangeFrequency,
        priority: 1.0,
      },
      {
        url: `${baseUrl}/categories`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as ChangeFrequency,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as ChangeFrequency,
        priority: 0.5,
      },
      {
        url: `${baseUrl}/a-propos`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as ChangeFrequency,
        priority: 0.5,
      },
    ]

    // Générer les entrées pour les catégories
    const categoryEntries = categories.map(category => ({
      url: `${baseUrl}/categories/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: 0.7,
    }))

    // Générer les entrées pour les articles
    const articleEntries = articles.map(article => {
      // Utiliser la fonction helper pour s'assurer que la date est valide
      const lastMod = article.updatedAt 
        ? ensureValidDate(article.updatedAt)
        : article.publishedAt 
          ? ensureValidDate(article.publishedAt)
          : new Date()
      
      return {
        url: `${baseUrl}/articles/${article.slug}`,
        lastModified: lastMod,
        changeFrequency: 'weekly' as ChangeFrequency,
        priority: 0.6,
      }
    })

    // Combiner toutes les entrées
    return [...staticPages, ...categoryEntries, ...articleEntries]
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return at least the static pages if there's an error
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as ChangeFrequency,
        priority: 1.0,
      }
    ];
  }
}