// pages/index.tsx
'use client'
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DocumentSnapshot } from 'firebase/firestore';
import { articleService } from '@/services/firebase/articleService';
import { categoryService } from '@/services/firebase/categoryService';
import { Article, ArticleStatus } from '@/types/article';
import { Category } from '@/types/category';
import { formatDate } from '@/utils/helpers';
import ArticleCard from '@/components/ArticleCard';
import Loader from '@/components/loader';
import PopularArticlesCarousel from '@/components/PopularArticlesCarousel';

export default function HomePage() {
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [popularArticles, setPopularArticles] = useState<Article[]>([]);
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [otherArticles, setOtherArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [lastVisible, setLastVisible] = useState<DocumentSnapshot | null>(null);
  const [otherLastVisible, setOtherLastVisible] = useState<DocumentSnapshot | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  
  // États pour le carrousel principal
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Charger les données initiales
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Charger les articles en vedette
        const { articles: featured } = await articleService.getArticles({
          status: ArticleStatus.PUBLISHED,
          featured: true,
          limit: 6
        });
        setFeaturedArticles(featured);

        // Charger les articles les plus vus
        const { articles: popular } = await articleService.getArticles({
          status: ArticleStatus.PUBLISHED,
          orderByField: 'viewCount',
          orderDirection: 'desc',
          limit: 10
        });
        setPopularArticles(popular);

        // Charger les derniers articles
        const { articles: latest, lastVisible: lastDoc } = await articleService.getArticles({
          status: ArticleStatus.PUBLISHED,
          limit: 20
        });
        setLatestArticles(latest);
        setLastVisible(lastDoc);

        // Charger les catégories
        const cats = await categoryService.getCategories();
        setCategories(cats);

        // Une fois que nous avons les autres articles, charger "tous les autres"
        await fetchOtherArticles(featured, popular, latest);
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fonction pour charger les autres articles
  const fetchOtherArticles = async (featured: Article[], popular: Article[], latest: Article[]) => {
    try {
      // Créer une liste des IDs d'articles déjà affichés
      const displayedIds = [
        ...featured.map(a => a.id),
        ...popular.map(a => a.id),
        ...latest.map(a => a.id)
      ];
      
      const { articles: others, lastVisible: lastDoc } = await articleService.getArticles({
        status: ArticleStatus.PUBLISHED,
        limit: 6
      });
      
      // Filtrer côté client pour exclure les articles déjà affichés
      const filteredOthers = others.filter(article => !displayedIds.includes(article.id));
      
      setOtherArticles(filteredOthers);
      setOtherLastVisible(lastDoc);
    } catch (error) {
      console.error('Error loading other articles:', error);
    }
  };

  // Configuration du carrousel principal avec autoplay
  useEffect(() => {
    if (featuredArticles.length > 0) {
      const startAutoPlay = () => {
        autoPlayRef.current = setInterval(() => {
          setCurrentSlide((prev) => (prev + 1) % featuredArticles.length);
        }, 5000);
      };

      startAutoPlay();

      return () => {
        if (autoPlayRef.current) {
          clearInterval(autoPlayRef.current);
        }
      };
    }
  }, [featuredArticles.length]);

  // Fonctions pour le contrôle du carrousel principal
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    // Réinitialiser l'autoplay
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredArticles.length);
      }, 5000);
    }
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? featuredArticles.length - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredArticles.length);
  };

  const loadMoreArticles = async () => {
    if (loadingMore) return;
    
    setLoadingMore(true);
    try {
      const { articles, lastVisible: newLastVisible } = await articleService.getArticles({
        status: ArticleStatus.PUBLISHED,
        lastVisible,
        limit: 6
      });
      
      setLatestArticles(prev => [...prev, ...articles]);
      setLastVisible(newLastVisible);
    } catch (error) {
      console.error('Error loading more articles:', error);
    } finally {
      setLoadingMore(false);
    }
  };
  
  const loadMoreOtherArticles = async () => {
    if (loadingMore) return;
    
    setLoadingMore(true);
    try {
      const { articles, lastVisible: newLastVisible } = await articleService.getArticles({
        status: ArticleStatus.PUBLISHED,
        lastVisible: otherLastVisible,
        limit: 6
      });
      
      // Créer une liste des IDs d'articles déjà affichés
      const displayedIds = [
        ...featuredArticles.map(a => a.id),
        ...popularArticles.map(a => a.id),
        ...latestArticles.map(a => a.id),
        ...otherArticles.map(a => a.id)
      ];
      
      // Filtrer pour n'ajouter que les articles non déjà affichés
      const filteredOthers = articles.filter(article => !displayedIds.includes(article.id));
      
      setOtherArticles(prev => [...prev, ...filteredOthers]);
      setOtherLastVisible(newLastVisible);
    } catch (error) {
      console.error('Error loading more other articles:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section avec carrousel - Modernisé */}
      {featuredArticles.length > 0 && (
        <section className="pt-4 pb-12 px-4 lg:pt-6 lg:pb-16 max-w-7xl mx-auto">
          <div className="relative">
            {/* Carrousel principal */}
            <div 
              ref={carouselRef}
              className="relative overflow-hidden rounded-2xl h-[400px] sm:h-[500px] shadow-2xl"
            >
              <div 
                className="flex h-full transition-transform duration-700 ease-in-out" 
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {featuredArticles.map((article, index) => (
                  <div key={article.id} className="min-w-full h-full relative">
                    <Link href={`/articles/${article.slug}`} className="block h-full">
                      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90 z-10 rounded-2xl"></div>
                      <Image 
                        src={article.imageUrl || '/image.svg'} 
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                        priority={index === 0}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                      />
                      <span className="absolute inset-0 z-20 p-6 md:p-10 flex flex-col justify-end">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-1.5 rounded-full text-xs uppercase font-bold w-fit mb-4 tracking-wider shadow-md">
                          À la une
                        </div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3 line-clamp-3 leading-tight">
                          {article.title}
                        </h1>
                        <p className="text-gray-200 mb-4 line-clamp-2 max-w-2xl text-sm md:text-base">
                          {article.summary}
                        </p>
                        <div className="flex flex-wrap items-center text-gray-300 text-sm mb-3">
                          <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(article.publishedAt)}
                          </span>
                          <span className="mx-2 hidden sm:inline">•</span>
                          <span className="flex items-center mt-1 sm:mt-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {article.authorName}
                          </span>
                        </div>
                        <span className="inline-flex items-center text-white font-medium text-sm md:text-base group">
                          Lire l&apos;article
                          <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </span>
                      </span>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Boutons de navigation */}
              <button 
                onClick={goToPrevSlide}
                className="absolute top-1/2 left-4 z-30 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2.5 focus:outline-none transition-colors transform hover:scale-110 active:scale-95"
                aria-label="Article précédent"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={goToNextSlide}
                className="absolute top-1/2 right-4 z-30 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2.5 focus:outline-none transition-colors transform hover:scale-110 active:scale-95"
                aria-label="Article suivant"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Indicateurs de slide */}
              <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center space-x-2">
                {featuredArticles.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      currentSlide === index ? 'bg-white w-8' : 'bg-white/40 w-2 hover:bg-white/70'
                    }`}
                    aria-label={`Aller à l'article ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Miniatures des autres articles en vedette */}
            {featuredArticles.length > 1 && (
              <div className="mt-4 hidden md:grid grid-cols-5 gap-3">
                {featuredArticles.slice(0, 5).map((article, index) => (
                  <button
                    key={article.id}
                    onClick={() => goToSlide(index)}
                    className={`relative h-20 rounded-lg overflow-hidden transition-all transform ${
                      currentSlide === index 
                        ? 'ring-2 ring-blue-600 opacity-100 scale-105' 
                        : 'opacity-70 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <Image 
                      src={article.imageUrl || '/image.svg'} 
                      alt={article.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1200px) 20vw, 150px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Articles les plus populaires avec le nouveau composant */}
      {popularArticles.length > 0 && (
        <section className="bg-gradient-to-b from-white to-gray-50 py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4">
            <PopularArticlesCarousel 
              articles={popularArticles} 
              categories={categories} 
            />
          </div>
        </section>
      )}

      {/* Dernières actualités */}
      <section className="py-12 md:py-16 max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center">
            <span className="w-8 h-1.5 bg-red-600 rounded-full mr-3"></span>
            Dernières actualités
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {latestArticles.map((article, index) => (
                <div key={article.id} className={index === 0 ? 'sm:col-span-2 lg:col-span-1' : ''}>
                  <ArticleCard article={article} categories={categories} />
                </div>
              ))}
            </div>
            
            {lastVisible && (
              <div className="flex justify-center mt-12">
                <button 
                  onClick={loadMoreArticles}
                  disabled={loadingMore}
                  className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-full transition-all disabled:from-gray-400 disabled:to-gray-500 flex items-center shadow-md hover:shadow-lg transform hover:translate-y-[-2px] active:translate-y-0"
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white mr-3"></div>
                      Chargement...
                    </>
                  ) : (
                    <>
                      Voir plus d&apos;articles
                      <svg className="ml-2 w-5 h-5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </section>
      
      {/* Tous les autres articles */}
      {otherArticles.length > 0 && (
        <section className="bg-gradient-to-b from-gray-50 to-gray-100 py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl md:text-3xl font-bold flex items-center">
                <span className="w-8 h-1.5 bg-red-600 rounded-full mr-3"></span>
                Autres actualités
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {otherArticles.map((article) => (
                <div key={article.id}>
                  <ArticleCard article={article} categories={categories} />
                </div>
              ))}
            </div>
            
            {otherLastVisible && (
              <div className="flex justify-center mt-12">
                <button 
                  onClick={loadMoreOtherArticles}
                  disabled={loadingMore}
                  className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-full transition-all disabled:from-gray-400 disabled:to-gray-500 flex items-center shadow-md hover:shadow-lg transform hover:translate-y-[-2px] active:translate-y-0"
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white mr-3"></div>
                      Chargement...
                    </>
                  ) : (
                    <>
                      Voir plus d&apos;articles
                      <svg className="ml-2 w-5 h-5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}