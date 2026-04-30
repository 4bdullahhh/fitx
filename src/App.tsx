/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FeatureCard = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
  <div className="group relative bg-white/5 backdrop-blur-md border border-primary/20 p-8 transition-all duration-500 hover:-translate-y-2 hover:border-primary/60 hover:shadow-[0_0_30px_rgba(255,45,45,0.2)]">
    <div className="text-primary text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
      <i className={icon}></i>
    </div>
    <h3 className="text-xl font-bold mb-2 uppercase tracking-wide">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
  </div>
);

const StatCounter = ({ endValue, label, suffix = "" }: { endValue: number; label: string; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let start = 0;
          const duration = 2000;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentCount = Math.floor(progress * endValue);
            setCount(currentCount);

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [endValue]);

  return (
    <div ref={countRef} className="text-center w-full md:w-1/3">
      <div className="text-5xl font-black text-primary mb-2">
        {count}{suffix}
      </div>
      <div className="text-gray-300 uppercase tracking-widest text-sm font-medium">
        {label}
      </div>
    </div>
  );
};

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const heroTextRef = useRef<HTMLHeadingElement>(null);
  const underlineRef = useRef<HTMLDivElement>(null);
  const magneticRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    // Scroll listener for sticky navbar
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Initial load animations
    const tl = gsap.timeline();
    tl.from(heroTextRef.current, {
      opacity: 0,
      y: 100,
      duration: 1,
      ease: 'power4.out',
    })
    .to(underlineRef.current, {
      width: '100%',
      duration: 1,
      ease: 'power2.inOut',
    }, "-=0.5");

    // Magnetic effect for buttons
    magneticRefs.current.forEach(btn => {
      if (!btn) return;
      
      const handleMouseMove = (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(btn, {
          x: x * 0.3,
          y: y * 0.3,
          duration: 0.3,
          ease: 'power2.out'
        });
      };

      const handleMouseLeave = () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.3)'
        });
      };

      btn.addEventListener('mousemove', handleMouseMove);
      btn.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        btn.removeEventListener('mousemove', handleMouseMove);
        btn.removeEventListener('mouseleave', handleMouseLeave);
      };
    });

    // Fade-in sections on scroll
    ScrollTrigger.batch(".reveal", {
      onEnter: (elements) => {
        gsap.from(elements, {
          opacity: 0,
          y: 60,
          stagger: 0.2,
          duration: 1,
          ease: 'power3.out',
          overwrite: true
        });
      },
    });

    // Motivational lines
    gsap.utils.toArray('.quote-line').forEach((line: any) => {
      gsap.to(line, {
        scrollTrigger: {
          trigger: line,
          start: "top 80%",
        },
        width: "200px",
        duration: 1.5,
        ease: "power2.inOut"
      });
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="min-h-screen font-sans">
      {/* Particles Container */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              '--left': `${Math.random() * 100}%`,
              '--duration': `${5 + Math.random() * 10}s`,
              '--size': `${2 + Math.random() * 4}px`,
              opacity: 0.1
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 py-6 px-8 md:px-16 flex justify-between items-center ${scrolled ? 'bg-dark/95 backdrop-blur-lg shadow-xl py-4' : 'bg-transparent'}`}>
        <div className="text-2xl font-black italic tracking-tighter text-primary">
          FIT-X<span className="text-white">GYM</span>
        </div>
        <div className="hidden md:flex gap-8 items-center font-bold text-xs uppercase tracking-widest">
          <a href="#home" className="nav-link">Home</a>
          <a href="#about" className="nav-link">About</a>
          <a href="#contact" className="nav-link">Contact</a>
          <a href="#contact" className="bg-primary px-5 py-2 hover:bg-white hover:text-primary transition-colors duration-300">Join Now</a>
        </div>
        <div className="md:hidden text-primary text-2xl">
          <i className="fa-solid fa-bars"></i>
        </div>
      </nav>

      {/* Section 1: Home (Hero) */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920")' }}
        >
          <div className="absolute inset-0 bg-black/70 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dark"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl">
          <div className="relative inline-block mb-4">
            <h1 
              ref={heroTextRef}
              className="text-6xl md:text-9xl font-black uppercase leading-none tracking-tighter mb-4"
            >
              Break Your <br />
              <span className="text-primary italic">Limits</span>
            </h1>
            <div ref={underlineRef} className="hero-underline"></div>
          </div>
          
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-medium tracking-wide">
            FIT-X GYM — PECHS, Karachi. <br className="hidden md:block" /> Where Champions Are Forged.
          </p>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <button 
              ref={el => magneticRefs.current[0] = el}
              className="btn-primary w-64 md:w-auto"
            >
              Get Started
            </button>
            <button 
              ref={el => magneticRefs.current[1] = el}
              className="btn-outline w-64 md:w-auto"
            >
              Explore
            </button>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-primary text-xl">
          <i className="fa-solid fa-chevron-down"></i>
        </div>
      </section>

      {/* Section 2: About */}
      <section id="about" className="py-24 bg-dark relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-16">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left Image */}
            <div className="w-full lg:w-1/2 relative reveal">
              <div className="absolute -inset-4 border-2 border-primary/30 animate-pulse"></div>
              <div className="relative clip-diagonal overflow-hidden aspect-[4/5] md:aspect-video lg:aspect-[4/5]">
                <img 
                  src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800" 
                  alt="Fit-X Interior" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-primary/20 -z-10 rounded-full blur-3xl"></div>
            </div>

            {/* Right Content */}
            <div className="w-full lg:w-1/2">
              <h2 className="text-4xl md:text-6xl font-black uppercase mb-12 reveal tracking-tight">
                Why <span className="text-primary italic">FIT-X?</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 reveal">
                <FeatureCard 
                  icon="fa-solid fa-user-ninja" 
                  title="Expert Trainers" 
                  description="Certified professionals dedicated to your growth and safety."
                />
                <FeatureCard 
                  icon="fa-solid fa-clock" 
                  title="24/7 Access" 
                  description="Train on your own time. We're open around the clock for our members."
                />
                <FeatureCard 
                  icon="fa-solid fa-dumbbell" 
                  title="Modern Equipment" 
                  description="State-of-the-art machines and premium free weights selection."
                />
                <FeatureCard 
                  icon="fa-solid fa-users-gear" 
                  title="PECHS Community" 
                  description="A tight-knit fitness family right in the heart of Karachi."
                />
              </div>

              <div className="flex flex-wrap gap-8 md:gap-0 justify-between items-center reveal pt-12 border-t border-white/10">
                <StatCounter endValue={500} label="Members" suffix="+" />
                <StatCounter endValue={12} label="Trainers" suffix="+" />
                <StatCounter endValue={5} label="Rating" suffix="/5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Motivational Quote Divider */}
      <section className="relative py-48 md:py-64 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-fixed bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1920")' }}
        >
          <div className="absolute inset-0 bg-black/85"></div>
        </div>
        
        <div className="relative z-10 text-center px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <div>
              <p className="text-3xl md:text-5xl font-bold italic text-white leading-tight mb-4">
                "The only bad workout is the one that <span className="text-primary">didn't happen</span>."
              </p>
              <div className="quote-line h-1 bg-primary mx-auto w-0"></div>
            </div>
            
            <div className="pt-8">
              <p className="text-xl md:text-2xl text-gray-400 font-light max-w-2xl mx-auto italic reveal" style={{ transitionDelay: '0.5s' }}>
                Your body can stand almost anything. It's your mind that you have to convince.
              </p>
              <div className="quote-line h-0.5 bg-accent/40 mx-auto w-0 mt-4"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Contact */}
      <section id="contact" className="py-24 bg-dark">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black uppercase mb-4 tracking-tighter reveal">
              Have Questions? <br />
              <span className="text-primary">We're Here.</span>
            </h2>
            <p className="text-gray-400 uppercase tracking-[0.3em] text-sm reveal">Contact the FIT-X team today</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-16">
            {/* Info */}
            <div className="w-full lg:w-1/3 space-y-12 reveal">
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-primary flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <div>
                  <h4 className="text-accent font-bold uppercase tracking-widest text-xs mb-2">Location</h4>
                  <p className="text-gray-300">Block 6, PECHS, <br />Main Shahrah-e-Faisal, Karachi.</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-primary flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-phone"></i>
                </div>
                <div>
                  <h4 className="text-accent font-bold uppercase tracking-widest text-xs mb-2">Call Us</h4>
                  <p className="text-gray-300">+92 21 3456 7890<br />+92 300 1234 567</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-primary flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-envelope"></i>
                </div>
                <div>
                  <h4 className="text-accent font-bold uppercase tracking-widest text-xs mb-2">Email</h4>
                  <p className="text-gray-300">hello@fit-x.com<br />membership@fit-x.com</p>
                </div>
              </div>
              
              <div className="pt-8 border-t border-white/10 flex gap-6 text-2xl text-white/50">
                <a href="#" className="hover:text-primary transition-colors"><i className="fa-brands fa-instagram"></i></a>
                <a href="#" className="hover:text-primary transition-colors"><i className="fa-brands fa-facebook"></i></a>
                <a href="#" className="hover:text-primary transition-colors"><i className="fa-brands fa-x-twitter"></i></a>
              </div>
            </div>

            {/* Form */}
            <div className="w-full lg:w-2/3 bg-white/5 p-8 md:p-12 border border-white/10 reveal">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold text-gray-500 tracking-widest">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    className="w-full bg-dark/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none px-4 py-3 transition-all text-white placeholder:text-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold text-gray-500 tracking-widest">Phone Number</label>
                  <input 
                    type="tel" 
                    placeholder="+92 300 1234567"
                    className="w-full bg-dark/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none px-4 py-3 transition-all text-white placeholder:text-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold text-gray-500 tracking-widest">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com"
                    className="w-full bg-dark/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none px-4 py-3 transition-all text-white placeholder:text-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold text-gray-500 tracking-widest">Your Goal</label>
                  <select className="w-full bg-dark/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none px-4 py-3 transition-all text-white appearance-none">
                    <option>Weight Loss</option>
                    <option>Muscle Gain</option>
                    <option>Endurance</option>
                    <option>General Fitness</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs uppercase font-bold text-gray-500 tracking-widest">Your Message</label>
                  <textarea 
                    rows={4}
                    placeholder="Tell us about your fitness journey..."
                    className="w-full bg-dark/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none px-4 py-3 transition-all text-white placeholder:text-white/20 resize-none"
                  ></textarea>
                </div>
                <div className="md:col-span-2 pt-4">
                  <button className="btn-primary w-full py-5 text-lg">Send Message</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-white/5 text-center px-4">
        <p className="text-gray-500 text-xs uppercase tracking-[0.5em]">
          &copy; {new Date().getFullYear()} FIT-X GYM KARACHI. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  );
}
