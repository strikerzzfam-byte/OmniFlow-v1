import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CountUpAnimationProps {
  endValue: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

const CountUpAnimation = ({ 
  endValue, 
  duration = 2, 
  suffix = "", 
  className = "" 
}: CountUpAnimationProps) => {
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!countRef.current) return;

    const element = countRef.current;
    const obj = { value: 0 };

    gsap.to(obj, {
      value: endValue,
      duration,
      ease: "power2.out",
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
        toggleActions: "play none none none"
      },
      onUpdate: () => {
        element.textContent = Math.round(obj.value) + suffix;
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [endValue, duration, suffix]);

  return <span ref={countRef} className={className}>0{suffix}</span>;
};

export default CountUpAnimation;