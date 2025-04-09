// components/article/TagList.tsx
import Link from 'next/link';

interface TagListProps {
  tags: string[];
}

export default function TagList({ tags }: TagListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <Link 
          href={`/tag/${encodeURIComponent(tag)}`} 
          key={index}
          className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition"
        >
          #{tag}
        </Link>
      ))}
    </div>
  );
}