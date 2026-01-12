import React, { useState } from "react";
import { SIDEBAR_STRUCTURE } from "../constants";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";

interface LayoutProps {
  children: React.ReactNode;
  activeId: string;
  onSelect: (id: string) => void;
  onToggleTheme: () => void;
  isDark: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  activeId,
  onSelect,
  onToggleTheme,
  isDark,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({});

  const contentRef = React.useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  // ResizeObserver to track content height
  React.useEffect(() => {
    if (!contentRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContentHeight(entry.contentRect.height);
      }
    });
    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, []);

  const { scrollY } = useScroll();
  const [windowHeight, setWindowHeight] = useState(0);

  React.useEffect(() => {
    setWindowHeight(window.innerHeight);
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const y = useTransform(scrollY, (value) => {
    if (!contentHeight || !windowHeight) return 0;
    // contentHeight is height of the main scrollable area (header + body)
    // When scrollY reaches (contentHeight - windowHeight), the bottom of content matches bottom of screen
    // As we scroll past valid content, we want sidebar to move up
    const scrollLimit = contentHeight - windowHeight;
    if (value > scrollLimit) {
      return -(value - scrollLimit);
    }
    return 0;
  });

  const toggleSection = (title: string) => {
    setCollapsedSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <div
      className={`transition-colors duration-300 ${isDark ? "dark bg-[#0a0a0a]" : "bg-[#fcfcfc]"
        }`}
    >
      <style>
        {`
        .sidebar-scroll::-webkit-scrollbar {
          width: 3px;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.05);
          border-radius: 10px;
        }
        .dark .sidebar-scroll::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.05);
        }
        .sidebar-scroll:hover::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.1);
        }
        .dark .sidebar-scroll:hover::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
        }

        /* The mask that clips everything on top to reveal the footer behind */
        .sticky-reveal-mask {
          position: relative;
          overflow: hidden;
          z-index: 20;
          clip-path: polygon(0% 0, 100% 0, 100% 100%, 0 100%);
          background: inherit;
        }
      `}
      </style>

      {/* Sidebar - Desktop (Outside the mask so it can be fixed properly) */}
      <motion.aside
        style={{ y }}
        className={`hidden lg:flex flex-col w-72 border-r h-screen fixed top-0 left-0 transition-colors duration-300 z-40 ${isDark ? "bg-[#0e0e0e] border-white/5" : "bg-white border-gray-100"
          }`}
      >
        <div className="px-8 pt-10 pb-6 shrink-0">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 via-red-500 to-indigo-600 shadow-lg cursor-pointer"
            onClick={() => onSelect("home")}
          />
        </div>

        <nav className="flex-1 px-8 pb-10 overflow-y-auto sidebar-scroll space-y-8">
          {SIDEBAR_STRUCTURE.map((section) => (
            <div key={section.title}>
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 flex items-center justify-between hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {section.title}
                <motion.svg
                  animate={{
                    rotate: collapsedSections[section.title] ? -90 : 0,
                  }}
                  className="w-3 h-3 opacity-50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M19 9l-7 7-7-7"
                  />
                </motion.svg>
              </button>

              <AnimatePresence initial={false}>
                {!collapsedSections[section.title] && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                      transition: {
                        height: { duration: 0.3, ease: [0.87, 0, 0.13, 1] },
                        opacity: { duration: 0.25, delay: 0.1 }
                      }
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                      transition: {
                        height: { duration: 0.3, ease: [0.87, 0, 0.13, 1] },
                        opacity: { duration: 0.15 }
                      }
                    }}
                    className="space-y-1.5 overflow-hidden"
                  >
                    {section.items.map((item, index) => (
                      <motion.li
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{
                          delay: index * 0.05,
                          duration: 0.2
                        }}
                      >
                        <button
                          onClick={() => onSelect(item.id)}
                          className={`text-[13px] group flex items-center justify-between w-full text-left duration-200 py-1.5 px-3 rounded-lg ${activeId === item.id
                            ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/10 font-medium"
                            : isDark
                              ? "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                              : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                        >
                          <span>{item.name}</span>
                        </button>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>
      </motion.aside>

      {/* Main content Wrapper (Moves over the footer) */}
      <div
        ref={contentRef}
        className={`sticky-reveal-mask flex flex-col min-h-screen lg:ml-72 transition-colors duration-300 ${isDark ? "bg-[#0a0a0a]" : "bg-[#fcfcfc]"
          }`}
      >
        <header
          className={`flex items-center fixed w-full lg:-translate-x-72 justify-between lg:justify-end px-6 lg:px-12 py-6 border-b lg:border-none z-30 transition-colors duration-300 shrink-0 ${isDark ? "bg-[#0a0a0a] border-white/5" : "bg-white border-gray-50"
            }`}
        >
          <div
            className="lg:hidden w-8 h-8 rounded-full bg-gradient-to-tr from-orange-400 via-red-500 to-indigo-600"
            onClick={() => onSelect("home")}
          />

          <div className="flex items-center gap-6">
            <button
              onClick={() => onSelect("about")}
              className={`text-xs font-bold uppercase tracking-widest transition-colors ${isDark
                ? "text-gray-400 hover:text-white"
                : "text-gray-500 hover:text-gray-900"
                }`}
            >
              About
            </button>
            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-xl border transition-all ${isDark
                ? "bg-white/5 border-white/10 text-white hover:bg-white/10"
                : "bg-white border-gray-100 text-gray-700 hover:bg-gray-50"
                }`}
            >
              {isDark
                ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                )
                : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden w-10 h-10 flex items-center justify-center rounded-xl border shadow-sm hover:shadow-md transition-all active:scale-95 ${isDark
                ? "bg-white/5 border-white/10 text-white"
                : "bg-white border-gray-100 text-gray-700"
                }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </header>

        <main className="pb-32 max-w-6xl w-full mx-auto flex-1 mt-20">
          {children}
        </main>
      </div>

      {/* Global Sticky Footer (Sits behind everything else) */}
      <footer
        className={`md:h-[600px] sticky bottom-0 z-10 pt-8 transition-colors duration-300 flex flex-col justify-end ${isDark ? "bg-[#0f0f0f]" : "bg-[#f4f4f7]"
          }`}
      >
        <div className="max-w-7xl mx-auto w-full px-6 lg:px-16 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
            {/* Subscription Section */}
            <div className="space-y-8 max-w-md">
              <h2
                className={`text-3xl font-bold tracking-tight leading-[1.2] ${isDark ? "text-white" : "text-[#2d3139]"
                  }`}
              >
                Subscribe to the newsletters to stay in touch with the latest.
              </h2>
              <div className="space-y-4">
                <div
                  className={`relative flex items-center rounded-2xl border p-1 transition-all focus-within:ring-2 focus-within:ring-indigo-500/20 ${isDark
                    ? "bg-white/5 border-white/10"
                    : "bg-[#eff3f8] border-[#e1e6ef]"
                    }`}
                >
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    className={`flex-1 bg-transparent px-5 py-3.5 text-sm font-medium outline-none ${isDark
                      ? "placeholder-gray-600 text-white"
                      : "placeholder-[#a1a8b3] text-[#2d3139]"
                      }`}
                  />
                  <div className="pr-1.5">
                    <div className="w-10 h-10 rounded-full bg-[#34d399]/10 flex items-center justify-center text-[#34d399] cursor-pointer hover:bg-[#34d399]/20 transition-colors">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          d="M5 12h14M12 5l7 7-7 7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <button className="w-full py-4 bg-[#e8edff] dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-[11px] uppercase tracking-[0.2em] rounded-2xl hover:bg-[#dee5ff] dark:hover:bg-indigo-500/20 transition-all active:scale-[0.98]">
                  SUBSCRIBE
                </button>
              </div>
            </div>

            {/* Navigation Links Column */}
            <div className="flex lg:justify-end items-start gap-16 lg:gap-24">
              <div className="space-y-4">
                <ul
                  className={`space-y-4 text-[14px] font-semibold ${isDark ? "text-gray-400" : "text-[#4b5563]"
                    }`}
                >
                  <li
                    className="hover:text-indigo-500 cursor-pointer transition-colors"
                    onClick={() => onSelect("home")}
                  >
                    Tutorials
                  </li>
                  <li
                    className="hover:text-indigo-500 cursor-pointer transition-colors"
                    onClick={() => onSelect("gallery")}
                  >
                    Demos
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div
            className={`flex flex-col md:flex-row justify-end items-start md:items-center gap-8 pt-8 border-t ${isDark ? "border-white/10" : "border-[#6b7280]/20"
              }`}
          >
            <div className="flex flex-col md:flex-row md:items-center gap-1.5 md:gap-8">
              <div
                className={`flex items-center gap-1.5 text-[11px] font-medium ${isDark ? "text-gray-500" : "text-[#6b7280]"
                  }`}
              >
                <span>Design system inspired by</span>
                <a
                  href="https://maximeheckel.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-500 hover:underline"
                >
                  Maxime Heckel
                </a>
              </div>
              <div
                className={`text-[11px] font-medium ${isDark ? "text-gray-500" : "text-[#6b7280]"
                  }`}
              >
                Copyright 2025 © Alberto Campagnolo
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`w-80 h-full shadow-2xl flex flex-col p-8 ${isDark ? "bg-[#111] text-white" : "bg-white text-gray-900"
                }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-12 shrink-0">
                <span className="text-sm font-bold tracking-tighter uppercase text-gray-400">
                  Menu
                </span>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto sidebar-scroll pr-2 space-y-8">
                <button
                  onClick={onToggleTheme}
                  className="flex items-center gap-4 text-inherit font-medium hover:text-indigo-500 transition-colors w-full text-left"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  Toggle Theme
                </button>
                <div
                  className={`h-px ${isDark ? "bg-white/10" : "bg-gray-100"}`}
                />

                {SIDEBAR_STRUCTURE.map((section) => (
                  <div key={section.title}>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                      {section.title}
                    </p>
                    <ul className="space-y-4">
                      {section.items.map((item) => (
                        <li key={item.id}>
                          <button
                            onClick={() => {
                              onSelect(item.id);
                              setIsMobileMenuOpen(false);
                            }}
                            className={`text-lg font-medium transition-colors ${activeId === item.id
                              ? "text-indigo-500"
                              : "hover:text-indigo-500"
                              }`}

                          >
                            {item.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>);
};

export default Layout;
