'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function TextReveal({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  // NOTE: renders a <span> (not <div>) so it stays valid inside <p> and <h1>.
  // A <div> here caused hydration mismatch that broke all client interactivity.
  const container = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!container.current) return;
    const elements = container.current.children;
    gsap.fromTo(
      elements,
      { y: 100, opacity: 0, rotateZ: 3 },
      {
        y: 0,
        opacity: 1,
        rotateZ: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: 'power4.out',
        delay,
        scrollTrigger: {
          trigger: container.current,
          start: 'top 85%',
        }
      }
    );
  }, { scope: container });

  return (
    <span ref={container} className="overflow-hidden inline-flex flex-wrap gap-x-3">
      {typeof children === 'string' 
        ? children.split(' ').map((word, i) => (
            <span key={i} className="inline-block translate-y-full opacity-0 origin-bottom-left">
              {word}
            </span>
          ))
        : <span className="inline-block translate-y-full opacity-0 origin-bottom-left">{children}</span>}
    </span>
  );
}
