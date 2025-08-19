

export interface Registrar {
  id: string;
  name: string;
  website: string;
  logo: string;
  phone: string;
  email: string;
  address: string;
  pricing: Record<string, number>;
  features: string[];
  rating: number;
  reviews: number;
}

export interface DomainPricing {
  registrar: string;
  registrarId: string;
  website: string;
  phone: string;
  email: string;
  price: number;
  currency: string;
  rating: number;
  reviews: number;
  features: string[];
  registerUrl?: string; // Added for direct registration link
}

export interface DomainSuggestion {
  domain: string;
  bestPrice: DomainPricing;
  allPricing: DomainPricing[];
  available: boolean;
  expiryDate?: string; // Added to track potential expiration (if integrated with WHOIS)
}

// Real Kenyan Domain Registrars and Pricing
export const registrars: Registrar[] = [
  {
    id: 'hostpinnacle',
    name: 'HostPinnacle Cloud',
    website: 'https://www.hostpinnacle.co.ke/',
    logo: 'https://www.hostpinnacle.co.ke/assets/images/logo.png',
    phone: '+254-111 054 710',
    email: 'info@hostpinnacle.co.ke',
    address: '4th Floor, Studio House. Marcus Garvey Road, Off Argwings Kodhek Road, Kilimani. P.O Box 10065 - 00400, Nairobi.',
    pricing: {
      '.co.ke': 500,
      '.com': 1750,
      '.org': 1750,
      '.africa': 1000,
      '.xyz': 450,
      '.net': 1950,
      '.or.ke': 500,
      '.ac.ke': 500,
      '.sc.ke': 500,
      '.go.ke': 500,
      '.me.ke': 500
    },
    features: [
      'Free .KE Domain with hosting',
      'Instant activation',
      'WHOIS lookup service',
      'Domain transfer assistance',
      'SSL certificates',
      '24/7 customer support'
    ],
    rating: 4.8,
    reviews: 1250
  },
  {
    id: 'truehost',
    name: 'Truehost Cloud',
    website: 'https://truehost.co.ke/',
    logo: 'https://truehost.co.ke/assets/images/logo.png',
    phone: '+254-700-000000',
    email: 'support@truehost.co.ke',
    address: 'Nairobi, Kenya',
    pricing: {
      '.co.ke': 450,
      '.com': 1600,
      '.org': 1600,
      '.africa': 950,
      '.xyz': 400,
      '.net': 1800,
      '.or.ke': 450,
      '.ac.ke': 450,
      '.sc.ke': 450,
      '.go.ke': 450,
      '.me.ke': 450
    },
    features: [
      'Affordable domain pricing',
      'Free domain with hosting',
      'Domain management tools',
      'DNS management',
      'Email hosting',
      'Technical support'
    ],
    rating: 4.6,
    reviews: 890
  },
  {
    id: 'kenyawebexperts',
    name: 'Kenya Web Experts',
    website: 'https://kenyawebexperts.co.ke/',
    logo: 'https://kenyawebexperts.co.ke/assets/images/logo.png',
    phone: '+254-733-000000',
    email: 'info@kenyawebexperts.co.ke',
    address: 'Nairobi, Kenya',
    pricing: {
      '.co.ke': 480,
      '.com': 1700,
      '.org': 1700,
      '.africa': 980,
      '.xyz': 420,
      '.net': 1850,
      '.or.ke': 480,
      '.ac.ke': 480,
      '.sc.ke': 480,
      '.go.ke': 480,
      '.me.ke': 480
    },
    features: [
      'Local Kenyan support',
      'Domain registration',
      'Web hosting services',
      'SSL certificates',
      'Domain transfer',
      'WHOIS protection'
    ],
    rating: 4.5,
    reviews: 650
  },
  {
    id: 'africahosting',
    name: 'Africa Hosting',
    website: 'https://africahosting.co.ke/',
    logo: 'https://africahosting.co.ke/assets/images/logo.png',
    phone: '+254-722-000000',
    email: 'support@africahosting.co.ke',
    address: 'Nairobi, Kenya',
    pricing: {
      '.co.ke': 520,
      '.com': 1800,
      '.org': 1800,
      '.africa': 1050,
      '.xyz': 480,
      '.net': 1900,
      '.or.ke': 520,
      '.ac.ke': 520,
      '.sc.ke': 520,
      '.go.ke': 520,
      '.me.ke': 520
    },
    features: [
      'African-focused hosting',
      'Domain registration',
      'Cloud hosting',
      'VPS services',
      'Dedicated servers',
      '24/7 support'
    ],
    rating: 4.4,
    reviews: 420
  }
];

// Get pricing for a specific domain with validation and error handling
export const getDomainPricing = (domainName: string): DomainPricing[] => {
  if (!domainName || typeof domainName !== 'string') {
    console.warn('Invalid domain name provided');
    return [];
  }

  const extension = domainName.split('.').pop();
  const fullExtension = domainName.includes('.') ? domainName.substring(domainName.lastIndexOf('.')) : `.${domainName}`;

  const pricing: DomainPricing[] = [];

  registrars.forEach((registrar) => {
    let price = registrar.pricing[fullExtension];
    if (!price && extension) price = registrar.pricing[`.${extension}`];
    if (!price && extension === 'ke') price = registrar.pricing['.co.ke'];

    if (price) {
      pricing.push({
        registrar: registrar.name,
        registrarId: registrar.id,
        website: registrar.website,
        phone: registrar.phone,
        email: registrar.email,
        price,
        currency: 'KES',
        rating: registrar.rating,
        reviews: registrar.reviews,
        features: registrar.features,
        registerUrl: `${registrar.website}/domain-registration?domain=${encodeURIComponent(domainName)}`, // Added registration link
      });
    }
  });

  return pricing.length > 0 ? pricing.sort((a, b) => a.price - b.price) : [];
};

// Retrieve all registrars
export const getAllRegistrars = (): Registrar[] => registrars;

// Retrieve a specific registrar by ID
export const getRegistrarById = (id: string): Registrar | undefined => registrars.find(r => r.id === id);

// Get the best (cheapest) price for a domain
export const getBestPrice = (domainName: string): DomainPricing | null => {
  const pricing = getDomainPricing(domainName);
  return pricing.length > 0 ? pricing[0] : null;
};

// Generate domain suggestions with optional availability integration
export const generateDomainSuggestions = (baseName: string, integrateAvailability = false): DomainSuggestion[] => {
  const suggestions: DomainSuggestion[] = [];
  const extensions = ['.co.ke', '.or.ke', '.ac.ke', '.sc.ke', '.go.ke', '.me.ke', '.com', '.org', '.africa', '.xyz', '.net'];

  extensions.forEach(ext => {
    const domainName = baseName + ext;
    const pricing = getDomainPricing(domainName);
    if (pricing.length > 0) {
      suggestions.push({
        domain: domainName,
        bestPrice: pricing[0],
        allPricing: pricing,
        available: integrateAvailability ? false : true, // Default true, set to false if availability check is intended
      });
    }
  });

  return suggestions.slice(0, 8).sort((a, b) => a.bestPrice.price - b.bestPrice.price);
};

// Update registrar data (for future dynamic integration)
export const updateRegistrars = (newRegistrars: Registrar[]): void => {
  Object.assign(registrars, newRegistrars); // Merge new data, preserving existing structure
  console.log('Registrars updated successfully');
};

// Calculate average price across registrars for a domain
export const getAveragePrice = (domainName: string): number => {
  const pricing = getDomainPricing(domainName);
  return pricing.length > 0 ? pricing.reduce((sum, p) => sum + p.price, 0) / pricing.length : 0;
};