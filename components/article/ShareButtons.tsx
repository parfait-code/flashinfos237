// components/articles/ShareButtons.tsx
'use client';

import React, { useState } from 'react';
import { FiFacebook, FiTwitter, FiLinkedin, FiMail, FiLink, FiCheck, FiShare2 } from 'react-icons/fi';
import { Popover, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface ShareButtonsProps {
  url: string;
  title: string;
  summary?: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title, summary }) => {
  const [copied, setCopied] = useState(false);
  
  // Construire l'URL complète
  const fullUrl = new URL(url, typeof window !== 'undefined' ? window.location.origin : 'https://example.com').toString();
  
  // Fonction pour copier le lien dans le presse-papier
  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    
    // Réinitialiser après 2 secondes
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  return (
    <Popover className="relative z-10">
      {({ open }) => (
        <>
          <Popover.Button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-all shadow-sm">
            <FiShare2 className={`${open ? 'text-blue-500' : 'text-gray-600'}`} />
            Partager
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute z-10 right-0 mt-2 w-64 bg-white rounded-xl shadow-lg p-3 border border-gray-100">
              <div className="grid grid-cols-4 gap-2">
                {/* Facebook */}
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 hover:bg-blue-50 rounded-lg transition-colors"
                  aria-label="Partager sur Facebook"
                >
                  <FiFacebook className="text-blue-600 text-xl mb-1" />
                  <span className="text-xs font-medium">Facebook</span>
                </a>
                
                {/* Twitter */}
                <a 
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 hover:bg-blue-50 rounded-lg transition-colors"
                  aria-label="Partager sur Twitter"
                >
                  <FiTwitter className="text-blue-400 text-xl mb-1" />
                  <span className="text-xs font-medium">Twitter</span>
                </a>
                
                {/* LinkedIn */}
                <a 
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(fullUrl)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary || '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 hover:bg-blue-50 rounded-lg transition-colors"
                  aria-label="Partager sur LinkedIn"
                >
                  <FiLinkedin className="text-blue-700 text-xl mb-1" />
                  <span className="text-xs font-medium">LinkedIn</span>
                </a>
                
                {/* Email */}
                <a 
                  href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${summary || 'Regarde cet article intéressant'}\n\n${fullUrl}`)}`}
                  className="flex flex-col items-center justify-center p-3 hover:bg-blue-50 rounded-lg transition-colors"
                  aria-label="Partager par email"
                >
                  <FiMail className="text-gray-600 text-xl mb-1" />
                  <span className="text-xs font-medium">Email</span>
                </a>
              </div>
              
              {/* Copier le lien */}
              <div className="mt-2 pt-2 border-t border-gray-100">
                <button 
                  onClick={copyToClipboard}
                  className="w-full flex items-center justify-center p-3 hover:bg-gray-50 rounded-lg transition-colors gap-2"
                  aria-label="Copier le lien"
                >
                  {copied ? (
                    <>
                      <FiCheck className="text-green-500 text-lg" />
                      <span className="text-sm font-medium text-green-500">Lien copié !</span>
                    </>
                  ) : (
                    <>
                      <FiLink className="text-gray-600 text-lg" />
                      <span className="text-sm font-medium">Copier le lien</span>
                    </>
                  )}
                </button>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default ShareButtons;