import { useState } from 'react';
import { motion } from 'framer-motion';
import ChatBox from './components/ChatBox';
import CompanyList from './components/CompanyList';
import { Building2 } from 'lucide-react';

function App() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = async (userInput) => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://localhost:3001/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setResult({
        type: 'text',
        text: 'Failed to connect to the server. Please ensure the backend is running on port 3001.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen py-12 px-4"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Building2 className="w-12 h-12 text-bosnia-yellow" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-bosnia-yellow to-yellow-300 bg-clip-text text-transparent">
              Bosnia Companies AI
            </h1>
          </div>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Explore Bosnian companies by city, sector, and rating with intelligent AI-powered search
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-12"
        >
          <ChatBox onAsk={handleAsk} isLoading={isLoading} />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <CompanyList result={result} isLoading={isLoading} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="glass-card p-6 inline-block">
            <h3 className="text-lg font-semibold mb-3 text-bosnia-yellow">Try asking:</h3>
            <div className="text-sm text-slate-300 space-y-2">
              <p>"Companies in Sarajevo"</p>
              <p>"IT companies with 4+ stars"</p>
              <p>"How is BH Telecom?"</p>
              <p>"Retail companies in Tuzla"</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default App;
