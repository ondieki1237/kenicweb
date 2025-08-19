

import net from 'net';
import NodeCache from 'node-cache';

export interface Registrant {
  name: string;
  email: string;
  phone: string;
  organization: string;
}

export interface ParsedWhois {
  domain: string;
  status: string;
  registrar: string;
  creationDate: string;
  expiryDate: string;
  updatedDate: string;
  registrant: Registrant;
  nameservers: string[];
  dnssec?: string; // Added for extra info
  raw: string;
  errorMessage?: string; // Added to capture lookup errors
}

const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds
const VALID_CHARS_REGEX = /^[a-z0-9.-]+$/i; // Define valid domain characters
const MIN_LENGTH = 3;
const MAX_LENGTH = 63; // ICANN domain length limit

export const whoisLookup = async (domain: string, retries = MAX_RETRIES): Promise<string> => {
  const cached = cache.get<string>(domain);
  if (cached) return cached;

  return new Promise((resolve, reject) => {
    let response = '';
    const client = net.createConnection({ host: 'rdap.kenic.or.ke', port: 43 }, () => {
      client.write(`${domain}\r\n`);
    });

    client.on('data', (data) => {
      response += data.toString();
    });

    client.on('end', () => {
      cache.set(domain, response.trim());
      resolve(response.trim());
    });

    client.on('error', (err) => {
      if (retries > 0) {
        setTimeout(() => whoisLookup(domain, retries - 1).then(resolve).catch(reject), RETRY_DELAY);
      } else {
        reject(err);
      }
    });

    client.setTimeout(10000, () => {
      client.destroy();
      reject(new Error('WHOIS lookup timeout'));
    });
  });
};

export const parseWhoisResponse = (whoisData: string): ParsedWhois => {
  const lines = whoisData.split('\n');
  const parsed: ParsedWhois = {
    domain: '',
    status: 'unknown',
    registrar: '',
    creationDate: '',
    expiryDate: '',
    updatedDate: '',
    registrant: { name: '', email: '', phone: '', organization: '' },
    nameservers: [],
    raw: whoisData,
  };

  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith('%') || line.startsWith('#')) continue;

    const [key, ...values] = line.split(':').map(s => s.trim());
    const value = values.join(':').trim();

    switch (key.toLowerCase()) {
      case 'domain name':
        parsed.domain = value;
        break;
      case 'domain status':
        parsed.status = value;
        break;
      case 'registrar':
        parsed.registrar = value;
        break;
      case 'creation date':
        parsed.creationDate = value;
        break;
      case 'registry expiry date':
      case 'expiry date':
        parsed.expiryDate = value;
        break;
      case 'updated date':
        parsed.updatedDate = value;
        break;
      case 'registrant name':
        parsed.registrant.name = value;
        break;
      case 'registrant email':
        parsed.registrant.email = value;
        break;
      case 'registrant phone':
        parsed.registrant.phone = value;
        break;
      case 'registrant organization':
        parsed.registrant.organization = value;
        break;
      case 'name server':
        if (value && !parsed.nameservers.includes(value)) parsed.nameservers.push(value);
        break;
      case 'dnssec':
        parsed.dnssec = value;
        break;
    }
  }

  // Capture error messages if present
  if (whoisData.includes('Server can\'t process your request') || whoisData.includes('timeout') || whoisData.includes('The queried object does not exist')) {
    parsed.errorMessage = whoisData;
  }

  return parsed;
};

export const isDomainAvailable = (whoisData: string): boolean => {
  const lowerData = whoisData.toLowerCase();
  // Check for availability indicators, including "no object found"
  return (
    lowerData.includes('no match') ||
    lowerData.includes('not found') ||
    lowerData.includes('domain not found') ||
    lowerData.includes('no entries found') ||
    lowerData.includes('the queried object does not exist') || // Added for test123456.co.ke
    lowerData.includes('server can\'t process your request') ||
    lowerData.includes('timeout')
  );
};

export const checkDomainAvailability = async (domain: string, extensions: string[] = ['.co.ke', '.or.ke', '.ac.ke']): Promise<{
  domain: string;
  available: boolean;
  message: string;
  whoisData: ParsedWhois | null;
}> => {
  try {
    let checkedDomain = domain.trim().toLowerCase();
    // Validate and sanitize domain
    if (!VALID_CHARS_REGEX.test(checkedDomain)) {
      throw new Error('Invalid domain characters');
    }
    if (checkedDomain.length < MIN_LENGTH || checkedDomain.length > MAX_LENGTH) {
      throw new Error(`Domain length must be between ${MIN_LENGTH} and ${MAX_LENGTH} characters`);
    }
    checkedDomain = checkedDomain.replace(/\.{2,}/g, '.'); // Remove multiple dots
    if (checkedDomain.split('.').length > 2) {
      checkedDomain = checkedDomain.split('.').slice(0, 2).join('.'); // Limit to domain + TLD
    }
    if (!extensions.some(ext => checkedDomain.endsWith(ext))) {
      checkedDomain += extensions[0]; // Default to .co.ke
    }

    const whoisData = await whoisLookup(checkedDomain);
    const available = isDomainAvailable(whoisData);
    const parsed = parseWhoisResponse(whoisData);

    if (available) {
      return { domain: checkedDomain, available: true, message: 'Domain is available for registration', whoisData: null };
    } else if (parsed.errorMessage) {
      return { domain: checkedDomain, available: true, message: 'Domain may be available (WHOIS server error or no object)', whoisData: null };
    } else {
      return { domain: checkedDomain, available: false, message: 'Domain is already registered', whoisData: parsed };
    }
  } catch (error: any) {
    console.error(`WHOIS lookup failed for ${domain} at ${new Date().toISOString()}: ${error.message}`);
    return { domain, available: true, message: `Domain may be available (lookup failed: ${error.message})`, whoisData: null };
  }
};