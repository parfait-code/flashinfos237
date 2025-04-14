// components/PopularArticlesCarousel.tsx
import { useState, useEffect, useRef } from 'react';
import { Article } from '@/types/article';
import { Category } from '@/types/category';
import ArticleCard from '@/components/ArticleCard';

interface PopularArticlesCarouselProps {
  articles: Article[];
  categories: Category[];
}

export default function PopularArticlesCarousel({ articles, categories }: PopularArticlesCarouselProps) {
  // États pour le carrousel des articles populaires
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);
  const [slidesToScroll, setSlidesToScroll] = useState(3); // Nouvel état pour le nombre d'articles à faire défiler
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const [totalSlides, setTotalSlides] = useState(Math.ceil(articles.length / itemsPerSlide));

  const goToPrevSlide = () => {
    // Calculer l'index précédent en tenant compte du nombre d'articles à faire défiler
    const newIndex = Math.max(0, currentSlide - 1);
    setCurrentSlide(newIndex);
    resetAutoPlay();
  };

  const goToNextSlide = () => {
    // Calculer l'index suivant en tenant compte du nombre d'articles à faire défiler
    const newIndex = (currentSlide + 1) % totalSlides;
    setCurrentSlide(newIndex);
    resetAutoPlay();
  };

  // Gestion du responsive
  useEffect(() => {
    const handleResize = () => {
      let newItemsPerSlide = 3; // Desktop default
      let newSlidesToScroll = 3; // Desktop default
      
      if (window.innerWidth < 640) {
        // Mobile
        newItemsPerSlide = 1;
        newSlidesToScroll = 1;
      } else if (window.innerWidth < 1024) {
        // Tablet
        newItemsPerSlide = 2;
        newSlidesToScroll = 2;
      }
      
      setItemsPerSlide(newItemsPerSlide);
      setSlidesToScroll(newSlidesToScroll);
      
      // Recalculer le nombre total de slides
      const newTotalSlides = Math.ceil(articles.length / newItemsPerSlide);
      setTotalSlides(newTotalSlides);
      
      // Ajuster currentSlide si nécessaire pour éviter un index hors limites
      if (currentSlide >= newTotalSlides) {
        setCurrentSlide(newTotalSlides - 1);
      }
    };

    // Initialiser au chargement
    handleResize();
    
    // Ajouter l'écouteur d'événement pour le redimensionnement
    window.addEventListener('resize', handleResize);
    
    // Nettoyer l'écouteur d'événement
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [articles.length, currentSlide]);

  // Configuration du carrousel avec autoplay
  useEffect(() => {
    if (articles.length > 0) {
      const startAutoPlay = () => {
        autoPlayRef.current = setInterval(() => {
          goToNextSlide(); // Utiliser la fonction qui gère le défilement correctement
        }, 7000);
      };

      startAutoPlay();

      return () => {
        if (autoPlayRef.current) {
          clearInterval(autoPlayRef.current);
        }
      };
    }
  }, [articles.length, totalSlides, slidesToScroll, goToNextSlide]);

  // Fonctions pour le contrôle du carrousel
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    resetAutoPlay();
  };

 
  // Réinitialiser l'autoplay
  const resetAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = setInterval(() => {
        goToNextSlide();
      }, 7000);
    }
  };

  if (articles.length === 0) return null;

  return (
    <div className="relative py-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-10 flex items-center">
        <span className="w-8 h-1.5 bg-red-600 rounded-full mr-3"></span>
        Articles les plus populaires
      </h2>
      
      {/* Carrousel des articles populaires */}
      <div 
        ref={carouselRef}
        className="relative overflow-hidden mx-4 md:mx-10"
      >
        <div 
          className="flex transition-transform duration-700 ease-in-out" 
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {Array.from({ length: totalSlides }).map((_, slideIndex) => (
            <div key={slideIndex} className="min-w-full">
              <div className={`grid grid-cols-1 ${
                itemsPerSlide === 2 ? 'sm:grid-cols-2' : 
                itemsPerSlide === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : ''
              } gap-6`}>
                {articles.slice(slideIndex * itemsPerSlide, (slideIndex * itemsPerSlide) + itemsPerSlide).map((article) => (
                  <ArticleCard key={article.id} article={article} categories={categories} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Boutons de navigation avec design amélioré */}
      {articles.length > itemsPerSlide && (
        <>
          <button 
            onClick={goToPrevSlide}
            className="absolute top-1/2 -left-2 md:left-0 -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-800 rounded-full p-3 shadow-lg focus:outline-none transition-all transform hover:scale-110 active:scale-95 z-10 border border-gray-100"
            aria-label="Articles populaires précédents"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={goToNextSlide}
            className="absolute top-1/2 -right-2 md:right-0 -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-800 rounded-full p-3 shadow-lg focus:outline-none transition-all transform hover:scale-110 active:scale-95 z-10 border border-gray-100"
            aria-label="Articles populaires suivants"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Barre de progression stylisée */}
      {totalSlides > 1 && (
        <div className="mt-8 flex justify-center items-center space-x-3">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2.5 transition-all duration-300 rounded-full ${
                currentSlide === index 
                  ? 'bg-blue-600 w-8' 
                  : 'bg-gray-300 w-2.5 hover:bg-gray-400'
              }`}
              aria-label={`Aller aux articles populaires groupe ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Indicateur textuel de la position */}
      <div className="text-center text-gray-500 text-sm mt-4">
        {currentSlide + 1} / {totalSlides}
      </div>
    </div>
  );
}