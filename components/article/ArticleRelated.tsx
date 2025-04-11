// components/articles/ArticleRelated.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiCalendar, FiArrowRight } from 'react-icons/fi';
import { Article } from '@/types/article';
import { formatDate } from '@/utils/helpers';

interface ArticleRelatedProps {
  articles: Article[];
}

const ArticleRelated: React.FC<ArticleRelatedProps> = ({ articles }) => {
  return (
    <div className="space-y-6">
      {articles.length === 0 ? (
        <div className="text-gray-500 text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p>Aucun article similaire trouvé.</p>
        </div>
      ) : (
        articles.map((article) => (
          <Link 
            key={article.id} 
            href={`/articles/${article.slug}`}
            className="block group bg-white p-3 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
          >
            <div className="flex flex-col gap-3">
              <div className="relative w-full h-32 rounded-lg overflow-hidden">
                <Image 
                  src={article.imageUrl} 
                  alt={article.title} 
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-70"></div>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 line-clamp-2 group-hover:text-blue-600 transition">
                  {article.title}
                </h4>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center text-xs text-gray-500">
                    <FiCalendar className="mr-1" />
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                  <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center text-xs font-medium">
                    Lire <FiArrowRight className="ml-1" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))
      )}
      
      <Link 
        href="/articles"
        className="flex items-center justify-center text-sm text-blue-600 hover:text-blue-800 transition mt-4 py-2 border-t border-gray-100"
      >
        Voir tous les articles <FiArrowRight className="ml-2" />
      </Link>
    </div>
  );
};

export default ArticleRelated;