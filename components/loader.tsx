'use client'
import { useEffect, useState } from 'react';

// À intégrer dans votre composant
export default function Loader () {
  const [progress, setProgress] = useState(0);
 
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        const newProgress = Math.min(oldProgress + Math.random() * 10, 100);
        if (newProgress === 100) {
          clearInterval(timer);
        }
        return newProgress;
      });
    }, 200);
    
    return () => {
      clearInterval(timer);
    };
  }, []);

  
  return (
    <div className="px-4 flex flex-col justify-center items-center h-[60vh] gap-6 w-full max-w-md mx-auto">
      {/* Texte coloré avec effet de gradient */}
      <div className="font-bold text-3xl flex items-center">
        <span className="text-green-600">Flash</span>
        <span className="text-red-600">Infos</span>
        <span className="text-yellow-500">237</span>
      </div>
      
      {/* Barre de progression */}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="h-2.5 rounded-full transition-all duration-300 ease-out"
          style={{ 
            width: `${progress}%`,
            background: 'linear-gradient(to right, #16a34a, #dc2626, #eab308)'
          }}
        ></div>
      </div>
      
      {/* Spinner */}
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-700"></div>
      
      {/* Texte de chargement */}
      <p className="text-gray-600">Chargement en cours...</p>
    </div>
  );
};