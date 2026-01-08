
import React, { useState, useEffect, useRef } from 'react';
import { Tutorial } from '../types';
import { motion } from 'framer-motion';
import { MOCK_TUTORIALS } from '../constants';
import Prism from 'prismjs';
// Prism languages
import 'https://esm.sh/prismjs@1.29.0/components/prism-javascript';
import 'https://esm.sh/prismjs@1.29.0/components/prism-typescript';
import 'https://esm.sh/prismjs@1.29.0/components/prism-jsx';
import 'https://esm.sh/prismjs@1.29.0/components/prism-tsx';
import 'https://esm.sh/prismjs@1.29.0/components/prism-css';

interface ArticleViewProps {
  tutorial: Tutorial;
  onBack: () => void;
}

const CodeBlock = ({ fileName, code, language = 'javascript' }: { fileName: string, code: string, language?: string }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0d0d0d] rounded-xl mb-8 shadow-2xl border border-white/5 overflow-hidden group">
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-[#141414]">
        <span className="text-[11px] text-gray-400 font-mono font-medium">{fileName}</span>
        <button
          onClick={copyToClipboard}
          className="text-[10px] font-bold tracking-widest uppercase text-gray-500 hover:text-white transition-colors flex items-center gap-2"
        >
          {copied ? 'Copied!' : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
          )}
        </button>
      </div>
      <div className="p-6 overflow-x-auto flex bg-[#0d0d0d]">
        <div className="pr-4 border-r border-white/5 text-right select-none">
          {code.split('\n').map((_, i) => (
            <div key={i} className="text-[11px] font-mono text-gray-700 leading-6">{i + 1}</div>
          ))}
        </div>
        <div className="pl-4 overflow-hidden w-full">
          <pre className={`language-${language}`}>
            <code className={`language-${language}`}>
              {code.trim()}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};

const TableOfContents = ({ sections }: { sections: { id: string, title: string }[] }) => {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-100px 0px -70% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -120;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="hidden 2xl:block fixed right-10 top-32 w-64 z-10 pointer-events-auto">
      <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6 border-l-2 border-indigo-500/20 pl-4">Table of Contents</h4>
      <ul className="space-y-4 border-l-2 border-gray-100 dark:border-white/5">
        {sections.map((section) => (
          <li key={section.id}>
            <button
              onClick={() => scrollTo(section.id)}
              className={`text-[13px] text-left transition-all duration-300 pl-4 -ml-[2px] block w-full border-l-2 ${activeSection === section.id
                ? 'text-indigo-500 font-semibold border-indigo-500'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 border-transparent hover:border-gray-300 dark:hover:border-white/20'
                }`}
            >
              {section.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ArticleView: React.FC<ArticleViewProps> = ({ tutorial, onBack }) => {
  const sections = [
    { id: 'intro', title: 'Introduction' },
    { id: 'setup', title: 'Creating the Project' },
    { id: 'implementation', title: 'Implementation Logic' },
    { id: 'wrapping-up', title: 'Wrapping Up' }
  ];

  const files = [
    {
      name: 'components/Footer.jsx',
      language: 'jsx',
      code: `import React from 'react';

export default function Footer() {
  return (
    <div 
      className='relative h-[800px]'
      style={{clipPath: "polygon(0% 0, 100% 0, 100% 100%, 0 100%)"}}
    >
      <div className='fixed bottom-0 h-[800px] w-full'>
        <Content />
      </div>
    </div>
  )
}

function Content() {
  return (
    <div className='bg-[#1a1a1a] py-20 px-10 h-full w-full flex flex-col justify-between'>
        <h2 className='text-[10vw] text-white leading-[0.8] uppercase font-bold'>
            Sticky Footer
        </h2>
        <div className='flex justify-between items-end text-white'>
            <p>© 2026 Alberto Campagnolo</p>
            <p>Built with React & CSS</p>
        </div>
    </div>
  )
}`
    },
    {
      name: 'components/Container.jsx',
      language: 'jsx',
      code: `import React from 'react';

export default function Footer() {
  return (
    <div className='relative h-[800px]'>
      <div className='fixed bottom-0 h-[800px] w-full'>
        {children}
      </div>
    </div>
  )
}`
    }

  ];

  return (
    <div className="relative">
      <TableOfContents sections={sections} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-3xl mx-auto xl:ml-0"
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-indigo-500 transition-colors mb-8 text-[13px] font-medium group"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Tutorials
        </button>

        <header className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-500 to-blue-600" onClick={() => { }} />
            <div>
              <h4 className="text-[17px] font-semibold text-gray-900 text-[#0a0a0a]">Alberto Campagnolo</h4>
              <div className="flex items-center gap-2 text-[13px] text-gray-500 mt-1">
                <span>{tutorial.date}</span>
                <span className="opacity-30">/</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                  <span>{tutorial.difficulty}</span>
                </div>
                <span className="opacity-30">/</span>
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                  <span>{tutorial.duration}</span>
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-[52px] font-bold text-[#0a0a0a] mb-4 tracking-tight leading-[1.05]">
            {tutorial.title}
          </h1>
          <p className="text-[17px] text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
            How to make a {tutorial.title} using Framer Motion and React
          </p>
        </header>

        <section id="intro" className="mb-20 scroll-mt-24">
          <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 dark:bg-white/5 mb-16 border border-gray-100 dark:border-white/10 shadow-lg">
            <img src={tutorial.image} className="w-full h-full object-cover" alt="Hero" />
          </div>
          <h2 className="text-[28px] font-bold mb-6 text-gray-900">Introduction</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-[1.7] text-[16px] mb-6">
            A website animation featuring {tutorial.title.toLowerCase()}, made with Framer Motion and React inside a modern setup.
            This effect adds a nice layer of depth to your pages without sacrificing performance.
          </p>
        </section>

        <section id="setup" className="mb-20 scroll-mt-24">
          <h2 className="text-[28px] font-bold mb-6 text-gray-900">Creating the Project</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-[1.7] text-[16px]">
            Let's start the project by creating a Next.js application. We can do that by running:
          </p>
          <div className="p-4 rounded-lg bg-[#0d0d0d] font-mono text-[13px] text-gray-600 dark:text-gray-300 mb-10 border border-gray-200 dark:border-white/5">
            npx create-next-app@latest client
          </div>
        </section>

        <section id="implementation" className="mb-20 scroll-mt-24">
          <h2 className="text-[28px] font-bold mb-6 text-gray-900">Implementation Logic</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-[1.7] text-[16px]">
            The logic is built on these key principles:
          </p>

          <ul className="space-y-4 mb-10">
            {['Define scroll bounds', 'Map scroll progress to animations', 'Optimize with CSS properties'].map((item, i) => (
              <li key={i} className="flex gap-4 items-start text-[15px] text-indigo-600 dark:text-indigo-400 font-medium">
                <span className="mt-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </span>
                <span className="text-gray-600 dark:text-gray-400 font-normal">{item}</span>
              </li>
            ))}
          </ul>

          <div className="space-y-4">
            {files.map(file => (
              <CodeBlock key={file.name} fileName={file.name} code={file.code} language={file.language} />
            ))}
          </div>
        </section>

        <section id="wrapping-up" className="mb-32 scroll-mt-24">
          <h2 className="text-[28px] font-bold mb-6 text-gray-900">Wrapping Up</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-[1.7] text-[16px] mb-12">
            That's it for this animation! A super clean animation that adds a nice dimensionality to your UI.
          </p>
          <div className="text-gray-400 font-medium">— Oli</div>
        </section>

        <footer className="border-t border-gray-100 dark:border-white/5 pt-20">
          <h3 className="text-[22px] font-bold mb-10 text-gray-900">Related Animations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            {MOCK_TUTORIALS.slice(0, 2).map(t => (
              <div key={t.id} className="cursor-pointer group flex flex-col gap-4">
                <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-gray-100 dark:bg-white/5 border border-transparent dark:border-white/5 transition-all group-hover:shadow-xl">
                  <img src={t.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={t.title} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.date}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{t.category}</span>
                  </div>
                  <h4 className="font-bold text-[#0a0a0a] text-[17px] group-hover:text-indigo-500 transition-colors">{t.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </footer>
      </motion.div>
    </div>
  );
};

export default ArticleView;
