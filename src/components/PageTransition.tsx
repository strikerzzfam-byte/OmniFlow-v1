import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Page entrance animation
    const tl = gsap.timeline();
    
    tl.fromTo(containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );

    // Animate child elements with stagger
    const childElements = containerRef.current.children;
    if (childElements.length > 0) {
      gsap.fromTo(childElements,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.5, 
          stagger: 0.1, 
          ease: "power2.out",
          delay: 0.2
        }
      );
    }
  }, []);

  return (
    <div ref={containerRef} className="page-transition">
      {children}
    </div>
  );
};

export default PageTransition;