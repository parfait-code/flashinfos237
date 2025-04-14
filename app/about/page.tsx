import React from 'react';
import Link from 'next/link';
import { FiFacebook, FiInstagram } from 'react-icons/fi';

export const metadata = {
  title: 'À propos - FlashInfos237 | Actualités du Cameroun en temps réel',
  description: 'Découvrez qui nous sommes, notre mission et nos valeurs. FlashInfos237 est votre source fiable d\'informations camerounaises.',
};


export default function AboutPage() {
  return (
    <main className="bg-gray-50">
      {/* En-tête de la page - Style inspiré de la page Contact */}
      <div className="z-0 bg-gradient-to-r from-green-700 via-red-600 to-amber-500">
        <div className="container bg-transparent mx-auto px-4 py-12 md:py-16 text-center text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">À propos de <span>Flash<span>Infos</span>237</span></h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Votre source d&apos;information fiable sur l&apos;actualité camerounaise
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Section Notre Histoire */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="w-8 h-1 bg-green-700 mr-2"></span>
            Notre Histoire
          </h2>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 md:p-8">
              <p className="mb-4">
                FlashInfos237 est né d&apos;un simple constat : le besoin d&apos;une source d&apos;information fiable, rapide et objective sur l&apos;actualité camerounaise. Dans un monde où la désinformation se propage à la vitesse de la lumière, notre équipe de journalistes chevronnés s&apos;est donnée pour mission de ramener l&apos;intégrité et la rigueur au cœur du paysage médiatique camerounais.
              </p>
              <p className="mb-4">
                Lancé en 2025, notre portail d&apos;informations se projette comme une référence pour les Camerounais du pays et de la diaspora, ainsi que pour tous ceux qui s&apos;intéressent à l&apos;actualité de ce pays d&apos;Afrique centrale. Notre croissance rapide témoigne de la confiance que nos lecteurs placent en nous et de la qualité de notre travail journalistique.
              </p>
              <p>
                Aujourd&apos;hui, FlashInfos237 continue d&apos;évoluer, en investissant dans les nouvelles technologies et en élargissant notre couverture, mais toujours avec le même engagement envers la vérité et l&apos;excellence journalistique qui ont fait notre réputation.
              </p>
            </div>
          </div>
        </section>

        {/* Section Notre Mission et Nos Valeurs */}
        <section className="mb-12 md:mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              <div className="flex items-center mb-6">
                <div className="bg-green-100 p-2 md:p-3 rounded-full flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-xl md:text-2xl font-bold ml-3">Notre Mission</h2>
              </div>
              <p className="mb-4">
                Notre mission est de fournir aux Camerounais et à tous ceux qui s&apos;intéressent au Cameroun une couverture de l&apos;actualité qui soit:
              </p>
              <ul className="space-y-3 mb-4">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-600 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Rapide :</strong> Pour vous tenir informés des derniers développements en temps réel.</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-600 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Fiable :</strong> Basée sur des faits vérifiés et des sources crédibles.</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-600 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Complète :</strong> Couvrant tous les sujets qui façonnent le Cameroun d&apos;aujourd&apos;hui et de demain.</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-600 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Accessible :</strong> Présentée de manière claire et compréhensible pour tous.</span>
                </li>
              </ul>
              <p>
                Nous croyons fermement que des citoyens bien informés sont la clé d&apos;une société démocratique dynamique.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              <div className="flex items-center mb-6">
                <div className="bg-red-100 p-2 md:p-3 rounded-full flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="text-xl md:text-2xl font-bold ml-3">Nos Valeurs</h2>
              </div>
              <ul className="space-y-4">
                <li>
                  <h3 className="font-bold text-lg mb-1">Intégrité</h3>
                  <p className="text-gray-700">Nous restons fidèles à la vérité, même lorsqu&apos;elle est difficile à entendre. Notre crédibilité est notre bien le plus précieux.</p>
                </li>
                <li>
                  <h3 className="font-bold text-lg mb-1">Indépendance</h3>
                  <p className="text-gray-700">Nous maintenons une indépendance éditoriale stricte, libre de toute influence politique ou commerciale.</p>
                </li>
                <li>
                  <h3 className="font-bold text-lg mb-1">Impartialité</h3>
                  <p className="text-gray-700">Nous présentons toutes les facettes d&apos;une histoire, sans parti pris, permettant à nos lecteurs de se forger leur propre opinion.</p>
                </li>
                <li>
                  <h3 className="font-bold text-lg mb-1">Innovation</h3>
                  <p className="text-gray-700">Nous adoptons les nouvelles technologies et formats pour mieux servir notre public dans un monde médiatique en constante évolution.</p>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Notre équipe */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="w-8 h-1 bg-amber-500 mr-2"></span>
            Notre Équipe
          </h2>
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <p className="mb-4">
              Notre équipe est composée de journalistes professionnels, d&apos;analystes et d&apos;experts dans divers domaines, tous unis par la passion de l&apos;information de qualité. Forts de leur expérience acquise dans les médias nationaux et internationaux, nos rédacteurs apportent une perspective unique et approfondie sur l&apos;actualité camerounaise et internationale.
            </p>
            <p className="mb-4">
              De la politique à l&apos;économie, en passant par le sport, la culture et les nouvelles technologies, nos spécialistes travaillent sans relâche pour vous offrir une couverture complète et nuancée de tout ce qui fait l&apos;actualité au Cameroun et a l&apos;internationale.
            </p>
          </div>
        </section>

        {/* Section Contact */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="w-8 h-1 bg-green-600 mr-2"></span>
            Contactez-nous
          </h2>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-6 md:p-8">
                <h3 className="text-xl font-semibold mb-4">Nous sommes à votre écoute</h3>
                <p className="mb-6">
                  Vous avez des questions, des suggestions ou vous souhaitez nous signaler une information ? N&apos;hésitez pas à nous contacter.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold">Email</h4>
                      <p className="text-gray-700">contact@flashinfos237.com</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-red-100 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold">Téléphone</h4>
                      <p className="text-gray-700">+237 650 601 520</p>
                      <p className="text-gray-700">+237 697 965 420</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-amber-100 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold">Adresse</h4>
                      <p className="text-gray-700">Yaoundé, Cameroun</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-100 p-6 md:p-8">
                <h3 className="text-xl font-semibold mb-4">Suivez-nous</h3>
                <div className="flex mb-6 space-x-4">
                  <Link href="#" className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                    <FiFacebook className='w-7 h-7'/>
                  </Link>
                  <Link href="#" className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-colors">
                    <FiInstagram className='w-7 h-7'/>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}