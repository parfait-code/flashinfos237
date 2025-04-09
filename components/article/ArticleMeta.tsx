// components/article/ArticleMeta.tsx
import { FiUser, FiClock, FiEye } from 'react-icons/fi';

interface ArticleMetaProps {
  author: string;
  date: string;
  readTime: number;
  views: number;
}

export default function ArticleMeta({ author, date, readTime, views }: ArticleMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-gray-200">
      <div className="flex items-center">
        <FiUser className="mr-1" />
        <span>{author}</span>
      </div>
      <div className="flex items-center">
        <FiClock className="mr-1" />
        <span>{date}</span>
      </div>
      <div className="flex items-center">
        <FiClock className="mr-1" />
        <span>{readTime} min de lecture</span>
      </div>
      <div className="flex items-center">
        <FiEye className="mr-1" />
        <span>{views.toLocaleString()} vues</span>
      </div>
    </div>
  );
}








