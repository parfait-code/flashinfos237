// components/comment/CommentsSection.tsx
'use client';

import { useState } from 'react';
import { Comment, CommentStatus } from '@/types/comment';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import CommentService from '@/services/firebase/commentService';

interface CommentsSectionProps {
  articleId: string;
  initialComments: Comment[];
}

export function CommentsSection({ articleId, initialComments }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);

  // Gestion de l'ajout d'un commentaire
  const handleCommentSubmit = async (newComment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const comment = await CommentService.addComment(newComment);
      // Si le commentaire est automatiquement approuvé (ce qui n'est pas le cas par défaut)
      // on l'ajoute à la liste
      if (comment.status === CommentStatus.APPROVED) {
        setComments(prevComments => [comment, ...prevComments]);
      }
      return true;
    } catch (error) {
      console.error('Failed to add comment:', error);
      return false;
    }
  };

  // API endpoint pour incrémenter le compteur de vues
  const updateViewCount = async () => {
    try {
      await fetch(`/api/articles/${articleId}/view`, { method: 'POST' });
    } catch (error) {
      console.error('Failed to update view count:', error);
    }
  };

  // Mettre à jour le compteur de vues lors du chargement de la page
  useState(() => {
    updateViewCount();
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
        Commentaires ({comments.length})
      </h2>
      <CommentForm 
        articleId={articleId} 
        onSubmit={handleCommentSubmit} 
      />
      <CommentList comments={comments} />
    </div>
  );
}