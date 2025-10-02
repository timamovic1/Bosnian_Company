import { motion } from 'framer-motion';
import { ExternalLink, MapPin, Briefcase } from 'lucide-react';
import RatingStars from './RatingStars';

function CompanyCard({ company, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="glass-card p-6 hover:shadow-2xl hover:border-bosnia-yellow/30 cursor-pointer group"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-white group-hover:text-bosnia-yellow transition-colors">
            {company.name}
          </h3>
          <motion.a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-bosnia-yellow focus-ring p-1 rounded"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Visit ${company.name} website`}
          >
            <ExternalLink className="w-5 h-5" />
          </motion.a>
        </div>

        <p className="text-slate-300 text-sm mb-4 flex-grow leading-relaxed">
          {company.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Briefcase className="w-4 h-4 text-bosnia-yellow" />
            <span className="font-medium">{company.sector}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-400">
            <MapPin className="w-4 h-4 text-bosnia-yellow" />
            <span>{company.city}</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <RatingStars rating={company.ratingAvg} />
            <span className="text-xs text-slate-400">
              {company.reviewsCount} reviews
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default CompanyCard;
