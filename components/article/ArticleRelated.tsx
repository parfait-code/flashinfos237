// components/articles/ArticleRelated.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiCalendar } from 'react-icons/fi';
import { Article } from '@/types/article';
import { formatDate } from '@/utils/helpers';

interface ArticleRelatedProps {
  articles: Article[];
}

const ArticleRelated: React.FC<ArticleRelatedProps> = ({ articles }) => {
  return (
    <div className="space-y-4">
      {articles.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          Aucun article similaire trouvé.
        </p>
      ) : (
        articles.map((article) => (
          <Link 
            key={article.id} 
            href={`/articles/${article.slug}`}
            className="block group"
          >
            <div className="flex gap-3">
              <div className="relative w-20 h-20 rounded overflow-hidden flex-shrink-0">
                <Image 
                  src={article.imageUrl} 
                  alt={article.title} 
                  fill
                  className="object-cover group-hover:scale-105 transition"
                  sizes="80px"
                />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 line-clamp-2 group-hover:text-blue-600">
                  {article.title}
                </h4>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <FiCalendar className="mr-1" />
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default ArticleRelated;