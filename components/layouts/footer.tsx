// components/Footer.tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { categoryService } from '@/services/firebase/categoryService';
import { newsletterService } from '@/services/firebase/newsletterService';
import { Category } from '@/types/category';
import { FiSend, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast'; // Supposant que vous utilisez react-hot-toast pour les notifications

export default function Footer() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({
    type: null,
    message: '',
  });

  useEffect(() => {
    async function fetchCategories() {
      try {
        const fetchedCategories = await categoryService.getCategories(true);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  // Réinitialiser le message d'état après un certain délai
  useEffect(() => {
    if (submitStatus.type) {
      const timer = setTimeout(() => {
        setSubmitStatus({ type: null, message: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Réinitialiser le message d'état précédent
    setSubmitStatus({ type: null, message: '' });
    
    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Veuillez entrer une adresse email valide');
      setSubmitStatus({
        type: 'error',
        message: 'Veuillez entrer une adresse email valide'
      });
      return;
    }

    setSubmitting(true);
    
    try {
      await newsletterService.subscribeToNewsletter({ email });
      toast.success('Merci pour votre abonnement à notre newsletter!');
      setSubmitStatus({
        type: 'success',
        message: 'Merci pour votre abonnement à notre newsletter!'
      });
      setEmail(''); // Réinitialiser le champ après soumission réussie
    } catch (error: any) {
      console.error('Erreur lors de l\'abonnement:', error);
      if (error.message === 'Cette adresse email est déjà abonnée à la newsletter.') {
        toast.error(error.message);
        setSubmitStatus({
          type: 'error',
          message: error.message
        });
      } else {
        toast.error('Une erreur est survenue. Veuillez réessayer plus tard.');
        setSubmitStatus({
          type: 'error',
          message: 'Une erreur est survenue. Veuillez réessayer plus tard.'
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span className="w-8 h-1 bg-green-500 mr-2"></span>
              À propos
            </h3>
            <p className="text-gray-400 mb-4">
              FlashInfos237 est votre portail d&apos;informations sur l&apos;actualité camerounaise en temps réel. Des nouvelles fiables, précises et contextualisées.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-full transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-full transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0z" />
                  <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8z" />
                </svg>
              </Link>
            </div>
          </div>
          <div>
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <span className="w-8 h-1 bg-red-500 mr-2"></span>
            Catégories
          </h3>
          <ul className="space-y-2">
            {loading ? (
              // Skeleton loaders pendant le chargement des catégories
              [1, 2, 3, 4, 5].map((i) => (
                <li key={i} className="h-5 w-20 bg-gray-800 rounded animate-pulse"></li>
              ))
            ) : (
              // Liens de catégories dynamiques
              categories.map((category) => (
                <li key={category.id}>
                  <Link href={`/categories/${category.slug}`}>
                    <span 
                      className="text-gray-400 hover:text-white hover:pl-1 block transition-all duration-200"
                      style={category.color ? { color: category.color === '#ffffff' ? '#e5e5e5' : category.color } : {}}
                    >
                      {category.name}
                    </span>
                  </Link>
                </li>
              ))
            )}
          </ul>
          </div>
          <div>
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <span className="w-8 h-1 bg-amber-500 mr-2"></span>
            Liens utiles
          </h3>
          <ul className="space-y-2">
            {[
              { name: 'À propos', path: '/about' },
              // { name: 'Publicité', path: '/publicite' },
              { name: 'Contact', path: '/contact' }
            ].map((link) => (
              <li key={link.name}>
                <Link href={link.path}>
                  <span className="text-gray-400 hover:text-white hover:pl-1 block transition-all duration-200">
                    {link.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span className="w-8 h-1 bg-green-500 mr-2"></span>
              Newsletter
            </h3>
            <p className="text-gray-400 mb-4">
              Abonnez-vous à notre newsletter pour recevoir les dernières nouvelles du Cameroun.
            </p>
            <form className="flex flex-col space-y-3" onSubmit={handleSubscribe}>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Votre adresse email" 
                  className="px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="absolute right-3 top-3 h-5 w-5 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              
              {/* Message de statut de soumission */}
              {submitStatus.type && (
                <div 
                  className={`flex items-center rounded-md px-4 py-2 text-sm text-white ${
                    submitStatus.type === 'success' ? 'bg-green-600' : 'bg-red-600'
                  }`}
                >
                  {submitStatus.type === 'success' ? (
                    <FiCheckCircle className="mr-2" />
                  ) : (
                    <FiAlertCircle className="mr-2" />
                  )}
                  {submitStatus.message}
                </div>
              )}
              
              <div className="">
                <button
                  type="submit"
                  className="flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Traitement...
                    </>
                  ) : (
                    <>
                      <FiSend className="mr-2" />
                      S&apos;abonner
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-center text-gray-400">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} FlashInfos237. Tous droits réservés.</p>
            <div className="mt-2 sm:mt-0 flex space-x-4 text-sm">
              <Link href="/privacy">
                <span className="hover:text-white transition-colors">Confidentialité</span>
              </Link>
              <Link href="/terms">
                <span className="hover:text-white transition-colors">Conditions d&apos;utilisation</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}