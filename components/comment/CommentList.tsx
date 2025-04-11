// components/comments/CommentsList.tsx
import React from 'react';
import { FiUser, FiCalendar, FiThumbsUp } from 'react-icons/fi';
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

    return (
      <div className={`${depth > 0 ? 'ml-6 pl-6 border-l border-gray-200' : ''}`}>
        <div className="bg-white p-4 rounded-lg mb-4">
          <div className="flex justify-between mb-2">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 mr-2">
                <FiUser />
              </div>
              <span className="font-medium">{comment.userName}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <FiCalendar className="mr-1" />
              <span>{formatDate(comment.createdAt)}</span>
            </div>
          </div>
          <div className="text-gray-700 mb-2">{comment.content}</div>
          <div className="flex items-center text-sm text-gray-500">
            <button className="flex items-center hover:text-blue-500">
              <FiThumbsUp className="mr-1" />
              <span>{comment.likes}</span>
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
    <div className="space-y-4">
      {parentComments.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          Il n'y a pas encore de commentaires. Soyez le premier à commenter !
        </p>
      ) : (
        parentComments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))
      )}
    </div>
  );
};

export default CommentsList;