
import { Tutorial, SidebarItem } from './types';

export const SIDEBAR_STRUCTURE: SidebarItem[] = [
  {
    title: 'Getting Started',
    items: [
      { name: 'Introduction', id: 'intro' },
      { name: 'Gallery', id: 'gallery' },
    ]
  },
  {
    title: 'Scroll',
    items: [
      { name: 'Stack Card Scrolling Animation', id: 'stack-card-scroll' },
    ]
  },
  {
    title: '3D',
    items: [
      { name: '3D Cube Ascii Animation', id: '3d-cube-ascii' },
    ]
  },
];

export const MOCK_TUTORIALS: Tutorial[] = [
  {
    id: 'stack-card-scroll',
    title: 'Stack Card Scrolling Animation',
    description: 'How to make a Stack Card Scrolling Animation using Tailwind CSS, Framer Motion.',
    link: 'https://github.com/K4mp47/stack-card',
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
    },
    relatedTutorialIds: []
  },
  {
    id: '3d-cube-ascii',
    title: '3D ASCII Cube Animation',
    description: 'How to make a 3D ASCII Cube Animation using Tailwind CSS and React.',
    link: 'https://github.com/K4mp47/cube-app',
    date: 'January 11, 2026',
    category: '3D',
    image: '/cube.png',
    difficulty: 'Advanced',
    duration: 'Long',
    intro: {
      content: "This project demonstrates how to render a 3D rotating cube using ASCII characters in a React component. It uses 3D rotation matrices and a Z-buffer algorithm to project 3D coordinates onto a 2D screen, all rendered within a preformatted text block."
    },
    setup: {
      items: [
        { type: 'text', content: "To set up a new Next.js project, you can use the following command:" },
        { type: 'command', content: "npx create-next-app@latest" },
        { type: 'text', content: "This project uses Tailwind CSS for styling, which is included by default with the latest `create-next-app`." },
        { type: 'text', content: "Now you are ready to start." }
      ]
    },
     implementation: {
        description: "Start creating a new component called `AsciiCube.tsx` inside the `components` folder. The code below shows the implementation of the cube generation logic, including the calculation of rotation matrices and surface rendering.",
        principles: ["3D Rotation Matrices", "Z-Buffer Algorithm", "ASCII Rendering"],
        files: [
             {
                name: "components/AsciiCube.tsx",
                language: "tsx",
                code: `"use client";
import React, { useEffect, useRef, useState } from "react";

/**
 * A true 3D ASCII cube generator.
 * Renders into a 2D string buffer using rotation matrices.
 */
const AsciiCube: React.FC = () => {
  const [frame, setFrame] = useState("");
  const A = useRef(0); // Rotation X
  const B = useRef(0); // Rotation Y
  const C = useRef(0); // Rotation Z

  const width = 60;
  const height = 60;
  const cubeSize = 20;
  const backgroundASCIICode = " ";

  const zBuffer = useRef<number[]>(new Array(width * height).fill(0));
  const buffer = useRef<string[]>(
    new Array(width * height).fill(backgroundASCIICode),
  );

  // Rotation Matrix Calculations
  const calculateX = (i: number, j: number, k: number, A: number, B: number, C: number) => {
    return (
      j * Math.sin(A) * Math.sin(B) * Math.cos(C) -
      k * Math.cos(A) * Math.sin(B) * Math.cos(C) +
      j * Math.cos(A) * Math.sin(C) +
      k * Math.sin(A) * Math.sin(C) +
      i * Math.cos(B) * Math.cos(C)
    );
  };

  const calculateY = (i: number, j: number, k: number, A: number, B: number, C: number) => {
    return (
      j * Math.cos(A) * Math.cos(C) +
      k * Math.sin(A) * Math.cos(C) -
      j * Math.sin(A) * Math.sin(B) * Math.sin(C) +
      k * Math.cos(A) * Math.sin(B) * Math.sin(C) -
      i * Math.cos(B) * Math.sin(C)
    );
  };

  const calculateZ = (i: number, j: number, k: number, A: number, B: number) => {
    return (
      k * Math.cos(A) * Math.cos(B) -
      j * Math.sin(A) * Math.cos(B) +
      i * Math.sin(B)
    );
  };

  const calculateForSurface = (cubeX: number, cubeY: number, cubeZ: number, ch: string) => {
    const x = calculateX(cubeX, cubeY, cubeZ, A.current, B.current, C.current);
    const y = calculateY(cubeX, cubeY, cubeZ, A.current, B.current, C.current);
    const z = calculateZ(cubeX, cubeY, cubeZ, A.current, B.current) + 100;

    const ooz = 1 / z;
    const xp = Math.floor(width / 2 + 40 * ooz * x * 2);
    const yp = Math.floor(height / 2 + 40 * ooz * y);

    const idx = xp + yp * width;
    if (idx >= 0 && idx < width * height) {
      if (ooz > zBuffer.current[idx]) {
        zBuffer.current[idx] = ooz;
        buffer.current[idx] = ch;
      }
    }
  };

  useEffect(() => {
    const renderInterval = setInterval(() => {
      buffer.current.fill(backgroundASCIICode);
      zBuffer.current.fill(0);

      // Render surfaces
      for (let cubeX = -cubeSize; cubeX < cubeSize; cubeX += 0.8) {
        for (let cubeY = -cubeSize; cubeY < cubeSize; cubeY += 0.8) {
          calculateForSurface(cubeX, cubeY, cubeSize, "#");
          calculateForSurface(cubeSize, cubeY, cubeX, "$");
          calculateForSurface(-cubeSize, cubeY, -cubeX, "@");
          calculateForSurface(-cubeX, cubeY, -cubeSize, "%");
          calculateForSurface(cubeX, cubeSize, cubeY, "*");
          calculateForSurface(cubeX, -cubeSize, -cubeY, "+");
        }
      }

      let output = "";
      for (let k = 0; k < width * height; k++) {
        output += k % width === 0 ? "\\n" : buffer.current[k];
      }
      setFrame(output);

      // Update rotation angles
      A.current += 0.02;
      B.current += 0.05;
      C.current += 0.01;
    }, 30);

    return () => clearInterval(renderInterval);
  }, []);

  return (
    <pre className="text-[8px] sm:text-[10px] md:text-[12px] leading-[0.8] font-mono text-white opacity-80 select-none whitespace-pre">
      {frame}
    </pre>
  );
};

export default AsciiCube;`
             },
             {
                name: "app/page.tsx",
                language: "tsx",
                code: `import AsciiCube from "@/components/AsciiCube";

export default function Home() {
  return (
    <div className="flex flex-col h-screen w-screen bg-[#000000] text-[#d4d4d4] select-none font-mono">
      <main className="flex w-full h-full items-center justify-center py-32 px-16 bg-white dark:bg-black sm:items-start">
        <AsciiCube />
      </main>
    </div>
  );
}`
             }
        ]
    },
    conclusion: {
        content: "This creates a responsive, rotating 3D cube rendered entirely with ASCII characters, styled using Tailwind CSS classes for positioning and font adjustments.",
        author: "Alberto"
    },
    relatedTutorialIds: []
  }
];
