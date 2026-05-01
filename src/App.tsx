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

    // Initial load animations for hero
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
      once: true
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

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Navbar height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen font-sans bg-dark">
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
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 py-6 px-8 md:px-16 flex justify-between items-center ${scrolled ? 'bg-dark/95 backdrop-blur-lg shadow-xl py-4 border-b border-white/5' : 'bg-transparent'}`}>
        <div 
          onClick={() => scrollTo('home')}
          className="text-2xl font-black italic tracking-tighter text-primary cursor-pointer"
        >
          FIT-X<span className="text-white">GYM</span>
        </div>
        <div className="hidden md:flex gap-8 items-center font-bold text-xs uppercase tracking-widest">
          <button onClick={() => scrollTo('home')} className="nav-link text-white">Home</button>
          <button onClick={() => scrollTo('about')} className="nav-link text-white">About</button>
          <button onClick={() => scrollTo('contact')} className="nav-link text-white">Contact</button>
          <button 
            onClick={() => scrollTo('contact')}
            className="bg-primary px-5 py-2 hover:bg-white hover:text-primary transition-colors duration-300 transform hover:scale-105 active:scale-95"
          >
            Join Now
          </button>
        </div>
        <div className="md:hidden text-primary text-2xl">
          <i className="fa-solid fa-bars"></i>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Section 1: Home (Hero) */}
        <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920")' }}
          >
            <div className="absolute inset-0 bg-black/75 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dark"></div>
            <div className="absolute inset-0 bg-primary/5"></div>
          </div>
          
          <div className="relative z-10 text-center px-4 max-w-5xl">
            <div className="relative inline-block mb-4">
              <h1 
                ref={heroTextRef}
                className="text-6xl md:text-9xl font-black uppercase leading-[0.9] tracking-tighter mb-4 hero-text-shadow text-glow"
              >
                Break Your <br />
                <span className="text-primary italic">Limits</span>
              </h1>
              <div ref={underlineRef} className="hero-underline"></div>
            </div>
            
            <p className="text-lg md:text-2xl text-gray-200 mb-12 max-w-2xl mx-auto font-bold tracking-wide drop-shadow-lg">
              FIT-X GYM — PECHS, Karachi. <br className="hidden md:block" /> Where Champions Are Forged.
            </p>
            
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              <button 
                onClick={() => scrollTo('contact')}
                ref={el => magneticRefs.current[0] = el}
                className="btn-primary w-64 md:w-auto shadow-[0_0_20px_rgba(255,45,45,0.4)]"
              >
                Get Started
              </button>
              <button 
                onClick={() => scrollTo('about')}
                ref={el => magneticRefs.current[1] = el}
                className="btn-outline w-64 md:w-auto border-white/50 backdrop-blur-sm"
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
            <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
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
              </div>

              {/* Right Content */}
              <div className="w-full lg:w-1/2">
                <h2 className="text-4xl md:text-6xl font-black uppercase mb-12 tracking-tight reveal">
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

            {/* Vision, Mission, Values Section */}
            <div className="mt-32 border-t border-white/5 pt-24 reveal">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Vision Box */}
                <div className="p-10 bg-white/5 border-l-4 border-primary hover:bg-white/10 transition-all duration-500">
                  <h3 className="text-primary text-3xl font-black uppercase tracking-tighter mb-6">
                    Our Vision
                  </h3>
                  <p className="text-gray-200 leading-relaxed font-bold text-lg">
                    To be the <span className="text-primary italic">ultimate forge</span> for physical and mental excellence in PECHS, Karachi, creating a community where every individual transcends their perceived limits and achieves peak performance.
                  </p>
                </div>
                
                {/* Mission Box */}
                <div className="p-10 bg-white/5 border-l-4 border-primary hover:bg-white/10 transition-all duration-500">
                  <h3 className="text-primary text-3xl font-black uppercase tracking-tighter mb-6">
                    Our Mission
                  </h3>
                  <p className="text-gray-200 leading-relaxed font-bold text-lg">
                    We empower our members through world-class equipment, <span className="text-primary italic">elite coaching</span>, and a high-octane environment that demands nothing less than absolute dedication and ruthlessness.
                  </p>
                </div>
                
                {/* Values Box */}
                <div className="p-10 bg-white/5 border-l-4 border-primary hover:bg-white/10 transition-all duration-500">
                  <h3 className="text-primary text-3xl font-black uppercase tracking-tighter mb-6">
                    Our Core Values
                  </h3>
                  <p className="text-gray-200 leading-relaxed font-bold text-lg">
                    Grit. Integrity. Community. We believe in the <span className="text-primary italic">raw power of consistency</span> and the unstoppable energy of a tribe moving together toward greatness, leaving no one behind.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Motivational Quote Divider */}
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
            <div className="mb-16 reveal">
              <h2 className="text-4xl md:text-6xl font-black uppercase mb-4 tracking-tighter">
                Get in <span className="text-primary italic">Touch:</span>
              </h2>
              <p className="text-gray-300 max-w-2xl text-lg">
                Better yet, see us in person! <br />
                <span className="text-gray-400 text-base">You are more than welcome to come in person and sign up. We would love to see you and show you around.</span>
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-16">
              {/* Info */}
              <div className="w-full lg:w-1/3 space-y-10 reveal">
                <div className="group cursor-pointer">
                  <a href="https://wa.me/27780197523" target="_blank" rel="noopener noreferrer" className="flex gap-6 items-center">
                    <div className="w-12 h-12 bg-[#25D366] flex items-center justify-center shrink-0 rounded-full shadow-[0_0_15px_rgba(37,211,102,0.3)]">
                      <i className="fa-brands fa-whatsapp text-2xl"></i>
                    </div>
                    <span className="text-white font-bold tracking-wide group-hover:text-[#25D366] transition-colors">Message us on WhatsApp</span>
                  </a>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-primary flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-location-dot"></i>
                  </div>
                  <div>
                    <h4 className="text-accent font-bold uppercase tracking-widest text-xs mb-2">Fit-X Gyms location</h4>
                    <p className="text-gray-300 leading-relaxed text-sm">
                      West End, Cnr Madiba &,<br />
                      Doctor Enos Mabuza Drive, Sonheuwel,<br />
                      Mbombela, South Africa
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-primary flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-phone"></i>
                  </div>
                  <div>
                    <h4 className="text-accent font-bold uppercase tracking-widest text-xs mb-2">Phone</h4>
                    <p className="text-gray-300 text-xl font-bold tracking-tighter">0780197523</p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-primary flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-envelope"></i>
                  </div>
                  <div>
                    <h4 className="text-accent font-bold uppercase tracking-widest text-xs mb-2">Account Inquiries</h4>
                    <p className="text-gray-300 text-sm break-all font-medium">info.westend@fitxgyms.co.za</p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                    <i className="fa-solid fa-clock text-accent"></i>
                  </div>
                  <div>
                    <h4 className="text-accent font-bold uppercase tracking-widest text-xs mb-2">Operating Hours</h4>
                    <p className="text-white text-2xl font-black">05:00 – 21:00</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="w-full lg:w-2/3 bg-white/5 p-8 md:p-12 border border-white/10 relative reveal">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <i className="fa-solid fa-envelope-open-text text-8xl"></i>
                </div>
                
                <h3 className="text-2xl font-black uppercase mb-8 tracking-widest border-l-4 border-primary pl-6">Contact Me</h3>
                
                <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-bold text-gray-500 tracking-widest">Name*</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-dark/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none px-4 py-4 transition-all text-white placeholder:text-white/20 font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-bold text-gray-500 tracking-widest">Contact number*</label>
                    <input 
                      type="tel" 
                      required
                      className="w-full bg-dark/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none px-4 py-4 transition-all text-white placeholder:text-white/20 font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-bold text-gray-500 tracking-widest">Email*</label>
                    <input 
                      type="email" 
                      required
                      className="w-full bg-dark/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none px-4 py-4 transition-all text-white placeholder:text-white/20 font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-bold text-gray-500 tracking-widest">Fitness Goal</label>
                    <select className="w-full bg-dark/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none px-4 py-4 transition-all text-white appearance-none cursor-pointer font-medium">
                      <option>Weight Loss</option>
                      <option>Muscle Gain</option>
                      <option>Endurance</option>
                      <option>General Fitness</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs uppercase font-bold text-gray-500 tracking-widest">Message</label>
                    <textarea 
                      rows={4}
                      className="w-full bg-dark/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none px-4 py-4 transition-all text-white placeholder:text-white/20 resize-none font-medium"
                    ></textarea>
                  </div>
                  
                  <div className="md:col-span-2">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-6 leading-relaxed">
                      This site is protected by reCAPTCHA and the Google <a href="#" className="text-primary hover:underline">Privacy Policy</a> and <a href="#" className="text-primary hover:underline">Terms of Service</a> apply.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button className="btn-primary flex-1 py-5 text-base shadow-[0_10px_20px_rgba(255,45,45,0.2)]">Send</button>
                      <button type="reset" className="btn-outline flex-1 py-5 text-base border-white/20 hover:bg-white/10">Cancel</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-white/5 text-center px-4 relative z-10">
        <p className="text-gray-500 text-xs uppercase tracking-[0.5em]">
          &copy; {new Date().getFullYear()} FIT-X GYM. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  );
}
