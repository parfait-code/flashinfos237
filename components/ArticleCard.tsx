// components/ArticleCard.tsx
import { Article } from '@/types/article';
import { Category } from '@/types/category';
import { formatDate } from '@/utils/helpers';
import Image from 'next/image';
import Link from 'next/link';

type ArticleCardProps = {
  article: Article;
  categories?: Category[];
};

export default function ArticleCard({ article, categories = [] }: ArticleCardProps) {
  // Trouver les catégories de l'article
  const articleCategories = categories.filter(category => 
    article.categoryIds.includes(category.id)
  );

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition duration-300 flex flex-col h-full border border-gray-100">
      <Link href={`/articles/${article.slug}`}>
        <div className="relative h-56 w-full">
          <Image 
            src={article.imageUrl || '/image.svg'} 
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {article.featured && (
            <div className="absolute top-3 left-3 bg-yellow-500 text-white px-3 py-1 text-xs font-bold rounded-full shadow-md">
              À la une
            </div>
          )}
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent h-24 opacity-70"></div>
        </div>
      </Link>
      
      <div className="p-5 flex-grow flex flex-col">
        {/* Catégories */}
        <div className="flex flex-wrap gap-2 mb-3 -mt-8 relative z-10">
          {articleCategories.slice(0, 2).map(category => (
            <Link 
              href={`/categories/${category.slug}`} 
              key={category.id}
              className="no-underline"
              onClick={(e) => e.stopPropagation()}
            >
              <span 
                className="text-white text-xs font-bold px-3 py-1 rounded-full shadow-md"
                style={{ backgroundColor: category.color || '#4B5563' }}
              >
                {category.name}
              </span>
            </Link>
          ))}
        </div>
        
        <Link href={`/articles/${article.slug}`} className="no-underline">
          <h2 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">{article.title}</h2>
        </Link>
        
        <p className="text-gray-600 text-sm mb-3 flex items-center">
          <span className="font-medium text-nowrap">Par {article.authorName}</span>
          <span className="mx-2">•</span>
          <span className='text-nowrap'>{formatDate(article.publishedAt)}</span>
        </p>
        
        <p className="text-gray-700 line-clamp-3 mb-4">{article.summary}</p>
        
        <div className="mt-auto">
          <div className="flex flex-wrap gap-2">
            {article.tags.slice(0, 3).map(tag => (
              <span key={tag} className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
          
          {/* <div className="flex justify-between items-center mt-4 text-gray-500 text-sm">
            <div className="flex space-x-4">
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {article.viewCount}
              </span>
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {article.commentCount}
              </span>
            </div>
          </div> */}
        </div>
      </div>
    </article>
  );
}