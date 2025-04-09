// app/articles/[slug]/page.tsx
import Image from 'next/image';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Article } from '@/types/article';
import { CommentStatus } from '@/types/comment';
import { categoryService } from '@/services/firebase/categoryService';
import CommentService from '@/services/firebase/commentService';
import TagList from '@/components/article/TagList';
import RelatedArticles from '@/components/article/RelatedArticles';
import ShareButtons from '@/components/article/ShareButtons';
import { Metadata } from 'next';
import { CommentsSection } from '@/components/comment/CommentsSection';
import Link from 'next/link';import { HiCalendarDateRange } from 'react-icons/hi2';
import { FaClock, FaEye } from 'react-icons/fa';
import './articleContent.css';
// Importez le composant ViewCounter
import ViewCounter from '@/components/article/ViewCounter';


// Pour l'optimisation des métadonnées dynamiques (SEO)
export async function generateMetadata(
  props: { params: { slug: string } }
): Promise<Metadata>  {
  const { params } = props;
  const article = await getArticleBySlug(params.slug);
  
  if (!article) {
    return {
      title: 'Article non trouvé | FlashInfos237'
    };
  }

  return {
    title: `${article.title} | FlashInfos237`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      images: [{ url: article.imageUrl }],
      type: 'article',
      publishedTime: article.publishedAt?.toISOString(),
    }
  };
}

// Fonction pour récupérer un article par son slug
async function getArticleBySlug(slug: string) {
  try {
    const articlesRef = collection(db, 'articles');
    const q = query(articlesRef, where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const articleDoc = querySnapshot.docs[0];
    return {
      id: articleDoc.id,
      ...articleDoc.data(),
      createdAt: articleDoc.data().createdAt.toDate(),
      updatedAt: articleDoc.data().updatedAt.toDate(),
      publishedAt: articleDoc.data().publishedAt ? articleDoc.data().publishedAt.toDate() : null
    } as Article;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

// Page principale
export default async function ArticlePage({ params }: { params: { slug: string } }) {
  // Récupérer les données nécessaires
  const article = await getArticleBySlug(params.slug);
  
  if (!article) {
    // Gérer le cas où l'article n'existe pas
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4">Article non trouvé</h1>
          <p>L&apos;article que vous recherchez n&apos;existe pas ou a été supprimé.</p>
          <Link href="/" className="mt-4 inline-block bg-red-600 text-white px-4 py-2 rounded-md">
            Retourner à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }
  
  // Récupérer les catégories
  const categories = await categoryService.getCategories(true);
  const categoryNames = categories
    .filter(cat => article.categoryIds.includes(cat.id))
    .map(cat => cat.name);
    
  // Récupérer les commentaires approuvés
  const allComments = await CommentService.getCommentsByArticleId(article.id);
  const approvedComments = allComments.filter(comment => comment.status === CommentStatus.APPROVED);
  
  // Récupérer les articles connexes
  const relatedArticlesResult = await fetchRelatedArticles(article);
  
  const publishDate = article.publishedAt 
    ? format(new Date(article.publishedAt), 'dd MMMM yyyy à HH:mm', { locale: fr })
    : null;

  return (
    <main className="bg-gray-50">
      <ViewCounter articleId={article.id} />
      {/* Hero section */}
      {/* Hero section - Version améliorée et corrigée */}
      <div className="relative w-full h-[400px] md:h-[450px] lg:h-[500px] bg-gray-900">
        <Image
          src={article.imageUrl.length>0 ? article.imageUrl : "/image.svg"}
          alt={article.title || "Image de l'article"}
          fill
          priority
          className="object-cover z-0"
        />
      
        {/* <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div> */}
      
        {/* Contenu du header */}
        <div className="z-10 container mx-auto h-full flex flex-col justify-end px-4 md:px-8 pb-8">
          <div className="max-w-4xl">
            {/* Catégories */}
            {categoryNames && categoryNames.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {categoryNames.map((category, index) => (
                  <span 
                    key={index} 
                    className="bg-red-600 text-white px-3 py-1.5 text-sm font-medium rounded-md shadow-sm hover:bg-red-700 transition"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}
            
            {/* Titre de l'article avec un style plus impactant */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6 drop-shadow-md">
              {article.title}
            </h1>
            
            {/* Métadonnées de l'article dans un design amélioré */}
            <div className="flex flex-wrap items-center gap-4 text-white">
              {/* Avatar de l'auteur */}
              {article.authorName && (
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-2 shadow-sm border-2 border-white">
                    <span className="text-lg font-bold text-gray-700">
                      {article.authorName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium">{article.authorName}</span>
                </div>
              )}
              
              {/* Date de publication */}
              {publishDate && (
                <div className="flex items-center">
                  <HiCalendarDateRange className="w-5 h-5 mr-1.5 text-gray-300" />
                  <span>{publishDate}</span>
                </div>
              )}
              
              {/* Temps de lecture */}
              <div className="flex items-center">
                <FaClock className="w-5 h-5 mr-1.5 text-gray-300" />
                <span>{Math.ceil((article.content?.split(' ')?.length || 0) / 200)} min de lecture</span>
              </div>
              
              {/* Vues */}
              {typeof article.viewCount === 'number' && (
                <div className="flex items-center">
                  <FaEye className="w-5 h-5 mr-1.5 text-gray-300" />
                  <span>{article.viewCount} vues</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Article content */}
      <div className="container mx-auto px-4 py-8">
        {/* Première section: Article et Sidebar */}
        <div className="flex flex-col lg:flex-row lg:gap-8">
          {/* Main content */}
          <div className="lg:w-2/3 flex flex-col">
            <article className="bg-white rounded-lg shadow-md p-6 mb-8">
              {/* Contenu de l'article */}
              <div 
                className="prose prose-lg max-w-none article-content"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
              
              {/* Source information */}
              {article.sources && article.sources.length > 0 && (
                <div className="mt-8 pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-semibold mb-2">Sources:</h3>
                  <ul className="list-disc pl-5">
                    {article.sources?.map((source, index) => (
                      <li key={index}>
                        <Link
                          href={source.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {source.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Tags */}
              {article.tags.length > 0 && (
                <div className="mt-6 mb-4">
                  <TagList tags={article.tags} />
                </div>
              )}
              
              {/* Share buttons */}
              <div className="mt-8 border-t border-gray-200 pt-6">
                <ShareButtons 
                  title={article.title} 
                  url={`https://flashinfos237.com/articles/${article.slug}`} 
                />
              </div>
              
              {/* Author info */}
              <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                    <span className="text-xl font-bold text-gray-700">
                      {article.authorName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold">{article.authorName}</h3>
                    <p className="text-sm text-gray-600">Journaliste à FlashInfos237</p>
                  </div>
                </div>
              </div>
            </article>
            
            {/* Comments section - maintenant à l'intérieur de la colonne principale */}
            <div className="w-full mb-(">
              <CommentsSection articleId={article.id} initialComments={approvedComments} />
            </div>
          </div>
          
          {/* Sidebar */}
          <aside className="lg:w-1/3">
            {/* Related articles */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Articles connexes</h2>
              <RelatedArticles articles={relatedArticlesResult} />
            </div>
            
            {/* Newsletter subscription */}
            <div className="bg-red-600 text-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-2">Restez informé</h2>
              <p className="mb-4">Recevez les dernières actualités du Cameroun directement dans votre boîte mail.</p>
              <form className="flex flex-col space-y-3">
                <input 
                  type="email" 
                  placeholder="Votre adresse email" 
                  className="px-4 py-2 rounded-md text-gray-900"
                  required
                />
                <button 
                  type="submit" 
                  className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
                >
                  S&apos;abonner
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

// Fonction pour récupérer les articles connexes
async function fetchRelatedArticles(article: Article) {
  try {
    // Create a query for articles in the same category
    const articlesRef = collection(db, 'articles');
    const q = query(
      articlesRef,
      where('categoryIds', 'array-contains', article.categoryIds[0]),
      where('status', '==', 'published'),
      limit(4)
    );
    
    const querySnapshot = await getDocs(q);
    const articles: Article[] = [];
    
    querySnapshot.forEach((doc) => {
      // Exclure l'article actuel
      if (doc.id !== article.id) {
        articles.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
          updatedAt: doc.data().updatedAt.toDate(),
          publishedAt: doc.data().publishedAt ? doc.data().publishedAt.toDate() : null
        } as Article);
      }
    });
    
    // Limiter à 3 articles maximum
    return articles.slice(0, 3);
  } catch (error) {
    console.error('Error fetching related articles:', error);
    return [];
  }
}

