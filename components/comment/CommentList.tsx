// components/comments/CommentsList.tsx
import React from 'react';
import { FiUser, FiCalendar, FiThumbsUp, FiMessageSquare } from 'react-icons/fi';
import { Comment } from '@/types/comment';
import { formatDate } from '@/utils/helpers';

interface CommentsListProps {
  comments: Comment[];
}

const CommentsList: React.FC<CommentsListProps> = ({ comments }) => {
  // Organiser les commentaires en structure hiérarchique
  const organizeComments = (comments: Comment[]): {
    parentComments: Comment[];
    childrenMap: Record<string, Comment[]>;
  } => {
    const parentComments: Comment[] = [];
    const childrenMap: Record<string, Comment[]> = {};

    comments.forEach((comment) => {
      if (!comment.parentId) {
        // C'est un commentaire parent
        parentComments.push(comment);
      } else {
        // C'est une réponse
        if (!childrenMap[comment.parentId]) {
          childrenMap[comment.parentId] = [];
        }
        childrenMap[comment.parentId].push(comment);
      }
    });

    // Trier par date de création (du plus récent au plus ancien)
    parentComments.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    for (const parentId in childrenMap) {
      childrenMap[parentId].sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }

    return { parentComments, childrenMap };
  };

  const { parentComments, childrenMap } = organizeComments(comments);

  // Composant récursif pour afficher un commentaire et ses réponses
  const CommentItem = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => {
    const replies = childrenMap[comment.id] || [];
    
    // Générer une couleur pastel aléatoire mais cohérente basée sur le nom d'utilisateur
    const getInitialsBgColor = () => {
      const colors = [
        'bg-blue-100 text-blue-600', 
        'bg-purple-100 text-purple-600',
        'bg-green-100 text-green-600', 
        'bg-amber-100 text-amber-600',
        'bg-red-100 text-red-600', 
        'bg-pink-100 text-pink-600'
      ];
      
      const hash = comment.userName.split('').reduce((acc, char) => {
        return acc + char.charCodeAt(0);
      }, 0);
      
      return colors[hash % colors.length];
    };

    return (
      <div className={`${depth > 0 ? 'ml-8 pl-6 border-l-2 border-gray-200' : ''} transition-all`}>
        <div className={`bg-white p-5 rounded-xl mb-4 shadow-sm border border-gray-100 hover:border-gray-200 ${depth > 0 ? 'border-l-blue-300' : ''}`}>
          <div className="flex justify-between mb-3">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium mr-3 ${getInitialsBgColor()}`}>
                {comment.userName.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium">{comment.userName}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <FiCalendar className="mr-1" />
              <span>{formatDate(comment.createdAt)}</span>
            </div>
          </div>
          <div className="text-gray-700 mb-4 pl-3 border-l-2 border-gray-200 py-1">{comment.content}</div>
          <div className="flex items-center justify-between text-sm">
            <button className="flex items-center text-gray-500 hover:text-blue-500 transition">
              <FiThumbsUp className="mr-1" />
              <span>{comment.likes}</span>
            </button>
            
            <button className="flex items-center text-gray-500 hover:text-blue-500 transition">
              <FiMessageSquare className="mr-1" />
              <span>Répondre</span>
            </button>
          </div>
        </div>

        {/* Afficher les réponses de manière récursive */}
        {replies.map((reply) => (
          <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {parentComments.length === 0 ? (
        <div className="bg-gray-50 text-gray-500 text-center py-10 rounded-xl border border-dashed border-gray-300">
          <FiMessageSquare className="mx-auto text-3xl mb-3 text-gray-400" />
          <p className="font-medium">Il n'y a pas encore de commentaires.</p>
          <p className="text-sm mt-1">Soyez le premier à partager votre avis !</p>
        </div>
      ) : (
        parentComments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))
      )}
    </div>
  );
};

export default CommentsList;