import React, { useEffect } from 'react';
import alifCharacterImg from '../assets/images/alif_character_pure_transparent_1780383675414.png';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export const SEO: React.FC<SEOProps> = React.memo(({
  title,
  description,
  keywords = "alif world, alif portfolio, alif work, zenox portfolio, alif, zenox, creative web developer, frontend engineer, ui/ux designer, react developer, interactive portfolio",
  image = "/alif-cloud-favicon.jpg",
  url = window.location.href,
  type = "website"
}) => {
  useEffect(() => {
    // 1. Update webpage title
    document.title = title;

    // Helper to safely update or insert meta tags in <head>
    const setMetaTag = (attributeName: string, attributeValue: string, contentValue: string) => {
      if (!contentValue) return;
      let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentValue);
    };

    // Helper to safely update link tags in <head>
    const setLinkTag = (rel: string, href: string, typeVal?: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!element) {
        element = document.createElement('link');
        element.rel = rel;
        document.head.appendChild(element);
      }
      element.href = href;
      if (typeVal) element.type = typeVal;
    };

    // 2. Set primary search engine tags
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords);
    setMetaTag('name', 'author', 'Alif (Zenox)');
    setMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // Canonical link
    setLinkTag('canonical', url);

    // Favicon links
    setLinkTag('icon', '/alif-cloud-favicon.jpg', 'image/jpeg');
    setLinkTag('apple-touch-icon', '/alif-cloud-favicon.jpg');

    // 3. Open Graph social presentation protocol tags
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', image);
    setMetaTag('property', 'og:url', url);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:site_name', 'Alif-World');

    // 4. Twitter Cards integration
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', image);

    // 5. Inject Structured Schema.org markup
    let schemaScript = document.getElementById('seo-ld-json') as HTMLScriptElement | null;
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'seo-ld-json';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }
    
    const structuredJSON = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": `${window.location.origin}/#website`,
          "name": "Alif-World",
          "alternateName": ["Alif World", "Alif Portfolio", "Zenox Portfolio", "Alif Work"],
          "url": window.location.origin,
          "description": description,
          "keywords": keywords,
          "inLanguage": "en"
        },
        {
          "@type": "Person",
          "@id": `${window.location.origin}/#person`,
          "name": "Alif",
          "alternateName": ["Zenox", "alifop2400"],
          "description": description,
          "url": window.location.origin,
          "image": `${window.location.origin}/alif-cloud-favicon.jpg`,
          "knowsAbout": [
            "alif world",
            "alif portfolio",
            "alif work",
            "zenox portfolio",
            "Frontend Development",
            "React",
            "Next.js",
            "AstroJS",
            "Tailwind CSS",
            "UI/UX Design",
            "3D Web Interactions"
          ],
          "jobTitle": "Creative Frontend Developer and UI/UX Designer",
          "hasPortfolio": {
            "@type": "CreativeWorkSeries",
            "name": "Alif-World Interactive Portfolio",
            "url": window.location.origin
          }
        }
      ]
    };
    
    schemaScript.textContent = JSON.stringify(structuredJSON);

  }, [title, description, keywords, image, url, type]);

  return null;
});

SEO.displayName = 'SEO';
