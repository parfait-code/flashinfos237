// app/articles/[slug]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import './articleContent.css'
import { FiCalendar, FiUser, FiEye, FiMessageSquare, FiArrowLeft, FiThumbsUp } from 'react-icons/fi';
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
import { pageViewService } from '@/services/firebase/pageViewService';
import Script from 'next/script';


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
  const [hasLiked, setHasLiked] = useState<boolean>(false);

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


        // ajouter les vue de l'article ---------------
        // Vérifier si l'article a déjà été vu dans cette session
        // const viewedArticles = JSON.parse(localStorage.getItem('viewedArticles') || '{}');
        // const hasBeenViewed = viewedArticles[foundArticle.id];
        
        // if (!hasBeenViewed) {
          // Incrémenter le compteur de vues seulement si pas encore vu
          await articleService.incrementViewCount(foundArticle.id);
          
          // Enregistrer la vue dans la collection pageViews
          await pageViewService.recordPageView(foundArticle.id);
          
          // Marquer l'article comme vu
          // viewedArticles[foundArticle.id] = true;
          // localStorage.setItem('viewedArticles', JSON.stringify(viewedArticles));
        // }
        // finajout des vues--------------------------------------------

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

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [slug]);
  
    const handleLikeClick = async () => {
    if (hasLiked || !article) return; // Éviter les likes multiples
    
    try {
      await articleService.incrementLikeCount(article.id);
      
      // Mettre à jour l'état local pour refléter le like
      setArticle({
        ...article,
        likeCount: article.likeCount + 1
      });
      
      // Marquer l'article comme aimé dans le localStorage pour éviter les likes multiples
      const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '{}');
      likedArticles[article.id] = true;
      localStorage.setItem('likedArticles', JSON.stringify(likedArticles));
      
      setHasLiked(true);
    } catch (err) {
      console.error('Erreur lors de l\'ajout du like:', err);
    }
  };

  // Vérifier si l'article a déjà été aimé lors du chargement
  useEffect(() => {
    if (article) {
      const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '{}');
      setHasLiked(!!likedArticles[article.id]);
    }
  }, [article]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 text-red-800 p-6 rounded-xl shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold mb-3">Erreur</h2>
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => router.push('/')}
            className="mt-2 px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center gap-2 shadow-sm"
          >
            <FiArrowLeft />
            Retour à l&apos;accueil
          </button>
        </div>
      </div>
    );
  }

  if (loading || !article) {
    return <Loader />;
  }

  // Créer l'objet JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.summary || '',
    "image": article.imageUrl || '',
    "datePublished": article.publishedAt ? new Date(article.publishedAt).toISOString() : undefined,
    "author": {
      "@type": "Person",
      "name": article.authorName || ''
    },
    "publisher": {
      "@type": "Organization",
      "name": "flashinfos237",
      "logo": {
        "@type": "ImageObject",
        "url": "https://flashinfos237.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://flashinfos237.com/articles/${article.slug}`
    }
  };

  return (
    <>
    <Script
        id="article-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <div className=" mx-auto px-4 py-10 container">
      {/* Bouton de retour */}
      <div className="mb-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-blue-600 transition"
        >
          <FiArrowLeft className="mr-2" />
          <span>Retour</span>
        </button>
      </div>
      
      {/* Barre de navigation des catégories */}
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map(category => (
          <Link 
            key={category?.id} 
            href={`/categories/${category?.slug}`}
            className="text-xs font-medium px-4 py-1.5 rounded-full transition-all hover:shadow-md"
            style={{ 
              backgroundColor: category?.color ? `${category.color}20` : undefined,
              color: category?.color || 'inherit',
              border: `1px solid ${category?.color}50` || 'inherit'
            }}
          >
            {category?.name}
          </Link>
        ))}
      </div>
      
      {/* Titre de l'article */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-gray-900">
        {article.title}
      </h1>
      
      {/* Métadonnées de l'article */}
      <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-10">
        <div className="flex items-center">
          <FiCalendar className="mr-2 text-blue-500" />
          <span>{formatDate(article.publishedAt)}</span>
        </div>
        
        <div className="flex items-center">
          <FiUser className="mr-2 text-blue-500" />
          <span>{article.authorName}</span>
        </div>
        
        <div className="flex items-center">
          <FiEye className="mr-2 text-blue-500" />
          <span>{article.viewCount} vues</span>
        </div>
        
        <div className="flex items-center">
          <FiMessageSquare className="mr-2 text-blue-500" />
          <span>{comments.length } commentaires</span>
        </div>
      </div>
      
      {/* Image principale avec overlay */}
      <div className="relative w-full h-[40vh] md:h-[60vh] mb-12 rounded-xl overflow-hidden shadow-xl">
        <Image 
          src={article.imageUrl || "/image.svg"} 
          alt={article.title} 
          fill
          className="object-cover transition-transform hover:scale-105 duration-700"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        {article.imageCredit && (
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white text-xs px-3 py-1.5 rounded-full">
            Crédit: {article.imageCredit}
          </div>
        )}
      </div>
      
      {/* Contenu de l'article */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-3">
          {/* Résumé */}
          {/* <div className="font-medium text-xl text-gray-700 mb-8 italic border-l-4 border-blue-500 pl-6 py-2">
            {article.summary}
          </div> */}
          
          {/* Contenu principal */}
          <div 
            className="prose prose-lg article-content max-w-none mb-16 prose-headings:text-gray-800 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:shadow-md"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
          
          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mb-10">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map(tag => (
                  <Link 
                    key={tag} 
                    href={`/tags/${tag}`}
                    className="text-sm px-4 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition border border-gray-200 text-gray-700 hover:shadow-sm"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {/* Sources */}
          {article.sources && article.sources.length > 0 && (
            <div className="mb-16 bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Sources</h3>
              <ul className="list-disc pl-6 space-y-2">
                {article.sources.map((source, index) => (
                  <li key={index}>
                    <a 
                      href={source.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline hover:text-blue-800 transition"
                    >
                      {source.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Boutons de partage */}
          <div className="flex items-center justify-between border-t border-b border-gray-200 py-6 mb-12">
            <div className="flex items-center gap-6">
            <button 
              onClick={handleLikeClick}
              className={`flex items-center gap-2 transition group ${hasLiked ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'}`} disabled={hasLiked}
            >
              <FiThumbsUp className={`${hasLiked ? 'fill-current' : ''} group-hover:scale-110 transition`} />
              <span>{article.likeCount}</span>
            </button>
              {/* <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition group">
                <FiShare2 className="group-hover:scale-110 transition" />
                <span>{article.shareCount}</span>
              </button> */}
            </div>
            
            <ShareButtons 
              url={`/articles/${article.slug}`} 
              title={article.title} 
              summary={article.summary}
            />
          </div>
          
          {/* Commentaires */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-8 text-gray-800 border-b pb-4">
              Commentaires ({comments.length})
            </h2>
            
            <CommentsList comments={comments} />
            
            <div className="mt-10 bg-gray-50 rounded-xl p-4 md:p-8 border border-gray-200">
              <h3 className="text-xl font-semibold mb-6 text-gray-800">Laisser un commentaire</h3>
              <CommentForm articleId={article.id} />
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* À propos de l'auteur */}
          {/* <div className="bg-white p-6 rounded-xl mb-8 shadow-md border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">À propos de l'auteur</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-lg font-bold">
                {article.authorName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-medium text-lg">{article.authorName}</div>
                <div className="text-sm text-gray-500">Auteur</div>
              </div>
            </div>
            <p className="text-sm text-gray-600 italic border-l-2 border-blue-300 pl-3">
              Biographie de l'auteur à compléter...
            </p>
          </div> */}
          
          {/* Articles similaires */}

          <div className="sticky top-6">
            <h3 className="text-lg font-semibold mb-6 text-gray-800 pb-2 border-b">Articles similaires</h3>
            <ArticleRelated articles={relatedArticles} category={categories[0].name} />
          </div>
        </div>
      </div>
    </div>
    </>
  );
}