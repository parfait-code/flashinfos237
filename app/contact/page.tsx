// app/contact/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import Image from 'next/image';
import { contactService } from '@/services/firebase/contactService';
import { FiFacebook, FiInstagram, FiSend } from 'react-icons/fi';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    sujet: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success?: boolean;
    message?: string;
  }>({});
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await contactService.createContactMessage(formData);
      
      setTimeout(() => {
        setFormData({
          nom: '',
          email: '',
          sujet: '',
          message: ''
        });
      }, 3000);
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: 'Une erreur est survenue lors de l\'envoi de votre message. Veuillez réessayer plus tard.'
      });
      console.log(error)
    } finally {
      setSubmitStatus({
        success: true,
        message: 'Votre message a été envoyé avec succès. Notre équipe vous contactera prochainement.'
      });
      setIsSubmitting(false);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "Comment soumettre une information ou un témoignage ?",
      answer: "Vous pouvez nous envoyer vos informations et témoignages via notre formulaire de contact en sélectionnant 'Témoignage / Alerte info' dans le menu déroulant. Notre équipe de journalistes vérifiera l'information avant publication."
    },
    {
      question: "Comment devenir partenaire de FlashInfos237 ?",
      answer: "Pour établir un partenariat avec notre média, veuillez nous contacter via le formulaire en choisissant l'option 'Publicité & Partenariats'. Notre équipe commerciale vous contactera dans les 24 heures."
    },
    {
      question: "Quels sont les horaires d'ouverture de vos bureaux ?",
      answer: "Nos bureaux sont ouverts du lundi au vendredi de 8h à 18h. Notre équipe éditoriale travaille cependant 24/7 pour couvrir l'actualité camerounaise en temps réel."
    },
    {
      question: "Comment signaler une erreur dans un article ?",
      answer: "Si vous avez repéré une erreur dans l'un de nos articles, utilisez notre formulaire de contact en choisissant l'option 'Correction d'article'. Précisez l'article concerné et la correction à apporter."
    },
    {
      question: "Comment puis-je m'abonner à votre newsletter ?",
      answer: "Vous pouvez vous abonner à notre newsletter directement depuis notre page d'accueil en renseignant votre adresse email dans le formulaire d'abonnement. Vous recevrez ainsi nos actualités quotidiennes."
    },
    {
      question: "Proposez-vous des stages ou des opportunités d'emploi ?",
      answer: "Oui, nous proposons régulièrement des stages et des opportunités d'emploi dans les domaines du journalisme, marketing digital et développement web. Envoyez-nous votre CV via le formulaire de contact en précisant votre domaine d'intérêt."
    }
  ];

  return (
    <main className="bg-gray-50">
      {/* En-tête de la page de contact */}
      <div className="bg-gradient-to-r from-green-700 via-red-600 to-amber-500">
        <div className="container bg-transparent mx-auto px-4 py-12 md:py-16 text-center text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Contactez-nous</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Notre équipe est à votre disposition pour répondre à vos questions, recueillir vos témoignages ou discuter de partenariats.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Informations de contact et carte */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-5 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800 flex items-center">
                <span className="w-8 h-1 bg-green-700 mr-2"></span>
                Nos coordonnées
              </h2>

              <div className="space-y-5 md:space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-2 md:p-3 rounded-full flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-base md:text-lg text-gray-800">Adresse</h3>
                    {/* <p className="text-gray-600">Immeuble Media Center, Boulevard de la Liberté</p> */}
                    <p className="text-gray-600">Yaoundé, Cameroun</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-red-100 p-2 md:p-3 rounded-full flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-base md:text-lg text-gray-800">Téléphone</h3>
                    <p className="text-gray-600">+237 650 601 520</p>
                    <p className="text-gray-600">+237 697 965 420</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-amber-100 p-2 md:p-3 rounded-full flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-base md:text-lg text-gray-800">Email</h3>
                    <p className="text-gray-600">contact@flashinfos237.com</p>
                    {/* <p className="text-gray-600">redaction@flashinfos237.com</p> */}
                  </div>
                </div>
              </div>

              <h2 className="text-xl md:text-2xl font-bold mt-6 md:mt-8 mb-4 md:mb-6 text-gray-800 flex items-center">
                <span className="w-8 h-1 bg-amber-500 mr-2"></span>
                Suivez-nous
              </h2>
              
              <div className="flex flex-wrap gap-3">
                <span className="bg-blue-600 hover:bg-blue-700 text-white p-2 md:p-3 rounded-full transition-colors">
                  <Link href="#" className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                    <FiFacebook className='h-5 w-5 md:h-6 md:w-6'/>
                  </Link>
                </span>
                <span  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-2 md:p-3 rounded-full transition-colors">
                  <Link href="#" className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-colors">
                    <FiInstagram className='h-5 w-5 md:h-6 md:w-6'/>
                  </Link>
                </span>
                  
                  
              </div>
            </div>
            
            {/* Carte (placeholder) */}
            <div className="h-48 md:h-64 bg-gray-200 relative">
              <Image 
                src="/image.svg" 
                alt="Carte de localisation FlashInfos237" 
                fill 
                style={{ objectFit: "cover" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white bg-opacity-90 p-3 md:p-4 rounded-lg">
                  <p className="font-semibold text-sm md:text-base text-gray-900">Carte interactive en cours de chargement</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire de contact */}
          <div className="bg-white rounded-lg shadow-lg p-5 md:p-6">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800 flex items-center">
              <span className="w-8 h-1 bg-red-600 mr-2"></span>
              Envoyez-nous un message
            </h2>
            
            {submitStatus.message && (
              <div className={`p-4 mb-6 rounded-lg ${submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {submitStatus.message}
              </div>
            )}
            
            <form id='form' onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                    className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Votre adresse email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="sujet" className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
                <select
                  id="sujet"
                  name="sujet"
                  value={formData.sujet}
                  onChange={handleChange}
                  required
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="information">Demande d&apos;information</option>
                  <option value="temoignage">Témoignage / Alerte info</option>
                  <option value="publicite">Publicité & Partenariats</option>
                  <option value="correction">Correction d&apos;article</option>
                  <option value="recrutement">Candidature / Stage</option>
                  <option value="autre">Autre sujet</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Votre message ici..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-5 md:px-6 py-2 md:py-3 ${
                  isSubmitting ? 'bg-gray-400' : 'bg-blue-700 hover:bg-blue-800'
                } text-white font-medium rounded-lg transition-colors flex items-center justify-center`}
              >
                {isSubmitting ? (
                  <>
                    Envoi en cours...
                  </>
                ) : (
                  <div className='flex items-center justify-center gap-4'>
                    Envoyer le message
                    <FiSend />
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Section FAQ - Design amélioré */}
        <div className="mt-10 md:mt-16 bg-white rounded-lg shadow-lg p-5 md:p-8">
          <div className="flex items-center justify-center mb-8">
            <span className="w-12 h-1 bg-green-700 mr-3"></span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">Questions fréquentes</h2>
            <span className="w-12 h-1 bg-green-700 ml-3"></span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`bg-white border rounded-lg transition-all duration-300 overflow-hidden ${
                  openFaqIndex === index 
                    ? 'shadow-md border-blue-200 ring-1 ring-blue-300' 
                    : 'shadow-sm border-gray-200 hover:shadow-md'
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
                  aria-expanded={openFaqIndex === index}
                >
                  <h3 className={`text-lg font-semibold ${openFaqIndex === index ? 'text-blue-700' : 'text-gray-800'}`}>
                    {faq.question}
                  </h3>
                  <span className={`transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${openFaqIndex === index ? 'text-blue-700' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaqIndex === index ? 'max-h-40' : 'max-h-0'
                  }`}
                >
                  <div className="p-4 pt-0 text-gray-600 border-t border-gray-100">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Bouton "Vous avez d'autres questions?" */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Vous avez d&apos;autres questions qui ne figurent pas dans cette liste ?</p>
            <Link 
              href="#form" 
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Contactez-nous directement
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}