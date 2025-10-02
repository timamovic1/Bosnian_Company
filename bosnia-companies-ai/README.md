# Bosnia Companies AI

A modern, animated web application for exploring real Bosnian companies by city and sector, powered by AI-driven natural language search.

## Features

- 🔍 Natural language search for companies
- 🏢 Filter by city, sector, and rating
- 🤖 AI-powered query parsing
- ✨ Beautiful animations with Framer Motion
- 📱 Fully responsive design
- 🎨 Modern UI with Tailwind CSS and glass morphism

## Tech Stack

**Frontend:**
- React + Vite
- Tailwind CSS
- Framer Motion
- Lucide React icons

**Backend:**
- Node.js + Express
- CORS enabled
- CSV data parsing
- RapidAPI integration (optional)

## Local Setup

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

1. **Clone or navigate to the project directory**

```bash
cd bosnia-companies-ai
```

2. **Set up the backend**

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and add your RapidAPI key if you have one (optional):
```
PORT=3001
RAPIDAPI_KEY=your_key_here
```

Start the backend:
```bash
npm run dev
```

The backend will run on `http://localhost:3001`

3. **Set up the frontend** (in a new terminal)

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

4. **Open your browser**

Navigate to `http://localhost:5173` and start exploring!

## Example Queries

Try these natural language queries:

- "Companies in Sarajevo"
- "IT companies with 4+ stars"
- "How is BH Telecom?"
- "Retail companies in Tuzla"
- "Finance sector"
- "Manufacturing companies 4 stars"

## API Testing

Test the backend API directly with curl:

```bash
curl -X POST http://localhost:3001/api/ask \
  -H "Content-Type: application/json" \
  -d '{"userInput": "companies in Sarajevo"}'
```

Check backend health:

```bash
curl http://localhost:3001/api/health
```

## Project Structure

```
bosnia-companies-ai/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatBox.jsx
│   │   │   ├── CompanyList.jsx
│   │   │   ├── CompanyCard.jsx
│   │   │   ├── RatingStars.jsx
│   │   │   └── TypingDots.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── data/
│   └── companies.seed.csv
└── README.md
```

## Data

The app uses real Bosnian company data stored in `data/companies.seed.csv` including:

- BH Telecom
- Energoinvest
- Bosnalijek
- UniCredit Bank
- Bingo
- And 15 more companies...

Each company has:
- Name
- Sector (IT, Finance, Retail, etc.)
- City
- Website
- Description
- Average rating
- Review count

## Scripts

**Backend:**
- `npm run dev` - Start with nodemon (auto-reload)
- `npm start` - Start production server

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## License

MIT
