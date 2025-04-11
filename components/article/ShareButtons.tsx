// components/articles/ShareButtons.tsx
'use client';

import React from 'react';
import { FiFacebook, FiTwitter, FiLinkedin, FiMail, FiLink } from 'react-icons/fi';
import { Popover, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface ShareButtonsProps {
  url: string;
  title: string;
  summary?: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title, summary }) => {
  // Construire l'URL complète
  const fullUrl = new URL(url, typeof window !== 'undefined' ? window.location.origin : 'https://example.com').toString();
  
  // Fonction pour copier le lien dans le presse-papier
  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullUrl);
  };
  
  return (
    <Popover className="relative">
      <Popover.Button className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-sm">
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
        <Popover.Panel className="absolute z-10 right-0 mt-2 w-56 bg-white rounded-md shadow-lg p-2">
          <div className="grid grid-cols-4 gap-1">
            {/* Facebook */}
            <a 
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-2 hover:bg-gray-100 rounded"
              aria-label="Partager sur Facebook"
            >
              <FiFacebook className="text-blue-600 text-lg" />
              <span className="text-xs mt-1">Facebook</span>
            </a>
            
            {/* Twitter */}
            <a 
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-2 hover:bg-gray-100 rounded"
              aria-label="Partager sur Twitter"
            >
              <FiTwitter className="text-blue-400 text-lg" />
              <span className="text-xs mt-1">Twitter</span>
            </a>
            
            {/* LinkedIn */}
            <a 
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(fullUrl)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary || '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-2 hover:bg-gray-100 rounded"
              aria-label="Partager sur LinkedIn"
            >
              <FiLinkedin className="text-blue-700 text-lg" />
              <span className="text-xs mt-1">LinkedIn</span>
            </a>
            
            {/* Email */}
            <a 
              href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${summary || 'Regarde cet article intéressant'}\n\n${fullUrl}`)}`}
              className="flex flex-col items-center justify-center p-2 hover:bg-gray-100 rounded"
              aria-label="Partager par email"
            >
              <FiMail className="text-gray-600 text-lg" />
              <span className="text-xs mt-1">Email</span>
            </a>
            
            {/* Copier le lien */}
            <button 
              onClick={copyToClipboard}
              className="flex flex-col items-center justify-center p-2 hover:bg-gray-100 rounded col-span-4"
              aria-label="Copier le lien"
            >
              <FiLink className="text-gray-600 text-lg" />
              <span className="text-xs mt-1">Copier le lien</span>
            </button>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default ShareButtons;