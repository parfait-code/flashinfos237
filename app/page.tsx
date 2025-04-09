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
  
  // État pour le carrousel principal
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  
  // État pour le carrousel des articles populaires
  const [popularCurrentSlide, setPopularCurrentSlide] = useState(0);
  const popularCarouselRef = useRef<HTMLDivElement>(null);
  const popularAutoPlayRef = useRef<NodeJS.Timeout | null>(null);

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

  // Fonction pour charger les autres articles (ceux qui ne sont pas déjà affichés)
  const fetchOtherArticles = async (featured: Article[], popular: Article[], latest: Article[]) => {
    try {
      // Créer une liste des IDs d'articles déjà affichés
      const displayedIds = [
        ...featured.map(a => a.id),
        ...popular.map(a => a.id),
        ...latest.map(a => a.id)
      ];

      // Requête pour obtenir tous les autres articles
      // Note: Firebase ne supporte pas directement "not in" pour les tableaux de grande taille
      // Pour une implémentation complète, il faudrait paginer et filtrer côté client
      // ou implémenter une logique côté serveur
      
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
        }, 5000); // Change de slide toutes les 5 secondes
      };

      startAutoPlay();

      return () => {
        if (autoPlayRef.current) {
          clearInterval(autoPlayRef.current);
        }
      };
    }
  }, [featuredArticles.length]);
  
  // Configuration du carrousel des articles populaires avec autoplay
  useEffect(() => {
    if (popularArticles.length > 0) {
      const startAutoPlay = () => {
        popularAutoPlayRef.current = setInterval(() => {
          setPopularCurrentSlide((prev) => (prev + 1) % Math.ceil(popularArticles.length / 3));
        }, 7000); // Change de slide toutes les 7 secondes
      };

      startAutoPlay();

      return () => {
        if (popularAutoPlayRef.current) {
          clearInterval(popularAutoPlayRef.current);
        }
      };
    }
  }, [popularArticles.length]);

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
  
  // Fonctions pour le contrôle du carrousel des articles populaires
  const goToPopularSlide = (index: number) => {
    setPopularCurrentSlide(index);
    // Réinitialiser l'autoplay
    if (popularAutoPlayRef.current) {
      clearInterval(popularAutoPlayRef.current);
      popularAutoPlayRef.current = setInterval(() => {
        setPopularCurrentSlide((prev) => (prev + 1) % Math.ceil(popularArticles.length / 3));
      }, 7000);
    }
  };

  const goToPrevPopularSlide = () => {
    setPopularCurrentSlide((prev) => (prev === 0 ? Math.ceil(popularArticles.length / 3) - 1 : prev - 1));
  };

  const goToNextPopularSlide = () => {
    setPopularCurrentSlide((prev) => (prev + 1) % Math.ceil(popularArticles.length / 3));
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
    return (
      <Loader/>
    );
  }

  return (
    <div>
      {/* Hero Section avec carrousel - Inchangé */}
      {featuredArticles.length > 0 && (
        <section className="container mx-auto px-4 mb-12">
          <div className="relative">
            {/* Carrousel principal */}
            <div 
              ref={carouselRef}
              className="relative overflow-hidden rounded-xl h-[500px] shadow-xl"
            >
              <div className="flex transition-transform duration-500 ease-out h-full" 
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {featuredArticles.map((article, index) => (
                  <div key={article.id} className="min-w-full h-full relative">
                    <Link href={`/articles/${article.slug}`}>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10 rounded-xl"></div>
                    <Image 
                      src={article.imageUrl || '/image.svg'} 
                      alt={article.title}
                      layout="fill"
                      objectFit="cover"
                      priority={index === 0}
                    />
                      <span className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                        <div className="bg-green-700 text-white px-3 py-1 rounded-full text-xs uppercase font-medium w-fit mb-3">
                          À la une
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 line-clamp-3">
                          {article.title}
                        </h1>
                        <p className="text-gray-200 mb-4 line-clamp-2 max-w-2xl">
                          {article.summary}
                        </p>
                        <div className="flex items-center text-gray-300 text-sm mb-2">
                          <span>{formatDate(article.publishedAt)}</span>
                          <span className="mx-2">•</span>
                          <span>{article.authorName}</span>
                        </div>
                        <span className="inline-flex items-center text-white font-medium hover:text-green-400 transition-colors">
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
                className="absolute top-1/2 left-4 z-30 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 focus:outline-none transition-colors"
                aria-label="Article précédent"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={goToNextSlide}
                className="absolute top-1/2 right-4 z-30 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 focus:outline-none transition-colors"
                aria-label="Article suivant"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Indicateurs de slide */}
              <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center space-x-2">
                {featuredArticles.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-2.5 w-2.5 rounded-full transition-all ${
                      currentSlide === index ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'
                    }`}
                    aria-label={`Aller à l'article ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Miniatures des autres articles en vedette (optionnel) */}
            {featuredArticles.length > 1 && (
              <div className="mt-4 hidden md:grid md:grid-cols-5  gap-2">
                {featuredArticles.slice(0, 5).map((article, index) => (
                  <button
                    key={article.id}
                    onClick={() => goToSlide(index)}
                    className={`relative h-20 rounded-lg overflow-hidden transition-all ${
                      currentSlide === index ? 'ring-2 ring-green-700 opacity-100' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image 
                      src={article.imageUrl || '/image.svg'} 
                      alt={article.title}
                      layout="fill"
                      objectFit="cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Articles les plus populaires en carrousel */}
      {popularArticles.length > 0 && (
        <section className="bg-gray-50 py-10 mb-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 flex items-center">
              <span className="w-8 h-1 bg-red-600 mr-3"></span>
              Articles les plus populaires
            </h2>
            
            <div className="relative">
              {/* Carrousel des articles populaires */}
              <div 
                ref={popularCarouselRef}
                className="relative overflow-hidden rounded-lg"
              >
                <div 
                  className="flex transition-transform duration-500 ease-out" 
                  style={{ transform: `translateX(-${popularCurrentSlide * 100}%)` }}
                >
                  {/* Calculer le nombre de slides en fonction du nombre d'articles à afficher par slide */}
                  {Array.from({ length: Math.ceil(popularArticles.length / 3) }).map((_, slideIndex) => (
                    <div key={slideIndex} className="min-w-full">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {popularArticles.slice(slideIndex * 3, slideIndex * 3 + 3).map((article) => (
                          <ArticleCard key={article.id} article={article} categories={categories} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Boutons de navigation */}
              {popularArticles.length > 3 && (
                <>
                  <button 
                    onClick={goToPrevPopularSlide}
                    className="absolute top-1/2 left-0 -translate-y-1/2 bg-white hover:bg-gray-100 text-gray-800 rounded-full p-2 shadow-md focus:outline-none transition-colors -ml-4 z-10"
                    aria-label="Articles populaires précédents"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    onClick={goToNextPopularSlide}
                    className="absolute top-1/2 right-0 -translate-y-1/2 bg-white hover:bg-gray-100 text-gray-800 rounded-full p-2 shadow-md focus:outline-none transition-colors -mr-4 z-10"
                    aria-label="Articles populaires suivants"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Indicateurs de slide */}
              {popularArticles.length > 3 && (
                <div className="mt-6 flex justify-center space-x-2">
                  {Array.from({ length: Math.ceil(popularArticles.length / 3) }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToPopularSlide(index)}
                      className={`h-2.5 w-2.5 rounded-full transition-all ${
                        popularCurrentSlide === index ? 'bg-green-700 w-8' : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Aller aux articles populaires groupe ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Dernières actualités - AVEC ArticleCard */}
      <section className="container mx-auto px-4 mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold flex items-center">
            <span className="w-8 h-1 bg-red-600 mr-3"></span>
            Dernières actualités
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {latestArticles.map((article, index) => (
                <div key={article.id} className={index === 0 ? 'md:col-span-2 lg:col-span-1' : ''}>
                  <ArticleCard article={article} categories={categories} />
                </div>
              ))}
            </div>
            
            {lastVisible && (
              <div className="flex justify-center mt-12">
                <button 
                  onClick={loadMoreArticles}
                  disabled={loadingMore}
                  className="px-8 py-3 bg-green-700 hover:bg-green-800 text-white font-medium rounded-xl transition-colors disabled:bg-gray-400 flex items-center shadow-md hover:shadow-lg"
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white mr-3"></div>
                      Chargement...
                    </>
                  ) : (
                    <>
                      Voir plus d&apos;articles
                      <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <section className="bg-gray-100 py-10 mb-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold flex items-center">
                <span className="w-8 h-1 bg-red-600 mr-3"></span>
                Autres actualités
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
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
                  className="px-8 py-3 bg-green-700 hover:bg-green-800 text-white font-medium rounded-xl transition-colors disabled:bg-gray-400 flex items-center shadow-md hover:shadow-lg"
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white mr-3"></div>
                      Chargement...
                    </>
                  ) : (
                    <>
                      Voir plus d&apos;articles
                      <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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