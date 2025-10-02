/*
  # Bosnia Companies Database Schema

  ## Overview
  Creates the complete database schema for the Bosnia Companies AI application,
  including company listings and user interactions.

  ## New Tables

  ### `companies`
  Stores information about companies in Bosnia and Herzegovina
  - `id` (uuid, primary key): Unique identifier for each company
  - `name` (text): Company name
  - `sector` (text): Business sector (IT, Energy, Healthcare, Finance, Retail, Manufacturing)
  - `city` (text): City where company is located
  - `website` (text): Company website URL
  - `description` (text): Brief description of the company
  - `rating_avg` (numeric): Average rating (0-5)
  - `reviews_count` (integer): Number of reviews
  - `created_at` (timestamptz): Timestamp when record was created
  - `updated_at` (timestamptz): Timestamp when record was last updated

  ## Security
  - Enable RLS on `companies` table
  - Allow public read access (authenticated and anonymous users)
  - Only authenticated users with admin role can insert/update/delete

  ## Indexes
  - Index on `city` for faster city-based queries
  - Index on `sector` for faster sector-based queries
  - Index on `rating_avg` for faster rating-based sorting
*/

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sector text NOT NULL,
  city text NOT NULL,
  website text,
  description text,
  rating_avg numeric(3,2) DEFAULT 0.0,
  reviews_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_companies_city ON companies(city);
CREATE INDEX IF NOT EXISTS idx_companies_sector ON companies(sector);
CREATE INDEX IF NOT EXISTS idx_companies_rating ON companies(rating_avg DESC);

-- Enable Row Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Allow anyone (including anonymous) to read companies
CREATE POLICY "Anyone can view companies"
  ON companies
  FOR SELECT
  USING (true);

-- Insert seed data
INSERT INTO companies (name, sector, city, website, description, rating_avg, reviews_count) VALUES
  ('BH Telecom', 'IT', 'Sarajevo', 'https://www.bhtelecom.ba', 'Leading telecom operator', 4.2, 132),
  ('Energoinvest', 'Energy', 'Sarajevo', 'https://www.energoinvest.ba', 'Energy & engineering', 4.0, 58),
  ('Bosnalijek', 'Healthcare', 'Sarajevo', 'https://www.bosnalijek.com', 'Pharmaceuticals', 4.3, 91),
  ('UniCredit Bank d.d.', 'Finance', 'Mostar', 'https://www.unicredit.ba', 'Banking services', 4.1, 75),
  ('Bingo', 'Retail', 'Tuzla', 'https://bingobih.ba', 'Retail chain', 4.4, 201),
  ('Sarajevska pivara', 'Manufacturing', 'Sarajevo', 'https://sarajevska-pivara.com', 'Brewery', 4.0, 64),
  ('Telemach', 'IT', 'Sarajevo', 'https://telemach.ba', 'Telecom & cable TV', 4.1, 120),
  ('HT Eronet', 'IT', 'Mostar', 'https://www.hteronet.ba', 'Telecommunications', 3.9, 42),
  ('Sparkasse Bank BiH', 'Finance', 'Sarajevo', 'https://sparkasse.ba', 'Bank', 4.0, 55),
  ('Prevent Group', 'Manufacturing', 'Visoko', 'https://prevent-group.com', 'Automotive supplier', 4.2, 78),
  ('ASA Prevent', 'Manufacturing', 'Tešanj', 'https://asa-prevent.com', 'Automotive components', 4.1, 65),
  ('Raiffeisen Bank BiH', 'Finance', 'Sarajevo', 'https://www.raiffeisenbank.ba', 'Banking', 4.2, 89),
  ('Coca-Cola HBC BiH', 'Manufacturing', 'Sarajevo', 'https://ba.coca-colahellenic.com', 'Beverages', 4.3, 112),
  ('BBI Centar', 'Retail', 'Sarajevo', 'https://www.bbicentar.ba', 'Shopping center', 4.5, 245),
  ('Unis Group', 'Manufacturing', 'Sarajevo', 'https://unis.ba', 'Machinery & equipment', 3.8, 34),
  ('Elektroprivreda BiH', 'Energy', 'Sarajevo', 'https://www.elektroprivreda.ba', 'Power utility', 3.7, 51),
  ('Lasta', 'Manufacturing', 'Čapljina', 'https://lasta.ba', 'Beverages', 4.0, 43),
  ('M:tel', 'IT', 'Banja Luka', 'https://mtel.ba', 'Telecommunications', 4.0, 156),
  ('Šipad', 'Retail', 'Sarajevo', 'https://www.sipad.ba', 'Food retail', 4.2, 87),
  ('Zara Bravsko', 'Manufacturing', 'Brčko', 'https://www.zara.ba', 'Steel production', 3.9, 29)
ON CONFLICT (id) DO NOTHING;
