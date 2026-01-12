
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
  {
    title: 'Backgrounds',
    items: [
      { name: 'Liquid Background Animation', id: 'liquid-background-animation' },
      { name: 'Liquid Steel Background Animation', id: 'liquid-steel-background-animation' },
    ]
  },
];

export const MOCK_TUTORIALS: Tutorial[] = [
  {
    id: 'liquid-background-animation',
    title: 'Liquid Background Animation',
    description: 'How to make a Liquid Background Animation using tailwindcss and React.',
    link: 'https://github.com/K4mp47/liquid-flow',
    date: 'January 12, 2026',
    category: '3D',
    image: '/flow.png',
    difficulty: 'Advanced',
    duration: 'Long',
    intro: {
      content: "This project demonstrates a liquid background effect that evaporates on scroll. The effect is built with Next.js, TypeScript, and WebGL for rendering the fluid dynamics."
    },
    setup: {
      items: [
        { type: 'text', content: "To set up a new Next.js project, you can use the following command:." },
        { type: 'command', content: "npx create-next-app@latest" },
        { type: 'text', content: "After that, install the required dependencies:" },
        { type: 'command', content: "npm install framer-motion" },
        { type: 'text', content: "Now you are ready to start" }
      ]
    },
    implementation: {
      description: "Start creating a new component called `LiquidBackground.tsx` inside the `components` folder. The code below shows the basic structure of the component.",
      principles: ["WebGL", "Shaders", "React Hooks"],
      files: [
        {
          name: "components/LiquidBackground.tsx",
          language: "tsx",
          code: `"use client";
import React, { useEffect, useRef } from 'react';

interface LiquidBackgroundProps {
  evaporation?: number; // 0 to 1
  scrollOffset?: number; // Current scroll position for parallax
}

const LiquidBackground: React.FC<LiquidBackgroundProps> = ({ evaporation = 0, scrollOffset = 0 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ evaporation, scrollOffset });

  useEffect(() => {
    stateRef.current = { evaporation, scrollOffset };
  }, [evaporation, scrollOffset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const vertexShaderSource = \`
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    \`;

    const fragmentShaderSource = \`
      precision highp float;
      uniform float u_time;
      uniform float u_evaporation;
      uniform float u_scroll;
      uniform vec2 u_resolution;

      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

      float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i  = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        i = mod289(i);
        vec4 p = permute(permute(permute(
                  i.z + vec4(0.0, i1.z, i2.z, 1.0))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        vec4 x = x_ * ns.x + ns.yyyy;
        vec4 y = y_ * ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        float ratio = u_resolution.x / u_resolution.y;
        vec2 p = (uv - 0.5) * 1.6;
        p.x *= ratio;

        p.y += u_scroll * 0.4;

        float t = u_time * 0.12;
        
        // Fluid structure
        float n1 = snoise(vec3(p * 0.4, t));
        float n2 = snoise(vec3(p * 0.9 + n1 * 1.2, t * 0.7));
        float f = n2 * 0.5 + 0.5;

        // Smooth out for evaporation
        float smoothEvap = smoothstep(0.0, 1.0, u_evaporation);
        float visibleF = mix(f, 0.0, smoothEvap * 1.4);

        // Gradient Colors inspired by the photo:
        // Vibrant Magenta/Pink
        vec3 col1 = vec3(1.0, 0.05, 0.55); 
        // Bright Blue
        vec3 col2 = vec3(0.1, 0.4, 1.0);
        // Soft Purple/White Highlight
        vec3 col3 = vec3(0.9, 0.7, 1.0);
        // Deep Background Blue/Black
        vec3 col4 = vec3(0.02, 0.02, 0.1);

        // Map colors based on noise and screen position to create that split-gradient look
        float colorMix = snoise(vec3(p * 0.2, t * 0.1)) * 0.5 + 0.5;
        vec3 fluidBase = mix(col1, col2, colorMix + uv.y * 0.3);
        
        // Final color composition
        vec3 color = mix(col4, fluidBase, visibleF);
        
        // Specular and light peaks
        float spec = pow(visibleF, 8.0);
        color = mix(color, col3, spec * 0.6);
        
        // Final glowing highlights
        color += pow(visibleF, 14.0) * 0.4;

        // Desaturate slightly as it evaporates for a "dying ember" feel
        color = mix(color, vec3(length(color) * 0.2), smoothEvap * 0.8);

        // Global mask
        color *= (1.0 - smoothstep(0.98, 1.0, u_evaporation));

        gl_FragColor = vec4(color, 1.0);
      }
    \`;

    const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const program = gl.createProgram()!;
    gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vertexShaderSource));
    gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource));
    gl.linkProgram(program);
    gl.useProgram(program);

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, 'u_time');
    const evapLoc = gl.getUniformLocation(program, 'u_evaporation');
    const scrollLoc = gl.getUniformLocation(program, 'u_scroll');
    const resLoc = gl.getUniformLocation(program, 'u_resolution');

    const resize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        gl.viewport(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    };
    window.addEventListener('resize', resize);
    resize();

    let frame: number;
    const render = (time: number) => {
      gl.uniform1f(timeLoc, time * 0.001);
      gl.uniform1f(evapLoc, stateRef.current.evaporation);
      gl.uniform1f(scrollLoc, stateRef.current.scrollOffset);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full block bg-black" />;
};

export default LiquidBackground;`
        },
        {
          name: "app/page.tsx",
          language: "tsx",
          code: `"use client";
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import LiquidBackground from '../components/LiquidBackground';

const HomePage: React.FC = () => {
  const [displayEvap, setDisplayEvap] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const targetEvap = useRef(0);
  const currentEvap = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      targetEvap.current = Math.min(scrollY / (vh * 1.5), 1);
      setScrollOffset(scrollY / vh);
    };

    let rafId: number;
    const update = () => {
      const lerpFactor = 0.06;
      currentEvap.current += (targetEvap.current - currentEvap.current) * lerpFactor;

      if (Math.abs(currentEvap.current - displayEvap) > 0.0001) {
        setDisplayEvap(currentEvap.current);
      }

      rafId = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    rafId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [displayEvap]);

  return (
    <>
      <motion.div
        className="relative bg-black text-white font-sans selection:bg-pink-500/30 selection:text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <LiquidBackground evaporation={displayEvap} scrollOffset={scrollOffset} />

        {/* Hero Section */}
        <motion.section
          className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div
            className="relative z-10"
            style={{ transform: \`translateY(\${displayEvap * -150}px)\` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1
              className="text-7xl md:text-[14rem] font-black tracking-tighter leading-none text-center mix-blend-overlay"
              style={{ opacity: 1 - displayEvap * 2 }}
            >
              LIQUID
            </h1>
            <h1
              className="text-7xl md:text-[14rem] font-thin tracking-tighter leading-none text-center mt-[-1rem] md:mt-[-3rem] italic opacity-80"
              style={{ opacity: 1 - displayEvap * 2 }}
            >
              BACKGROUND
            </h1>
          </motion.div>
        </motion.section>

        {/* Content Section */}
        <section
          className="relative h-screen flex flex-col items-center justify-center px-6"
        >
          <h1 className="text-7xl md:text-[14rem] font-thin text-white leading-none text-center">
            BOTTOM CONTENT
          </h1>
        </section>
      </motion.div >
    </>
  );
};

export default HomePage;`
        }
      ]
    },
    conclusion: {
      content: "This tutorial showed how to create a stunning liquid background animation using WebGL and React. Feel free to experiment with the shader code to create your own unique effects.",
      author: "Alberto"
    },
    relatedTutorialIds: [
      'liquid-steel-background-animation'
    ]
  },
  {
    id: 'stack-card-scroll',
    title: 'Stack Card Scrolling Animation',
    description: 'How to make a Stack Card Scrolling Animation using Tailwind CSS, Framer Motion.',
    link: 'https://github.com/K4mp47/stack-card',
    date: 'January 9, 2026',
    category: 'SCROLL',
    image: '/image.png',
    difficulty: 'Beginner',
    duration: 'Short',
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
  },
  {
    id: 'liquid-steel-background-animation',
    title: 'Liquid Steel Background Animation',
    description: 'This project demonstrates a liquid steel background effect that evaporates on scroll. The effect is built with Next.js, TypeScript, and WebGL for rendering the fluid dynamics.',
    link: 'https://github.com/K4mp47/liquid-steel',
    date: 'January 12, 2026',
    category: '3D',
    image: '/steel.png',
    difficulty: 'Advanced',
    duration: 'Long',
    intro: {
      content: "This project demonstrates a liquid steel background effect that evaporates on scroll. The effect is built with Next.js, TypeScript, and WebGL for rendering the fluid dynamics. This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app)."
    },
    setup: {
      items: [
        { type: 'text', content: "To set up a new Next.js project, you can use the following command:." },
        { type: 'command', content: "npx create-next-app@latest" },
        { type: 'text', content: "After that, install the required dependencies:" },
        { type: 'command', content: "npm install framer-motion" },
        { type: 'text', content: "Now you are ready to start" }
      ]
    },
    implementation: {
      description: "The main logic is in two files: `components/LiquidBackground.tsx` and `app/page.tsx`.",
      principles: ["WebGL", "Framer Motion", "Shaders"],
      files: [
        {
          name: "components/LiquidBackground.tsx",
          language: "tsx",
          code: ` "use client";
import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface LiquidBackgroundProps {
  speed?: number;
  colorScheme?: 'cosmic' | 'ocean' | 'lava' | 'aurora';
  interactive?: boolean;
}

const LiquidBackground: React.FC<LiquidBackgroundProps> = ({
  speed = 0.3,
  colorScheme = 'cosmic',
  interactive = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Mouse interaction with Framer Motion
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Smooth spring animations for mouse movement
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Transform mouse position to shader coordinates
  const shaderMouseX = useTransform(smoothMouseX, [0, 1], [0, 1]);
  const shaderMouseY = useTransform(smoothMouseY, [0, 1], [1, 0]); // Flip Y

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      preserveDrawingBuffer: false
    });

    if (!gl) {
      setError("WebGL not supported");
      return;
    }

    const vertexShaderSource = \`
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    \`;

    const fragmentShaderSource = \`
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform int u_colorScheme;
      uniform float u_mouseInfluence;

      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

      float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        i = mod289(i);
        vec4 p = permute(permute(permute(
          i.z + vec4(0.0, i1.z, i2.z, 1.0)) +
          i.y + vec4(0.0, i1.y, i2.y, 1.0)) +
          i.x + vec4(0.0, i1.x, i2.x, 1.0));
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        vec4 x = x_ * ns.x + ns.yyyy;
        vec4 y = y_ * ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }

      float pattern(vec2 p, float t, vec2 mouse, out vec2 q, out vec2 r) {
        // Add mouse influence to the pattern
        vec2 mouseOffset = (mouse - 0.5) * u_mouseInfluence;
        
        q = vec2(
          snoise(vec3(p + mouseOffset + vec2(0.0, 0.0), t * 0.1)),
          snoise(vec3(p + mouseOffset + vec2(5.2, 1.3), t * 0.1))
        );
        
        r = vec2(
          snoise(vec3(p + 4.0 * q + vec2(1.7, 9.2), t * 0.15)),
          snoise(vec3(p + 4.0 * q + vec2(8.3, 2.8), t * 0.15))
        );
        
        return snoise(vec3(p + 4.0 * r + mouseOffset * 0.5, t * 0.05));
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        float ratio = u_resolution.x / u_resolution.y;
        vec2 p = (uv - 0.5) * 1.5;
        p.x *= ratio;

        float t = u_time * 0.3;
        vec2 q, r;
        float f = pattern(p, t, u_mouse, q, r);

        f = f * 0.5 + 0.5;
        f = smoothstep(0.2, 0.8, f);

        vec3 col_deep, col_mid, col_bright;
        
        if (u_colorScheme == 0) {
          col_deep = vec3(0.01, 0.01, 0.03);
          col_mid = vec3(0.1, 0.15, 0.25);
          col_bright = vec3(0.8, 0.9, 1.0);
        } else if (u_colorScheme == 1) {
          col_deep = vec3(0.0, 0.02, 0.05);
          col_mid = vec3(0.0, 0.15, 0.3);
          col_bright = vec3(0.3, 0.7, 0.9);
        } else if (u_colorScheme == 2) {
          col_deep = vec3(0.05, 0.0, 0.0);
          col_mid = vec3(0.3, 0.05, 0.0);
          col_bright = vec3(1.0, 0.4, 0.0);
        } else {
          col_deep = vec3(0.0, 0.02, 0.03);
          col_mid = vec3(0.0, 0.2, 0.15);
          col_bright = vec3(0.2, 0.9, 0.7);
        }

        vec3 color = mix(col_deep, col_mid, f);

        float light = pow(max(0.0, f), 3.0);
        color += light * col_bright * 0.4;

        float spec = pow(f, 16.0);
        color += spec * col_bright * 0.6;

        float scatter = pow(f, 2.0) * (1.0 - f);
        color += scatter * col_mid * 0.3;

        float edge = pow(1.0 - f, 4.0);
        color += edge * col_mid * 0.2;

        vec3 warpColor = vec3(length(q), length(r), length(q - r)) * 0.1;
        color += warpColor * col_bright * 0.15;

        gl_FragColor = vec4(color, 1.0);
      }
    \`;

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const program = gl.createProgram();
    const vShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!program || !vShader || !fShader) {
      setError("Failed to create shader program");
      return;
    }

    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setError("Program link error: " + gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1
    ]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const mouseLocation = gl.getUniformLocation(program, 'u_mouse');
    const colorSchemeLocation = gl.getUniformLocation(program, 'u_colorScheme');
    const mouseInfluenceLocation = gl.getUniformLocation(program, 'u_mouseInfluence');

    const colorSchemeMap = { cosmic: 0, ocean: 1, lava: 2, aurora: 3 };
    gl.uniform1i(colorSchemeLocation, colorSchemeMap[colorScheme]);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = \`\${window.innerWidth}px\`;
      canvas.style.height = \`\${window.innerHeight}px\`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener('resize', resize);
    resize();

    // Subscribe to Framer Motion values
    const unsubscribeX = shaderMouseX.on('change', () => { });
    const unsubscribeY = shaderMouseY.on('change', () => { });

    let animationFrame: number;
    const render = (time: number) => {
      gl.uniform1f(timeLocation, time * 0.001 * speed);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform2f(mouseLocation, shaderMouseX.get(), shaderMouseY.get());
      gl.uniform1f(mouseInfluenceLocation, interactive ? 1.0 : 0.0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrame = requestAnimationFrame(render);
    };

    animationFrame = requestAnimationFrame(render);

    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 100);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
      unsubscribeX();
      unsubscribeY();
      gl.deleteProgram(program);
      gl.deleteShader(vShader);
      gl.deleteShader(fShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, [speed, colorScheme, interactive, shaderMouseX, shaderMouseY]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.div
      className="w-full h-screen overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      <motion.canvas
        ref={canvasRef}
        initial={{ scale: 1.1, filter: "blur(20px)" }}
        animate={{
          scale: isVisible ? 1 : 1.1,
          filter: isVisible ? "blur(0px)" : "blur(20px)"
        }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
      />

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {error}
        </motion.div>
      )}
    </motion.div>
  );
};

export default LiquidBackground;`
        },
        {
          name: "app/page.tsx",
          language: "tsx",
          code: `import LiquidBackground from "@/components/LiquidBackground";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="opacity-70 scale-[100%] flex min-h-screen w-full flex-col items-center justify-between bg-white dark:bg-black sm:items-start">
        <LiquidBackground />
      </main>
    </div>
  );
}`
        }
      ]
    },
    conclusion: {
      content: "This tutorial showed how to create a stunning liquid background animation using WebGL and React. Feel free to experiment with the shader code to create your own unique effects.",
      author: "Alberto"
    },
    relatedTutorialIds: [
      'liquid-background-animation'
    ]
  }
];
