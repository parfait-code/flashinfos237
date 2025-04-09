// components/CategoryNav.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { categoryService } from '@/services/firebase/categoryService';
import { Category } from '@/types/category';

export default function CategoryNav() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

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

  if (loading) {
    return (
      <div className="flex overflow-x-auto py-4 px-4 whitespace-nowrap space-x-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-gray-200 h-8 w-20 rounded animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <nav className="bg-white shadow-md mb-6">
      <div className="container mx-auto">
        <div className="flex overflow-x-auto py-4 px-4 whitespace-nowrap space-x-3">
          <Link 
            href="/"
            className={`px-4 py-2 rounded-full transition ${
              pathname === '/' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Tous les articles
          </Link>
          
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className={`px-4 py-2 rounded-full transition ${
                pathname === `/categories/${category.slug}` 
                  ? (category.color ? `text-white` : 'bg-blue-600 text-white')
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              style={pathname === `/categories/${category.slug}` && category.color 
                ? { backgroundColor: category.color } 
                : {}}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}