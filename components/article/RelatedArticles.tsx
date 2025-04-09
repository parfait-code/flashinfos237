// components/article/RelatedArticles.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Article } from '@/types/article';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface RelatedArticlesProps {
  articles: Article[];
}

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) {
    return <p className="text-gray-500">Aucun article connexe pour le moment.</p>;
  }

  return (
    <div className="space-y-4">
      {articles.map(article => (
        <Link 
          href={`/article/${article.slug}`} 
          key={article.id}
          className="group block"
        >
          <div className="flex space-x-3">
            <div className="w-20 h-20 relative flex-shrink-0">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover rounded-md"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 group-hover:text-red-600 transition line-clamp-2">
                {article.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {article.publishedAt ? format(new Date(article.publishedAt), 'dd MMM yyyy', { locale: fr }) : ''}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}