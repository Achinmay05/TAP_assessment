import React, { useRef, useEffect, useState } from 'react';

export default function FadeInBox() {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.3, // 30% element dikhe tab trigger ho
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-opacity duration-1000 ease-in-out p-6 mt-40 mx-auto w-[80%] rounded-lg shadow-lg text-center text-white ${
        isVisible ? 'opacity-100 bg-green-600' : 'opacity-0'
      }`}
    >
      👋 I faded in when visible on screen!
    </div>
  );
}
