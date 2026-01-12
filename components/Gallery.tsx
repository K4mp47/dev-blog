import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tutorial } from "../types";
import TutorialCard from "./TutorialCard";

interface GalleryProps {
  tutorials: Tutorial[];
  onTutorialClick: (id: string) => void;
}

const Gallery: React.FC<GalleryProps> = ({ tutorials, onTutorialClick }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(tutorials.map((t) => t.category))
    );
    return ["All", ...uniqueCategories];
  }, [tutorials]);

  const filteredTutorials = useMemo(() => {
    if (selectedCategory === "All") return tutorials;
    return tutorials.filter((t) => t.category === selectedCategory);
  }, [tutorials, selectedCategory]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col space-y-8">
        {/* Header Section */}
        <div className="flex flex-col space-y-4">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-black">
            Animation Gallery
          </h1>
          <p className="text-gray-500 dark:text-gray-500 max-w-2xl">
            Explore our collection of animations and effects. Filter by category
            to find exactly what you're looking for.
          </p>
        </div>

        {/* Filter Navbar */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              id="filter-btn"
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${selectedCategory === category
                // text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/10 font-medium
                ? "bg-indigo-500/10 !text-indigo-400 hover:!text-indigo-400"
                : "bg-transparent text-gray-900 hover:bg-gray-200"
                }`}
            >
              {category === "All" ? "All Effects" : category}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredTutorials.map((tutorial) => (
              <motion.div
                layout
                key={tutorial.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <TutorialCard tutorial={tutorial} onClick={onTutorialClick} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredTutorials.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400">
              No tutorials found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
