// pages/404.tsx
'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Custom404() {
  const router = useRouter();
  
  // Redirection automatique vers la page d'accueil après 10 secondes
  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      router.push('/');
    }, 10000);
    
    // Nettoyer le timer si l'utilisateur quitte la page avant la fin du délai
    return () => clearTimeout(redirectTimer);
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-green-700">404</h1>
          
          <div className="flex items-center justify-center my-6">
            <div className="h-1 w-16 bg-red-600 mx-2"></div>
            <h2 className="text-2xl font-semibold text-gray-800">Page non trouvée</h2>
            <div className="h-1 w-16 bg-red-600 mx-2"></div>
          </div>
          
          <p className="text-gray-600 text-lg mb-8 max-w-lg mx-auto">
            Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
          </p>
          
          <div className="mb-8 text-amber-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <p className="text-gray-500 mb-6">
            Vous serez redirigé vers la page d&apos;accueil dans 10 secondes...
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <span className="px-6 py-3 bg-green-700 hover:bg-green-800 text-white font-medium rounded-lg transition-colors">
                Retour à l&apos;accueil
              </span>
            </Link>
            <button 
              onClick={() => router.back()}
              className="px-6 py-3 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-medium rounded-lg transition-colors"
            >
              Page précédente
            </button>
          </div>
        </div>
      </div>
  );
}