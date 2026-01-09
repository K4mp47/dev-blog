
import { Tutorial, SidebarItem } from './types';

export const SIDEBAR_STRUCTURE: SidebarItem[] = [
  {
    title: 'Getting Started',
    items: [
      { name: 'Introduction', id: 'intro' },
      { name: 'Gallery', id: 'gallery' },
      { name: 'Web Animation Course', id: 'course' },
    ]
  },
  // {
  //   title: 'Article',
  //   items: [
  //   ]
  // },
  {
    title: 'Scroll',
    items: [
      { name: 'Background Image Parallax', id: 'bg-parallax' },
      { name: 'Impile Card Scrolling Animation', id: 'impile-card-scroll' },
    ]
  },
  {
    title: 'Mouse',
    items: [
      { name: 'Mouse Image Distortion', id: 'mouse-distortion' },
      { name: 'Fluid Cursor Animation', id: 'fluid-cursor', locked: true },
    ]
  }
];

export const MOCK_TUTORIALS: Tutorial[] = [
  {
    id: 'mask-section',
    title: 'Mask Section Transition',
    description: 'A website tutorial featuring a scroll animation using an SVG Mask to create a section transition, made with React and Framer Motion.',
    date: 'June 2, 2024',
    category: 'SCROLL',
    image: 'https://picsum.photos/seed/mask/800/450',
    difficulty: 'Intermediate',
    duration: 'Short',
    intro: {
      content: "A website animation featuring a mask section transition, made with Framer Motion and React inside a modern setup. This effect adds a nice layer of depth to your pages without sacrificing performance."
    },
    setup: {
      items: [
        { type: 'text', content: "Let's start the project by creating a Next.js application. We can do that by running:" },
        { type: 'command', content: "npx create-next-app@latest client" }
      ]
    },
    implementation: {
        description: "The logic is built on these key principles:",
        principles: ["Define scroll bounds", "Map scroll progress to animations", "Optimize with CSS properties"],
        files: [
             {
                name: "components/Mask.jsx",
                language: "jsx",
                code: `import { motion } from 'framer-motion';
import { useState } from 'react';

export default function MaskSection() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      className="relative w-full h-screen overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mask-container">
        {/* Content goes here */}
      </div>
    </motion.div>
  )
}`
             }
        ]
    },
    conclusion: {
        content: "That's it for this animation! A super clean animation that adds a nice dimensionality to your UI.",
        author: "Alberto"
    }
  },
  {
    id: 'mouse-distortion',
    title: 'Mouse Image Distortion',
    description: 'A website animation featuring an image distortion in a curved, using the sin function, React Three Fiber and Framer Motion.',
    date: 'June 2, 2024',
    category: 'MOUSE',
    image: 'https://picsum.photos/seed/distort/800/450',
    difficulty: 'Advanced',
    duration: 'Medium',
    intro: {
      content: "A website animation featuring an image distortion in a curved, using the sin function, React Three Fiber and Framer Motion."
    },
    setup: {
      items: [
        { type: 'text', content: "Let's start by installing the necessary dependencies:" },
        { type: 'command', content: "npm install three @react-three/fiber @react-three/drei framer-motion" }
      ]
    },
    implementation: {
        description: "The logic is built on these key principles:",
        principles: ["Create a shader material", "Pass mouse coordinates as uniforms", "Animate vertex positions based on distance"],
        files: [
             {
                name: "components/Distortion.jsx",
                language: "jsx",
                code: `import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

function DistortionMesh() {
  const mesh = useRef();
  
  useFrame((state) => {
    // Animation logic
  });
  
  return (
    <mesh ref={mesh}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial />
    </mesh>
  );
}`
             }
        ]
    },
    conclusion: {
        content: "This technique can be extended to create liquid-like effects and other organic interactions.",
        author: "Alberto"
    }
  },
  {
    id: 'bg-parallax',
    title: 'Background Image Parallax',
    description: 'A website animation featuring a background image moving on scroll in a parallax motion, inspired by luxury brand aesthetics.',
    date: 'May 25, 2024',
    category: 'SCROLL',
    image: 'https://picsum.photos/seed/parallax/800/450',
    difficulty: 'Beginner',
    duration: 'Short',
    intro: {
      content: "A website animation featuring a background image moving on scroll in a parallax motion, inspired by luxury brand aesthetics."
    },
    setup: {
      items: [
        { type: 'text', content: "We will use Framer Motion for the parallax effect." },
        { type: 'command', content: "npm install framer-motion" }
      ]
    },
    implementation: {
        description: "The logic is built on these key principles:",
        principles: ["Track scroll position", "Transform Y position of image", "Use overflow hidden on container"],
        files: [
             {
                name: "components/Parallax.jsx",
                language: "jsx",
                code: `import { useScroll, useTransform, motion } from 'framer-motion';

export default function ParallaxImage() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  
  return (
    <div className="overflow-hidden h-96">
      <motion.img style={{ y }} src="/bg.jpg" />
    </div>
  )
}`
             }
        ]
    },
    conclusion: {
        content: "Parallax is a classic effect that adds instant polish when done subtely.",
        author: "Alberto"
    }
  },
  {
    id: 'fluid-cursor',
    title: 'Fluid Cursor Animation',
    description: 'Learn how to create a fluid organic cursor animation using HTML Canvas and basic physics.',
    date: 'July 10, 2024',
    category: 'MOUSE',
    image: 'https://picsum.photos/seed/cursor/800/450',
    difficulty: 'Advanced',
    duration: 'Long',
    intro: {
      content: "Learn how to create a fluid organic cursor animation using HTML Canvas and basic physics."
    },
    setup: {
      items: [
        { type: 'text', content: "No external libraries needed, just React." },
        { type: 'command', content: "npx create-next-app@latest cursor-app" }
      ]
    },
    implementation: {
        description: "The logic is built on these key principles:",
        principles: ["Canvas API for drawing", "Physics simulation for movement", "RequestAnimationFrame for smooth loop"],
        files: [
             {
                name: "components/FluidCursor.jsx",
                language: "jsx",
                code: `import React, { useEffect, useRef } from 'react';

export default function FluidCursor() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Canvas setup and animation loop
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" />;
}`
             }
        ]
    },
    conclusion: {
        content: "Canvas opens up endless possibilities for high-performance visual effects.",
        author: "Alberto"
    }
  },
  {
    id: 'impile-card-scroll',
    title: 'Impile Card Scrolling Animation',
    description: 'How to make a Impile Card Scrolling Animation using tailwindcss and React.',
    date: 'January 9, 2026',
    category: 'SCROLL',
    image: '/image.png',
    difficulty: 'Intermediate',
    duration: 'Medium',
    intro: {
      content: "In this tutorial, we'll learn how to create an engaging stacking card scroll animation using React, Tailwind CSS, and Framer Motion."
    },
    setup: {
      items: [
        { type: 'text', content: "To set up a new Next.js project, you can use the following command:" },
        { type: 'command', content: "npx create-next-app@latest" },
        { type: 'text', content: "After that, install the required dependencies:" },
        { type: 'command', content: "npm install framer-motion" },
        { type: 'text', content: "Now you are ready to start" }
      ]
    },
    implementation: {
        description: "Start creating a new component called `Card.tsx` inside the `components` folder. The logic is built on these key principles:",
        principles: ["Sticky positioning for stacking effect", "Scroll progress mapping to scale", "Dynamic z-index handling"],
        files: [
             {
                name: "components/Card.tsx",
                language: "tsx",
                code: `"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Card({
  src,
  bg,
  i = 0,
}: {
  src: string;
  bg: string;
  i?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "center"],
  });

  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    [0.85, 1]
  );

  const y = useTransform(scrollYProgress, [0, 1], [0, i * 60]);

  // const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <motion.div
      ref={ref}
      style={{
        scale,
        // opacity,
        y,
        zIndex: 10 + i,
        position: "sticky",
        top: 0,
      }}
      className={\`w-full min-h-screen flex items-center justify-center \${bg}\`}
    >
      <h1 className="text-white font-bold text-[12rem]">{src}</h1>
    </motion.div>
  );
}`
             },
             {
                name: "app/page.tsx",
                language: "tsx",
                code: `"use client";

import Card from "@/components/Card";

export default function Home() {
  return (
    <main className="w-full bg-white dark:bg-black">
      <section className="h-screen" />

      {/* STACK SECTION */}
      <section className="relative h-[300vh] w-full flex flex-col items-center">
        {[0,1,2].map((i) => (
          <Card
            key={i}
            src={i.toString()}
            i={i}
            bg={i % 2 === 0 ? "bg-purple-600" : "bg-pink-600"}
          />
        ))}
      </section>
      <section className="relative z-20 h-screen bg-transparent" />
    </main>
  );
}`
             }
        ]
    },
    conclusion: {
        content: "That's it for this animation! A super clean animation that adds a nice dimensionality to your UI. But be careful, it's not optimized for mobile yet!",
        author: "Alberto"
    }
  }
];
