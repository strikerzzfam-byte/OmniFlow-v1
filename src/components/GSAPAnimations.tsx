import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface GSAPAnimationsProps {
  children: React.ReactNode;
  animation?: 'fadeIn' | 'slideUp' | 'stagger' | 'scale' | 'rotate';
  trigger?: string;
  delay?: number;
  duration?: number;
}

const GSAPAnimations = ({ 
  children, 
  animation = 'fadeIn', 
  trigger,
  delay = 0,
  duration = 0.8 
}: GSAPAnimationsProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    let tl = gsap.timeline({ delay });

    switch (animation) {
      case 'fadeIn':
        gsap.fromTo(element, 
          { opacity: 0 },
          { 
            opacity: 1, 
            duration,
            scrollTrigger: trigger ? {
              trigger: trigger,
              start: "top 80%",
              toggleActions: "play none none reverse"
            } : undefined
          }
        );
        break;

      case 'slideUp':
        gsap.fromTo(element,
          { opacity: 0, y: 50 },
          { 
            opacity: 1, 
            y: 0, 
            duration,
            ease: "power2.out",
            scrollTrigger: trigger ? {
              trigger: trigger,
              start: "top 80%",
              toggleActions: "play none none reverse"
            } : undefined
          }
        );
        break;

      case 'stagger':
        const children = element.children;
        gsap.fromTo(children,
          { opacity: 0, y: 30 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: trigger ? {
              trigger: trigger,
              start: "top 80%",
              toggleActions: "play none none reverse"
            } : undefined
          }
        );
        break;

      case 'scale':
        gsap.fromTo(element,
          { opacity: 0, scale: 0.8 },
          { 
            opacity: 1, 
            scale: 1, 
            duration,
            ease: "back.out(1.7)",
            scrollTrigger: trigger ? {
              trigger: trigger,
              start: "top 80%",
              toggleActions: "play none none reverse"
            } : undefined
          }
        );
        break;

      case 'rotate':
        gsap.fromTo(element,
          { opacity: 0, rotation: -10 },
          { 
            opacity: 1, 
            rotation: 0, 
            duration,
            ease: "power2.out",
            scrollTrigger: trigger ? {
              trigger: trigger,
              start: "top 80%",
              toggleActions: "play none none reverse"
            } : undefined
          }
        );
        break;
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [animation, trigger, delay, duration]);

  return <div ref={ref}>{children}</div>;
};

export default GSAPAnimations;