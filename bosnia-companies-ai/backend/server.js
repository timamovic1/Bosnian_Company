import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let companies = [];

function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');

  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj = {};
    headers.forEach((header, index) => {
      const value = values[index]?.trim();
      if (header === 'ratingAvg') {
        obj[header] = parseFloat(value);
      } else if (header === 'reviewsCount') {
        obj[header] = parseInt(value, 10);
      } else {
        obj[header] = value;
      }
    });
    obj.id = Math.random().toString(36).substr(2, 9);
    return obj;
  });
}

function loadCompanies() {
  try {
    const csvPath = path.join(__dirname, '../data/companies.seed.csv');
    const csvText = fs.readFileSync(csvPath, 'utf-8');
    companies = parseCSV(csvText);
    console.log(`Loaded ${companies.length} companies from CSV`);
  } catch (error) {
    console.error('Error loading CSV:', error);
    companies = [];
  }
}

loadCompanies();

const CITIES = ['sarajevo', 'mostar', 'tuzla', 'banja luka', 'zenica', 'bihać', 'visoko', 'tešanj', 'čapljina', 'brčko'];
const SECTORS = ['it', 'energy', 'healthcare', 'finance', 'retail', 'manufacturing'];

function parseUserIntent(input) {
  const lowerInput = input.toLowerCase();

  const intent = {
    city: null,
    sector: null,
    minRating: null,
    companyName: null,
    type: 'list'
  };

  for (const city of CITIES) {
    if (lowerInput.includes(city)) {
      intent.city = city;
      break;
    }
  }

  for (const sector of SECTORS) {
    if (lowerInput.includes(sector)) {
      intent.sector = sector;
      break;
    }
  }

  const ratingMatch = lowerInput.match(/(\d+\.?\d*)\s*\+?\s*stars?/);
  if (ratingMatch) {
    intent.minRating = parseFloat(ratingMatch[1]);
  } else if (lowerInput.includes('4+') || lowerInput.includes('4 +')) {
    intent.minRating = 4.0;
  }

  if (lowerInput.includes('how is') || lowerInput.includes('about') || lowerInput.includes('tell me')) {
    const possibleName = companies.find(c =>
      lowerInput.includes(c.name.toLowerCase())
    );
    if (possibleName) {
      intent.companyName = possibleName.name;
      intent.type = 'company';
    }
  }

  if (!intent.companyName) {
    const possibleMatch = companies.find(c =>
      lowerInput.includes(c.name.toLowerCase().split(' ')[0])
    );
    if (possibleMatch && !intent.city && !intent.sector) {
      intent.companyName = possibleMatch.name;
      intent.type = 'company';
    }
  }

  return intent;
}

async function callRapidAPI(userInput) {
  try {
    const apiKey = process.env.RAPIDAPI_KEY;
    if (!apiKey || apiKey === 'YOUR_KEY_HERE') {
      return { providerEcho: 'RapidAPI key not configured' };
    }

    return { providerEcho: `Processed query: ${userInput}` };
  } catch (error) {
    console.error('RapidAPI error:', error);
    return { providerEcho: 'API call failed' };
  }
}

app.post('/api/ask', async (req, res) => {
  try {
    const { userInput } = req.body;

    if (!userInput || typeof userInput !== 'string') {
      return res.status(400).json({
        type: 'text',
        text: 'Please provide a valid question.'
      });
    }

    const intent = parseUserIntent(userInput);
    const rapidApiResult = await callRapidAPI(userInput);

    if (intent.type === 'company' && intent.companyName) {
      const company = companies.find(c => c.name === intent.companyName);
      if (company) {
        const summary = `${company.name} is a ${company.sector} company based in ${company.city}. ${company.description} They have an average rating of ${company.ratingAvg} stars from ${company.reviewsCount} reviews.`;
        return res.json({
          type: 'company',
          company,
          summary,
          ...rapidApiResult
        });
      }
    }

    let filtered = [...companies];

    if (intent.city) {
      filtered = filtered.filter(c => c.city.toLowerCase() === intent.city);
    }

    if (intent.sector) {
      filtered = filtered.filter(c => c.sector.toLowerCase() === intent.sector);
    }

    if (intent.minRating) {
      filtered = filtered.filter(c => c.ratingAvg >= intent.minRating);
    }

    if (filtered.length > 0) {
      filtered.sort((a, b) => b.ratingAvg - a.ratingAvg);

      let title = 'Companies';
      if (intent.city && intent.sector) {
        title = `${intent.sector.toUpperCase()} companies in ${intent.city.charAt(0).toUpperCase() + intent.city.slice(1)}`;
      } else if (intent.city) {
        title = `Companies in ${intent.city.charAt(0).toUpperCase() + intent.city.slice(1)}`;
      } else if (intent.sector) {
        title = `${intent.sector.toUpperCase()} companies`;
      }

      if (intent.minRating) {
        title += ` (${intent.minRating}+ stars)`;
      }

      return res.json({
        type: 'list',
        title,
        items: filtered,
        ...rapidApiResult
      });
    }

    return res.json({
      type: 'text',
      text: 'No companies found matching your criteria. Try: "companies in Sarajevo" or "how is BH Telecom?" or "IT companies" or "4+ stars retail"',
      ...rapidApiResult
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      type: 'text',
      text: 'An error occurred processing your request.'
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', companies: companies.length });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
