// app/sitemap.ts
import { MetadataRoute } from 'next'
import { articleService } from '@/services/firebase/articleService'
import { categoryService } from '@/services/firebase/categoryService'
import { ArticleStatus } from '@/types/article'

// Types corrects pour changeFrequency
type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // URL de base du site
  const baseUrl = 'https://flashinfos237.com'

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
    // Créer une date de dernière modification en utilisant publishedAt ou updatedAt si disponible
    const lastMod = article.updatedAt ? new Date(article.updatedAt) : 
                     article.publishedAt ? new Date(article.publishedAt) : 
                     new Date()
    
    return {
      url: `${baseUrl}/articles/${article.slug}`,
      lastModified: lastMod,
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: 0.6,
    }
  })

  // Combiner toutes les entrées
  return [...staticPages, ...categoryEntries, ...articleEntries]
}