// components/comments/CommentForm.tsx
'use client';

import React, { useState } from 'react';
import { FiSend, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
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
      }, 5000);
    } catch (error) {
      console.error('Error submitting comment:', error);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      {status === 'success' && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-100 flex items-start gap-3">
          <FiCheckCircle className="text-green-500 text-xl mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Merci pour votre commentaire !</p>
            <p className="text-sm">Votre commentaire a été soumis et sera visible après validation.</p>
          </div>
        </div>
      )}
      
      {status === 'error' && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-start gap-3">
          <FiAlertCircle className="text-red-500 text-xl mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Oups, une erreur s'est produite</p>
            <p className="text-sm">Veuillez réessayer plus tard ou contacter l'administrateur du site.</p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nom *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Votre nom"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email (facultatif)
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Votre email ne sera pas publié"
          />
        </div>
      </div>
      
      <div className="mb-6">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
          Votre commentaire *
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={5}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          placeholder="Partagez votre avis sur cet article..."
        />
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Envoi en cours...
            </>
          ) : (
            <>
              <FiSend className="mr-2" />
              Envoyer le commentaire
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;