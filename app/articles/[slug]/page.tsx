// app/articles/[slug]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FiCalendar, FiUser, FiEye, FiMessageSquare, FiHeart, FiShare2 } from 'react-icons/fi';
import { articleService } from '@/services/firebase/articleService';
import { CommentService } from '@/services/firebase/commentService';
import { categoryService } from '@/services/firebase/categoryService';
import { formatDate } from '@/utils/helpers';
import { Article, ArticleStatus } from '@/types/article';
import { Comment as CommentType, CommentStatus } from '@/types/comment';
import { Category } from '@/types/category';
import CommentsList from '@/components/comment/CommentList';
import ShareButtons from '@/components/article/ShareButtons';
import CommentForm from '@/components/comment/CommentForm';
import ArticleRelated from '@/components/article/ArticleRelated';
import Loader from '@/components/loader';

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);

  useEffect(() => {
    async function fetchArticleData() {
      try {
        setLoading(true);
        
        // Récupérer tous les articles pour trouver celui avec le slug correspondant
        const { articles } = await articleService.getArticles({
          status: ArticleStatus.PUBLISHED,
          limit: 100
        });
        
        const foundArticle = articles.find(article => article.slug === slug);
        
        if (!foundArticle) {
          setError('Article non trouvé');
          setLoading(false);
          return;
        }
        
        setArticle(foundArticle);
        
        // Récupérer les commentaires approuvés pour cet article
        const allComments = await CommentService.getCommentsByArticleId(foundArticle.id);
        const approvedComments = allComments.filter(
          comment => comment.status === CommentStatus.APPROVED
        );
        setComments(approvedComments);
        
        // Récupérer les catégories de l'article
        const articleCategories = await Promise.all(
          foundArticle.categoryIds.map(async (id) => {
            const category = await categoryService.getCategoryById(id);
            return category;
          })
        );
        setCategories(articleCategories.filter((category): category is Category => category !== null));
        
        // Récupérer les articles similaires (même catégorie)
        if (foundArticle.categoryIds.length > 0) {
          const { articles: related } = await articleService.getArticles({
            status: ArticleStatus.PUBLISHED,
            categoryId: foundArticle.categoryIds[0],
            limit: 3
          });
          
          // Filtrer pour exclure l'article courant
          const filteredRelated = related.filter(a => a.id !== foundArticle.id);
          setRelatedArticles(filteredRelated);
        }
      } catch (err) {
        console.error('Error fetching article data:', err);
        setError('Une erreur est survenue lors du chargement des données');
      } finally {
        setLoading(false);
      }
    }
    
    if (slug) {
      fetchArticleData();
    }
  }, [slug]);

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

  if (loading || !article) {
    return <Loader />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Barre de navigation des catégories */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map(category => (
          <Link 
            key={category?.id} 
            href={`/categories/${category?.slug}`}
            className={`text-xs px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition`}
            style={{ backgroundColor: category?.color ? `${category.color}20` : undefined }}
          >
            {category?.name}
          </Link>
        ))}
      </div>
      
      {/* Titre de l'article */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
        {article.title}
      </h1>
      
      {/* Métadonnées de l'article */}
      <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-8">
        <div className="flex items-center">
          <FiCalendar className="mr-1" />
          <span>{formatDate(article.publishedAt)}</span>
        </div>
        
        <div className="flex items-center">
          <FiUser className="mr-1" />
          <span>{article.authorName}</span>
        </div>
        
        <div className="flex items-center">
          <FiEye className="mr-1" />
          <span>{article.viewCount} vues</span>
        </div>
        
        <div className="flex items-center">
          <FiMessageSquare className="mr-1" />
          <span>{article.commentCount} commentaires</span>
        </div>
      </div>
      
      {/* Image principale */}
      <div className="relative w-full h-[40vh] md:h-[60vh] mb-8 rounded-lg overflow-hidden">
        <Image 
          src={article.imageUrl} 
          alt={article.title} 
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          priority
        />
        {article.imageCredit && (
          <div className="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2">
            Crédit: {article.imageCredit}
          </div>
        )}
      </div>
      
      {/* Contenu de l'article */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          {/* Résumé */}
          <div className="font-medium text-xl text-gray-700 mb-6 italic">
            {article.summary}
          </div>
          
          {/* Contenu principal */}
          <div 
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
          
          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map(tag => (
                  <Link 
                    key={tag} 
                    href={`/tags/${tag}`}
                    className="text-sm px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {/* Sources */}
          {article.sources && article.sources.length > 0 && (
            <div className="mb-12">
              <h3 className="text-lg font-semibold mb-2">Sources</h3>
              <ul className="list-disc pl-5">
                {article.sources.map((source, index) => (
                  <li key={index}>
                    <a 
                      href={source.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {source.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Boutons de partage */}
          <div className="flex items-center justify-between border-t border-b py-4 mb-8">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1 text-gray-600 hover:text-red-500">
                <FiHeart />
                <span>{article.likeCount}</span>
              </button>
              <button className="flex items-center gap-1 text-gray-600 hover:text-blue-500">
                <FiShare2 />
                <span>{article.shareCount}</span>
              </button>
            </div>
            
            <ShareButtons 
              url={`/articles/${article.slug}`} 
              title={article.title} 
              summary={article.summary}
            />
          </div>
          
          {/* Commentaires */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">
              Commentaires ({comments.length})
            </h2>
            
            <CommentsList comments={comments} />
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Laisser un commentaire</h3>
              <CommentForm articleId={article.id} />
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* À propos de l'auteur */}
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-2">À propos de l'auteur</h3>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-gray-300"></div>
              <div>
                <div className="font-medium">{article.authorName}</div>
                <div className="text-sm text-gray-600">Auteur</div>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Biographie de l'auteur à compléter...
            </p>
          </div>
          
          {/* Articles similaires */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Articles similaires</h3>
            <ArticleRelated articles={relatedArticles} />
          </div>
        </div>
      </div>
    </div>
  );
}