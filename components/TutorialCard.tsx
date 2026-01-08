
import React from 'react';
import { Tutorial } from '../types';
import { motion } from 'framer-motion';

interface TutorialCardProps {
  tutorial: Tutorial;
  onClick: (id: string) => void;
}

const TutorialCard: React.FC<TutorialCardProps> = ({ tutorial, onClick }) => {
  return (
    <motion.div 
      onClick={() => onClick(tutorial.id)}
      className="group cursor-pointer space-y-4"
      whileHover={{ y: -5 }}
    >
      <div className="aspect-[16/9] overflow-hidden rounded-2xl bg-gray-100 border border-transparent dark:border-white/5 relative">
        <motion.img 
          src={tutorial.image} 
          alt={tutorial.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-gray-400 font-bold tracking-widest">{tutorial.date.toUpperCase()}</span>
          <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-white/5 text-[10px] text-gray-500 dark:text-gray-400 font-bold tracking-widest uppercase">
            {tutorial.category}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-500 transition-colors leading-tight">
          {tutorial.title}
        </h3>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
          {tutorial.description}
        </p>
      </div>
    </motion.div>
  );
};

export default TutorialCard;
