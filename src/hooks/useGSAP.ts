import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useGSAP = () => {
  const ref = useRef<HTMLElement>(null);

  const animateIn = (element: string | Element, options = {}) => {
    return gsap.fromTo(element, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", ...options }
    );
  };

  const staggerIn = (elements: string | Element[], options = {}) => {
    return gsap.fromTo(elements,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out", ...options }
    );
  };

  const morphIcon = (element: string | Element) => {
    return gsap.to(element, {
      rotation: 360,
      scale: 1.2,
      duration: 0.6,
      ease: "back.out(1.7)",
      yoyo: true,
      repeat: 1
    });
  };

  const magneticButton = (element: HTMLElement) => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(element, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)"
      });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  };

  const countUp = (element: string | Element, endValue: number) => {
    const obj = { value: 0 };
    return gsap.to(obj, {
      value: endValue,
      duration: 2,
      ease: "power2.out",
      onUpdate: () => {
        if (typeof element === 'string') {
          const el = document.querySelector(element);
          if (el) el.textContent = Math.round(obj.value).toString();
        } else {
          element.textContent = Math.round(obj.value).toString();
        }
      }
    });
  };

  return { ref, animateIn, staggerIn, morphIcon, magneticButton, countUp };
};