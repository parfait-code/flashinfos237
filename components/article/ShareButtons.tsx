// components/article/ShareButtons.tsx
import { FiFacebook, FiTwitter, FiLinkedin, FiMail, FiShare2, FiMessageSquare } from 'react-icons/fi';

interface ShareButtonsProps {
  title: string;
  url: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);
  
  const shareLinks = [
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <FiFacebook className="w-5 h-5" />
    },
    {
      name: 'Twitter',
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: <FiTwitter className="w-5 h-5" />
    },
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
      icon: <FiLinkedin className="w-5 h-5" />
    },
    {
      name: 'WhatsApp',
      url: `https://wa.me/?text=${encodedTitle} ${encodedUrl}`,
      icon: <FiMessageSquare className="w-5 h-5" />
    },
    {
      name: 'Email',
      url: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
      icon: <FiMail className="w-5 h-5" />
    }
  ];

  return (
    <div>
      <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
        <FiShare2 className="mr-2" /> Partager cet article
      </h3>
      <div className="flex space-x-2">
        {shareLinks.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 hover:bg-red-600 hover:text-white transition"
            aria-label={`Partager sur ${link.name}`}
          >
            {link.icon}
          </a>
        ))}
      </div>
    </div>
  );
}