// services/whoisService.ts
import net from 'net';

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
  raw: string;
}

export const whoisLookup = (domain: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    let response = '';
    const client = net.createConnection({ host: 'rdap.kenic.or.ke', port: 43 }, () => {
      client.write(domain + '\r\n'); // Send domain to WHOIS server
    });

    client.on('data', (data) => {
      response += data.toString();
    });

    client.on('end', () => {
      resolve(response.trim());
    });

    client.on('error', (err) => {
      reject(err);
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
    registrant: {
      name: '',
      email: '',
      phone: '',
      organization: ''
    },
    nameservers: [],
    raw: whoisData
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
        if (value && !parsed.nameservers.includes(value)) {
          parsed.nameservers.push(value);
        }
        break;
    }
  }

  return parsed;
};

export const isDomainAvailable = (whoisData: string): boolean => {
  const lowerData = whoisData.toLowerCase();
  return (
    lowerData.includes('no match') ||
    lowerData.includes('not found') ||
    lowerData.includes('domain not found') ||
    lowerData.includes('no entries found')
  );
};

export const checkDomainAvailability = async (domain: string): Promise<{
  domain: string;
  available: boolean;
  message: string;
  whoisData: ParsedWhois | null;
}> => {
  try {
    // Ensure domain has .ke extension
    if (!domain.toLowerCase().endsWith('.ke')) {
      domain = domain + '.co.ke';
    }

    const whoisData = await whoisLookup(domain);
    const available = isDomainAvailable(whoisData);

    if (available) {
      return {
        domain,
        available: true,
        message: 'Domain is available for registration',
        whoisData: null
      };
    } else {
      const parsed = parseWhoisResponse(whoisData);
      return {
        domain,
        available: false,
        message: 'Domain is already registered',
        whoisData: parsed
      };
    }
  } catch (error: any) {
    throw new Error(`WHOIS lookup failed: ${error.message}`);
  }
};
