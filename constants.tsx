
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
  }
];
