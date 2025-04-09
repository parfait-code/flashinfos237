// pages/privacy.tsx
'use client';

export default function PrivacyPolicy() {
  return (
    <>
      <main className="container mx-auto px-4 py-8 min-h-screen">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-10 h-1 bg-green-500 mr-3"></span>
            Politique de Confidentialité
          </h1>
          
          <div className="prose max-w-none">
            <p className="mb-4">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">1. Introduction</h2>
            <p className="mb-4">
              Chez FlashInfos237, nous accordons une grande importance à la protection de vos données personnelles. 
              Cette politique de confidentialité vise à vous informer sur la manière dont nous collectons, utilisons et 
              protégeons vos informations lorsque vous visitez notre site web et utilisez nos services.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">2. Informations que nous collectons</h2>
            <p className="mb-2">Nous pouvons collecter différents types d&apos;informations, notamment :</p>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2">
                <strong>Informations personnelles</strong> : nom, adresse e-mail, et autres coordonnées que vous nous 
                fournissez volontairement lorsque vous vous inscrivez à notre newsletter ou nous contactez.
              </li>
              <li className="mb-2">
                <strong>Informations de navigation</strong> : données collectées automatiquement lors de votre visite sur 
                notre site, telles que votre adresse IP, type de navigateur, pages visitées, et temps passé sur le site.
              </li>
              <li className="mb-2">
                <strong>Cookies et technologies similaires</strong> : nous utilisons des cookies pour améliorer votre 
                expérience sur notre site et recueillir des informations sur votre utilisation de nos services.
              </li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">3. Utilisation de vos informations</h2>
            <p className="mb-2">Nous utilisons vos informations pour :</p>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2">Vous fournir les actualités et informations que vous demandez</li>
              <li className="mb-2">Personnaliser votre expérience sur notre site</li>
              <li className="mb-2">Vous envoyer notre newsletter si vous y êtes abonné</li>
              <li className="mb-2">Améliorer notre site web et nos services</li>
              <li className="mb-2">Répondre à vos questions et demandes</li>
              <li className="mb-2">Analyser l&apos;utilisation de notre site et améliorer nos contenus</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">4. Partage de vos informations</h2>
            <p className="mb-4">
              Nous ne vendons pas vos informations personnelles à des tiers. Nous pouvons partager vos informations avec :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2">Nos fournisseurs de services qui nous aident à exploiter notre site</li>
              <li className="mb-2">Les autorités compétentes lorsque la loi l&apos;exige</li>
              <li className="mb-2">Des tiers avec votre consentement explicite</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">5. Sécurité des données</h2>
            <p className="mb-4">
              Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos informations personnelles 
              contre tout accès, modification, divulgation ou destruction non autorisé. Cependant, aucune méthode de 
              transmission sur Internet ou de stockage électronique n&apos;est totalement sécurisée. Par conséquent, nous ne 
              pouvons garantir une sécurité absolue.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">6. Vos droits</h2>
            <p className="mb-2">Vous disposez des droits suivants concernant vos données personnelles :</p>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2">Droit d&apos;accès à vos données personnelles</li>
              <li className="mb-2">Droit de rectification de vos données inexactes</li>
              <li className="mb-2">Droit à l&apos;effacement de vos données (droit à l&apos;oubli)</li>
              <li className="mb-2">Droit à la limitation du traitement</li>
              <li className="mb-2">Droit à la portabilité de vos données</li>
              <li className="mb-2">Droit d&apos;opposition au traitement</li>
            </ul>
            <p className="mb-4">
              Pour exercer ces droits, veuillez nous contacter à l&apos;adresse e-mail indiquée dans la section &quot;Contact&quot; ci-dessous.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">7. Cookies</h2>
            <p className="mb-4">
              Notre site utilise des cookies pour améliorer votre expérience. Vous pouvez configurer votre navigateur 
              pour refuser tous les cookies ou pour être informé lorsqu&apos;un cookie est envoyé. Cependant, certaines 
              fonctionnalités de notre site peuvent ne pas fonctionner correctement si vous désactivez les cookies.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">8. Modifications de notre politique de confidentialité</h2>
            <p className="mb-4">
              Nous pouvons mettre à jour notre politique de confidentialité de temps à autre. Nous vous informerons de 
              tout changement en publiant la nouvelle politique de confidentialité sur cette page et en mettant à jour la 
              date de &quot;dernière mise à jour&quot; en haut de cette politique.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">9. Contact</h2>
            <p className="mb-4">
              Si vous avez des questions concernant cette politique de confidentialité, veuillez nous contacter à :
              <br /><a href="mailto:contact@flashinfos237.com" className="text-green-700 hover:underline">contact@flashinfos237.com</a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}