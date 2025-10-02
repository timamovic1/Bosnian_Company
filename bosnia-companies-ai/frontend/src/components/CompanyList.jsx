import { motion, AnimatePresence } from 'framer-motion';
import CompanyCard from './CompanyCard';

function CompanyList({ result, isLoading }) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="glass-card p-6 h-32"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        ))}
      </div>
    );
  }

  if (!result) {
    return null;
  }

  if (result.type === 'text') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-slate-200 text-lg leading-relaxed"
        >
          {result.text.split('').map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.01 }}
            >
              {char}
            </motion.span>
          ))}
        </motion.p>
      </motion.div>
    );
  }

  if (result.type === 'company') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <h2 className="text-3xl font-bold text-bosnia-yellow mb-4">
          {result.company.name}
        </h2>
        <div className="glass-card p-8">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-slate-200 text-lg leading-relaxed mb-6"
          >
            {result.summary.split('').map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.01 }}
              >
                {char}
              </motion.span>
            ))}
          </motion.p>
          <CompanyCard company={result.company} index={0} />
        </div>
      </motion.div>
    );
  }

  if (result.type === 'list') {
    return (
      <div className="space-y-6">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold text-bosnia-yellow"
        >
          {result.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-slate-300"
        >
          Found {result.items.length} {result.items.length === 1 ? 'company' : 'companies'}
        </motion.p>
        <AnimatePresence mode="wait">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {result.items.map((company, index) => (
              <CompanyCard key={company.id} company={company} index={index} />
            ))}
          </div>
        </AnimatePresence>
      </div>
    );
  }

  return null;
}

export default CompanyList;
