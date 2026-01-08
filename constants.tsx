
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
      description: "Let's start the project by creating a Next.js application. We can do that by running:",
      command: "npx create-next-app@latest client"
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
      description: "Let's start by installing the necessary dependencies:",
      command: "npm install three @react-three/fiber @react-three/drei framer-motion"
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
      description: "We will use Framer Motion for the parallax effect.",
      command: "npm install framer-motion"
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
      description: "No external libraries needed, just React.",
      command: "npx create-next-app@latest cursor-app"
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
  }
];
