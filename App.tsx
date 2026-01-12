import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import TutorialCard from "@/components/TutorialCard";
import ArticleView from "@/components/ArticleView";
import Gallery from "@/components/Gallery";
import { MOCK_TUTORIALS } from "./constants";
import { Tutorial } from "./types";
import { AnimatePresence, motion } from "framer-motion";

const App: React.FC = () => {
  const [activeId, setActiveId] = useState<string>("home");
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(
    null,
  );
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const handleSelect = (id: string) => {
    setActiveId(id);
    if (id === "home" || id === "about" || id === "404") {
      setSelectedTutorial(null);
      return;
    }
    const tutorial = MOCK_TUTORIALS.find((t) => t.id === id);
    if (tutorial) {
      setSelectedTutorial(tutorial);
    } else {
      setSelectedTutorial(null);
    }
  };

  const handleTutorialClick = (id: string) => {
    const tutorial = MOCK_TUTORIALS.find((t) => t.id === id);
    if (tutorial) {
      setSelectedTutorial(tutorial);
      setActiveId(id);
    }
  };

  const renderContent = () => {
    if (activeId === "about") {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-12 max-w-3xl"
        >
          <h1 className="text-6xl font-bold mb-12 tracking-tight">About Me</h1>
          <div className="space-y-6 text-xl leading-relaxed">
            <p className="text-gray-700 dark:text-gray-500">
              I'm a designer and developer obsessed with the intersection of
              aesthetics and motion. Inspired by the works of Olivier Larose, I
              build high-performance web animations that feel natural and
              intuitive.
            </p>
            <p className="text-gray-700 dark:text-gray-500">
              This blog is my personal playground—a repository of UI patterns,
              shaders, and complex scroll interactions designed to push the
              boundaries of modern front-end development.
            </p>
          </div>
        </motion.div>
      );
    }

    if (activeId === "404") {
      return (
        <motion.div
          className="flex flex-col items-center justify-center pt-32 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="relative flex items-center justify-center">
            <motion.h1
              className="text-[12rem] font-black leading-none tracking-tighter text-gray-200 dark:text-white/5 select-none"
              animate={{ scale: [1, 1.05, 1], rotate: [0, 1, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              404
            </motion.h1>
            <motion.div className="absolute w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />
          </div>
          <button
            onClick={() => handleSelect("home")}
            className="mt-8 text-sm font-bold tracking-widest uppercase hover:text-indigo-600 transition-colors"
          >
            Go Home
          </button>
        </motion.div>
      );
    }

    if (activeId === "gallery") {
      return (
        <Gallery
          tutorials={MOCK_TUTORIALS}
          onTutorialClick={handleTutorialClick}
        />
      );
    }

    if (!selectedTutorial) {
      return (
        <div className="pt-12 px-2 md:px-0">
          <header className="mb-24">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className={`text-5xl md:text-7xl font-bold tracking-tight mb-8 max-w-4xl leading-[1.1] ${isDark ? "text-white" : "text-gray-900"
                }`}
            >
              Building fluid web experiences{" "}
              <motion.span
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block w-8 h-8 rounded-full bg-gradient-to-tr from-orange-400 via-red-500 to-indigo-600 align-middle -mt-1"
              />{" "}
              <br className="block md:hidden" />
              through motion.
            </motion.h1>
          </header>

          <section>
            <div className="flex items-center justify-between mb-12">
              <h2
                className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"
                  }`}
              >
                Selected Work
              </h2>
              <div className="h-px flex-1 mx-8 bg-current opacity-30" />
            </div>

            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16"
            >
              {[
                "3d-cube-ascii",
              ].map((tutorial, i) => (
                <motion.div
                  key={tutorial}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                >
                  <TutorialCard
                    tutorial={MOCK_TUTORIALS.find((t) => t.id === tutorial)!}
                    onClick={handleTutorialClick}
                  />
                </motion.div>
              ))}
            </motion.div>
          </section>
        </div>
      );
    }

    return (
      <div className="pt-12">
        <ArticleView
          tutorial={selectedTutorial}
          onBack={() => {
            setSelectedTutorial(null);
            setActiveId("home");
          }}
          onSelectTutorial={handleTutorialClick}
        />
      </div>
    );
  };

  return (
    <Layout
      activeId={activeId}
      onSelect={handleSelect}
      onToggleTheme={() => setIsDark(!isDark)}
      isDark={isDark}
    >
      <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
        <motion.div
          key={activeId + (selectedTutorial?.id || "")}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
};

export default App;
