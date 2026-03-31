// =============================================================
// seo.js - Keeps head metadata aligned with the current hash route
// =============================================================

(function () {
  const config = window.__GENKI_CONFIG__ || {};
  const fallbackSiteUrl = 'https://weargenki.vercel.app/';
  const siteUrl = normalizeBaseUrl(config.SITE_URL || fallbackSiteUrl);
  const defaultImage = 'https://res.cloudinary.com/dzhvdoifb/image/upload/v1762066135/WtBAmJy_nidtmq.webp';
  const brandName = 'GENKI';

  const defaults = {
    title: `${brandName} | Streetwear built for real life`,
    description: 'Independent streetwear with limited-run drops, everyday essentials, and bold looks built for real life.',
    type: 'website',
    path: '/',
    image: defaultImage,
    imageAlt: 'GENKI streetwear campaign image'
  };

  const routeMeta = {
    '#home': defaults,
    '#shop': {
      title: `${brandName} Shop | Tees, Hoodies, Outerwear, Accessories`,
      description: 'Shop limited-run GENKI streetwear including tees, hoodies, outerwear, and accessories.',
      type: 'website',
      path: '/'
    },
    '#about': {
      title: `About ${brandName} | Independent Streetwear Label`,
      description: 'Learn about GENKI, an independent streetwear label focused on wearable graphics, limited drops, and community-led style.',
      type: 'website',
      path: '/'
    },
    '#contact': {
      title: `Contact ${brandName} | Collaborations, Support, and Press`,
      description: 'Contact GENKI for customer support, collaborations, creator partnerships, and general inquiries.',
      type: 'website',
      path: '/'
    },
    '#lookbook-main': {
      title: `${brandName} Lookbook | Editorial Streetwear Styling`,
      description: 'Browse the GENKI lookbook for editorial styling, campaign imagery, and community fits.',
      type: 'website',
      path: '/'
    },
    '#collabs': {
      title: `${brandName} Collabs | Creator and Brand Partnerships`,
      description: 'Work with GENKI on creator campaigns, curated drops, and brand collaborations.',
      type: 'website',
      path: '/'
    }
  };

  function normalizeBaseUrl(value) {
    const trimmed = String(value || '').trim();
    if (!trimmed) return fallbackSiteUrl;
    try {
      const url = new URL(trimmed);
      return `${url.origin}/`;
    } catch {
      return fallbackSiteUrl;
    }
  }

  function buildAbsoluteUrl(pathname) {
    return new URL(pathname || '/', siteUrl).toString();
  }

  function setMeta(selector, attribute, value) {
    const el = document.querySelector(selector);
    if (el && value) el.setAttribute(attribute, value);
  }

  function updateStructuredData(meta) {
    const el = document.getElementById('structured-data');
    if (!el) return;

    const pageUrl = buildAbsoluteUrl(meta.path || '/');
    const graph = [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}#organization`,
        name: brandName,
        url: siteUrl,
        logo: 'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772417097/Kanji_Boxed_z35cw0.png',
        sameAs: ['https://www.instagram.com/weargenki/']
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}#website`,
        url: siteUrl,
        name: brandName,
        description: defaults.description,
        publisher: { '@id': `${siteUrl}#organization` }
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: meta.title,
        description: meta.description,
        isPartOf: { '@id': `${siteUrl}#website` },
        about: { '@id': `${siteUrl}#organization` }
      }
    ];

    if (meta.type === 'product' && meta.product) {
      graph.push({
        '@type': 'Product',
        '@id': `${pageUrl}#product`,
        name: meta.product.title,
        image: meta.product.image ? [meta.product.image] : [defaultImage],
        description: meta.description,
        brand: {
          '@type': 'Brand',
          name: brandName
        },
        category: meta.product.category || 'Streetwear',
        offers: {
          '@type': 'Offer',
          priceCurrency: 'USD',
          price: meta.product.price || '',
          availability: 'https://schema.org/InStock',
          url: pageUrl
        }
      });
    }

    el.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
  }

  function getProductMeta(productId) {
    const products = Array.isArray(window.PRODUCTS) ? window.PRODUCTS : [];
    const product = products.find((item) => item.id === productId);
    if (!product) return null;

    const category = Array.isArray(product.categories)
      ? product.categories.join(', ')
      : product.categories || product.category || 'Streetwear';
    const cleanPrice = String(product.price || '').replace(/[^0-9.]/g, '');
    const description = `${product.title} by ${brandName}. Shop ${category.toLowerCase()} with available sizes ${Array.isArray(product.sizes) ? product.sizes.join(', ') : 'and limited-run options'}.`;

    return {
      title: `${product.title} | ${brandName}`,
      description,
      type: 'product',
      path: '/',
      image: product.images?.[0] || defaultImage,
      imageAlt: `${product.title} by ${brandName}`,
      product: {
        title: product.title,
        image: product.images?.[0] || defaultImage,
        category,
        price: cleanPrice
      }
    };
  }

  function getRouteMeta() {
    const hash = window.location.hash || '#home';
    const baseHash = hash.split('?')[0].split('/')[0];

    if (baseHash && Array.isArray(window.PRODUCTS) && window.PRODUCTS.some((product) => `#${product.id}` === baseHash)) {
      return getProductMeta(baseHash.replace('#', '')) || defaults;
    }

    return routeMeta[baseHash] || defaults;
  }

  function applySeo() {
    const meta = { ...defaults, ...getRouteMeta() };
    const canonicalUrl = buildAbsoluteUrl(meta.path || '/');

    document.title = meta.title;
    setMeta('meta[name="description"]', 'content', meta.description);
    setMeta('meta[property="og:title"]', 'content', meta.title);
    setMeta('meta[property="og:description"]', 'content', meta.description);
    setMeta('meta[property="og:type"]', 'content', meta.type);
    setMeta('meta[property="og:url"]', 'content', canonicalUrl);
    setMeta('meta[property="og:image"]', 'content', meta.image);
    setMeta('meta[property="og:image:alt"]', 'content', meta.imageAlt);
    setMeta('meta[name="twitter:title"]', 'content', meta.title);
    setMeta('meta[name="twitter:description"]', 'content', meta.description);
    setMeta('meta[name="twitter:image"]', 'content', meta.image);
    setMeta('meta[name="twitter:image:alt"]', 'content', meta.imageAlt);
    setMeta('#canonical-link', 'href', canonicalUrl);
    updateStructuredData(meta);
  }

  window.applySeo = applySeo;
  window.addEventListener('hashchange', applySeo);
  window.addEventListener('load', applySeo);
  applySeo();
})();
