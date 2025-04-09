// components/comment/CommentForm.tsx
import { useState } from 'react';
import { Comment, CommentStatus } from '@/types/comment';

interface CommentFormProps {
  articleId: string;
  onSubmit: (comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
}

export default function CommentForm({ articleId, onSubmit }: CommentFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !content) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    const commentData = {
      articleId,
      userName: name,
      userEmail: email,
      content,
      userId: null,
      status: CommentStatus.PENDING,
      likes: 0
    };
    
    try {
      const success = await onSubmit(commentData);
      if (success) {
        setName('');
        setEmail('');
        setContent('');
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        throw new Error('Failed to submit comment');
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer plus tard.');
      console.log(err)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg mb-8">
      <h3 className="text-xl font-semibold mb-4">Laisser un commentaire</h3>
      
      {submitted ? (
        <div className="bg-green-100 text-green-700 p-4 rounded-md mb-4">
          Merci pour votre commentaire! Il sera publié après modération.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-md">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email (ne sera pas publié)
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
              Commentaire <span className="text-red-500">*</span>
            </label>
            <textarea
              id="comment"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              required
            ></textarea>
          </div>
          
          <div className="text-right">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Envoi en cours...' : 'Poster le commentaire'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}