
// components/comment/CommentList.tsx
import { Comment } from '@/types/comment';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FiThumbsUp } from 'react-icons/fi';

interface CommentListProps {
  comments: Comment[];
}

export default function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        Aucun commentaire pour le moment. Soyez le premier à réagir!
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-8">
      {comments.map((comment) => (
        <div key={comment.id} className="border-b border-gray-200 pb-6 last:border-0">
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
              <span className="text-lg font-bold text-gray-700">
                {comment.userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-gray-900">{comment.userName}</h4>
                <span className="text-sm text-gray-500">
                  {format(new Date(comment.createdAt), 'dd MMM yyyy, HH:mm', { locale: fr })}
                </span>
              </div>
              <p className="text-gray-700 whitespace-pre-line">{comment.content}</p>
              
              <div className="flex items-center mt-3 text-sm">
                <button className="flex items-center text-gray-500 hover:text-red-600 transition">
                  <FiThumbsUp className="mr-1" /> 
                  <span>J&apos;aime{comment.likes > 0 ? ` (${comment.likes})` : ''}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}