import React from 'react';
import { motion, animate, MotionValue } from 'motion/react';

interface NavBarProps {
  depthValue: MotionValue<number>;
  activeSection: number;
}

const NAV = [
  { label: 'Hero',    depth: 0     },
  { label: 'About',   depth: 5000  },
  { label: 'Skills',  depth: 10000 },
  { label: 'Works',   depth: 15000 },
  { label: 'Contact', depth: 20000 },
];

export const NavBar = React.memo(({ depthValue, activeSection }: NavBarProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-5 pb-3 pointer-events-none">
    </nav>
  );
});

NavBar.displayName = 'NavBar';
