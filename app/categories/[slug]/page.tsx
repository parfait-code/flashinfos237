// app/categories/[slug]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { categoryService } from '@/services/firebase/categoryService';
import { articleService } from '@/services/firebase/articleService';
import { Article, ArticleStatus } from '@/types/article';
import { Category } from '@/types/category';
import ArticleCard from '@/components/ArticleCard';
import Loader from '@/components/loader';
import { QueryDocumentSnapshot } from 'firebase/firestore';

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    async function fetchCategoryAndArticles() {
      try {
        setLoading(true);
        // Récupérer toutes les catégories
        const allCategories = await categoryService.getCategories();
        setCategories(allCategories);
        
        // Trouver la catégorie par slug
        const foundCategory = allCategories.find(cat => cat.slug === slug);
        
        if (!foundCategory) {
          setError('Catégorie non trouvée');
          setLoading(false);
          return;
        }
        
        setCategory(foundCategory);
        
        // Charger les articles de cette catégorie
        const { articles: categoryArticles, lastVisible: lastDoc } = await articleService.getArticles({
          categoryId: foundCategory.id,
          status: ArticleStatus.PUBLISHED,
          limit: 10
        });
        
        setArticles(categoryArticles);
        setLastVisible(lastDoc);
        setHasMore(categoryArticles.length === 10);
        
      } catch (err) {
        setError('Une erreur est survenue lors du chargement des données');
        console.error('Error fetching category data:', err);
      } finally {
        setLoading(false);
      }
    }
    
    if (slug) {
      fetchCategoryAndArticles();
    }
  }, [slug]);

  const loadMoreArticles = async () => {
    if (!category || !hasMore) return;
    
    try {
      setLoading(true);
      const { articles: moreArticles, lastVisible: lastDoc } = await articleService.getArticles({
        categoryId: category.id,
        status: ArticleStatus.PUBLISHED,
        limit: 10,
        lastVisible
      });
      
      if (moreArticles.length < 10) {
        setHasMore(false);
      }
      
      setArticles(prev => [...prev, ...moreArticles]);
      setLastVisible(lastDoc);
    } catch (err) {
      console.error('Error loading more articles:', err);
      setError('Impossible de charger plus d\'articles');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 text-red-800 p-4 rounded-lg shadow max-w-md w-full">
          <h2 className="text-xl font-bold mb-2">Erreur</h2>
          <p>{error}</p>
          <button 
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Retour à l&apos;accueil
          </button>
        </div>
      </div>
    );
  }

  if (loading && articles.length === 0) {
    return (
      <Loader/>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {category && (
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-2">
            <Link href="/" className="text-gray-500 hover:text-blue-600">
              Accueil
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-gray-800 font-medium">
              {category.name}
            </span>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-3xl font-bold mb-2" style={category.color ? { color: category.color } : {}}>
              {category.name}
            </h1>
            {category.description && (
              <p className="text-gray-600 mb-4">{category.description}</p>
            )}
            {category.imageUrl && (
              <div className="relative h-40 w-full rounded-lg overflow-hidden mb-4">
                <Image 
                  src={category.imageUrl} 
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map(article => (
          <ArticleCard key={article.id} article={article} categories={categories} />
        ))}
      </div>

      {articles.length === 0 && !loading && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Aucun article disponible</h2>
          <p className="text-gray-600">
            Il n&apos;y a pas encore d&apos;articles publiés dans cette catégorie.
          </p>
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMoreArticles}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Chargement...
              </>
            ) : (
              "Charger plus d'articles"
            )}
          </button>
        </div>
      )}
    </div>
  );
}