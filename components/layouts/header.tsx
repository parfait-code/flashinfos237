// components/Header.tsx
'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { categoryService } from '@/services/firebase/categoryService';
import { Category } from '@/types/category';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const fetchedCategories = await categoryService.getCategories(true);
        // Limiter aux 6 premières catégories pour l'affichage dans la navigation
        setCategories(fetchedCategories.slice(0, 6));
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return (
    <header className="sticky top-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="py-2 flex justify-between items-center text-sm border-b">
          <div className="hidden sm:flex items-center space-x-4">
            <span className="flex items-center text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
          <div className="hidden sm:flex items-center space-x-4">
            <Link href="/about">
              <span className="hover:text-red-600 transition-colors">À propos</span>
            </Link>
            <Link href="/contact">
              <span className="hover:text-red-600 transition-colors">Contact</span>
            </Link>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="py-4 flex justify-between items-center">
          <Link href="/">
            <span className="flex items-center">
              <div className="flex items-center">
                <span className="text-2xl md:text-3xl font-bold text-green-700">Flash<span className="text-red-600">Infos</span><span className="text-amber-500">237</span></span>
              </div>
            </span>
          </Link>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>

          {/* Desktop Navigation with Dynamic Categories */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/">
              <span className={`font-medium hover:text-red-600 transition-colors ${pathname === '/' ? 'text-red-600' : ''}`}>
                Accueil
              </span>
            </Link>
            
            {loading ? (
              // Skeleton loaders pendant le chargement des catégories
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </>
            ) : (
              // Liens de catégories dynamiques
              categories.map((category) => (
                <Link href={`/categories/${category.slug}`} key={category.id}>
                  <span 
                    className={`font-medium hover:text-red-600 transition-colors ${
                      pathname === `/categories/${category.slug}` ? 'text-red-600' : ''
                    }`}
                    style={category.color && pathname === `/categories/${category.slug}` ? { color: category.color } : {}}
                  >
                    {category.name}
                  </span>
                </Link>
              ))
            )}
          </nav>
        </div>

        {/* Mobile Navigation Menu with Dynamic Categories */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 px-2 bg-white border-t">
            <nav className="flex flex-col space-y-3">
              <Link href="/">
                <span className={`block py-2 px-3 font-medium hover:bg-gray-100 rounded-lg ${
                  pathname === '/' ? 'bg-gray-100 text-red-600' : ''
                }`}>
                  Accueil
                </span>
              </Link>
              
              {loading ? (
                // Skeleton loaders pour mobile
                <>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </>
              ) : (
                // Liens de catégories dynamiques pour mobile
                categories.map((category) => (
                  <Link href={`/categories/${category.slug}`} key={category.id}>
                    <span 
                      className={`block py-2 px-3 font-medium hover:bg-gray-100 rounded-lg ${
                        pathname === `/categories/${category.slug}` ? 'bg-gray-100' : ''
                      }`}
                      style={category.color && pathname === `/categories/${category.slug}` ? { color: category.color } : {}}
                    >
                      {category.name}
                    </span>
                  </Link>
                ))
              )}
              
              <div className="border-t pt-2 flex justify-between">
                <Link href="/about">
                  <span className="py-2 px-3 text-sm hover:bg-gray-100 rounded-lg">À propos</span>
                </Link>
                <Link href="/contact">
                  <span className="py-2 px-3 text-sm hover:bg-gray-100 rounded-lg">Contact</span>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}