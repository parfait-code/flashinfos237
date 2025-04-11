// components/comments/CommentForm.tsx
'use client';

import React, { useState } from 'react';
import { FiSend } from 'react-icons/fi';
import { CommentService } from '@/services/firebase/commentService';
import { CommentStatus } from '@/types/comment';

interface CommentFormProps {
  articleId: string;
  parentId?: string | null;
}

const CommentForm: React.FC<CommentFormProps> = ({ articleId, parentId = null }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !content.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await CommentService.addComment({
        articleId,
        userId: null, // Pour les utilisateurs non connectés
        userName: name,
        userEmail: email || undefined,
        content,
        parentId,
        status: CommentStatus.PENDING,
        likes: 0,
      });
      
      // Réinitialiser le formulaire
      setName('');
      setEmail('');
      setContent('');
      setStatus('success');
      
      // Revenir à idle après un certain temps
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Error submitting comment:', error);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg">
      {status === 'success' && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          Votre commentaire a été soumis et sera visible après validation. Merci !
        </div>
      )}
      
      {status === 'error' && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          Une erreur s'est produite. Veuillez réessayer plus tard.
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nom *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email (facultatif)
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div className="mb-4">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          Commentaire *
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={5}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        <FiSend className="mr-2" />
        {isSubmitting ? 'Envoi en cours...' : 'Envoyer le commentaire'}
      </button>
    </form>
  );
};

export default CommentForm;
