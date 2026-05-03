// pages/About.jsx
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Text3D, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import Header from '../components/Header';

import atishImg from "../assets/atish.jpeg";
import shreshaImg from "../assets/shresha.jpeg";


// --- 3D Coffee Bean Component ---
const CoffeeBean3D = ({ position, color = "#4E342E", speed = 1 }) => {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x += 0.01 * speed;
      ref.current.rotation.y += 0.015 * speed;
      ref.current.rotation.z += 0.005 * speed;
      ref.current.position.y = Math.sin(state.clock.getElapsedTime() * speed) * 0.2;
    }
  });

  return (
    <group 
      ref={ref} 
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Bean body - elongated sphere */}
      <mesh scale={[0.8, 0.6, 0.4]} castShadow>
        <sphereGeometry args={[0.4, 24, 24]} />
        <meshStandardMaterial 
          color={hovered ? "#8D6E63" : color} 
          roughness={0.5} 
          metalness={0.3}
          emissive={hovered ? "#5D4037" : "black"}
          emissiveIntensity={0.1}
        />
      </mesh>
      {/* Bean crease line */}
      <mesh position={[0, 0, 0.25]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.05, 0.25, 0.02]} />
        <meshStandardMaterial color="#3E2723" />
      </mesh>
    </group>
  );
};

// --- 3D Coffee Cup for About Page ---
const AboutCoffeeCup = () => {
  const ref = useRef();
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.2;
      ref.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.2) * 0.1;
    }
  });

  return (
    <group ref={ref} position={[0, -0.3, 0]}>
      {/* Cup body with gradient effect */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.7, 0.5, 0.9, 32]} />
        <meshStandardMaterial 
          color="#D2B48C" 
          roughness={0.2} 
          metalness={0.7}
          emissive="#8B5A2B"
          emissiveIntensity={0.05}
        />
      </mesh>
      {/* Cup handle */}
      <mesh position={[0.8, -0.1, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.25, 0.07, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#D2B48C" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Coffee liquid */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.65, 0.65, 0.08, 32]} />
        <meshStandardMaterial color="#3E2723" roughness={0.1} metalness={0.5} />
      </mesh>
      {/* Steam particles */}
      {[...Array(6)].map((_, i) => (
        <Float key={i} speed={1.5 + i * 0.3} floatIntensity={0.8 + i * 0.2}>
          <mesh position={[(-0.25 + i * 0.1), 0.4 + i * 0.06, 0]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#FFFFFF" transparent opacity={0.5} />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

// --- 3D Scene for About Page ---
const AboutScene3D = () => {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas shadows camera={{ position: [0, 0.5, 4], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={1.5} castShadow />
        <directionalLight position={[-3, 5, 5]} intensity={0.8} castShadow />
        <spotLight position={[0, 3, 2]} intensity={0.6} castShadow />
        
        {/* Floating coffee beans scattered around */}
        <CoffeeBean3D position={[-1.8, 1.2, -1]} color="#4E342E" speed={1.2} />
        <CoffeeBean3D position={[1.6, -0.8, -1.5]} color="#6D4C41" speed={0.8} />
        <CoffeeBean3D position={[2.2, 1.0, -0.5]} color="#3E2723" speed={1.5} />
        <CoffeeBean3D position={[-1.5, -1.2, -0.8]} color="#5D4037" speed={1.0} />
        <CoffeeBean3D position={[0.8, 1.8, -1.2]} color="#4E342E" speed={1.3} />
        <CoffeeBean3D position={[-0.5, -1.5, -1.8]} color="#6D4C41" speed={0.9} />
        
        {/* Central coffee cup */}
        <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.6}>
          <AboutCoffeeCup />
        </Float>
        
        {/* 3D Text "About Us" */}
        <Text3D
          font="https://threejs.org/examples/fonts/helvetiker_regular.typeface.json"
          size={0.5}
          height={0.08}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelSegments={5}
          position={[-1.5, 1.5, -1.5]}
        >
          About BrewHeaven
          <meshStandardMaterial color="#C97B5A" metalness={0.8} roughness={0.3} />
        </Text3D>
        
        {/* Decorative rings */}
        <mesh position={[0, 0, -1.5]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.5, 1.8, 64]} />
          <meshStandardMaterial color="#C97B5A" transparent opacity={0.15} />
        </mesh>
        <mesh position={[0, 0.5, -1.8]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.8, 2.1, 64]} />
          <meshStandardMaterial color="#D2B48C" transparent opacity={0.1} />
        </mesh>
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <Float key={i} speed={0.5 + i * 0.1} floatIntensity={0.3}>
            <mesh position={[
              (Math.random() - 0.5) * 4,
              (Math.random() - 0.5) * 3,
              -1 - Math.random() * 2
            ]}>
              <sphereGeometry args={[0.02, 4, 4]} />
              <meshStandardMaterial color="#C97B5A" transparent opacity={0.3} />
            </mesh>
          </Float>
        ))}
        
        {/* Grid floor for depth */}
        <gridHelper args={[8, 12, "#C97B5A", "#5D4037"]} position={[0, -1.2, -0.5]} />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.3}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
};

// --- Main About Page Component ---
const AboutPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);
  const storyRef = useRef(null);
  const valuesRef = useRef(null);
  const teamRef = useRef(null);
  const contactRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative bg-black text-white overflow-x-hidden min-h-screen">
      {/* 3D Background Scene */}
      <AboutScene3D />
      
      {/* Overlay Content */}
      <div className="relative z-10">
        
        {/* Header */}
        <Header 
          scrolled={scrolled}
          scrollToSection={scrollToSection}
          heroRef={heroRef}
          aboutRef={storyRef}
          menuRef={valuesRef}
          contactRef={contactRef}
        />

        {/* Hero Section */}
        <section ref={heroRef} className="min-h-screen flex items-center justify-center text-center px-4 pt-20">
          <div className="animate-fade-in-up max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
              Our Story
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Every cup of coffee has a story. At BrewHeaven, we've crafted a tale of passion, 
              dedication, and the pursuit of perfection in every single brew.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <button 
                onClick={() => scrollToSection(storyRef)}
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                Discover Our Journey
              </button>
              <button 
                onClick={() => scrollToSection(teamRef)}
                className="border border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-black px-8 py-3 rounded-full text-lg font-semibold transition-all"
              >
                Meet Our Team
              </button>
            </div>
          </div>
        </section>

       
        {/* Meet Our Team Section */}
 <section ref={teamRef} className="py-24 px-6 bg-gradient-to-t from-gray-900/80 to-black/80 backdrop-blur-sm">
  <div className="container mx-auto max-w-6xl">
    <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-amber-400">Meet Our Team</h2>
    
    <div className="flex flex-wrap justify-center gap-10 md:gap-16">
      {[
        { name: "Atish Ghanekar", role: "Master Roaster & Founder", img: atishImg },
        { name: "Shresha Ghadi", role: "Head Barista", img: shreshaImg },
      ].map((member, idx) => (
        <div key={idx} className="group text-center transform hover:scale-105 transition-all duration-500">
          <div className="relative w-40 h-40 md:w-48 md:h-48 mx-auto rounded-full overflow-hidden mb-4 shadow-xl border-2 border-amber-500/30 group-hover:border-amber-500 transition-colors">
            <img 
              src={member.img} 
              alt={member.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          </div>
          <h3 className="text-xl font-bold text-white">{member.name}</h3>
          <p className="text-amber-400 text-sm">{member.role}</p>
        </div>
      ))}
    </div>

  </div>
</section>
        {/* Testimonials / Quote Section */}
        <section className="py-20 px-6 bg-black/50 backdrop-blur-sm">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="text-6xl text-amber-400 mb-6">"</div>
            <blockquote className="text-3xl md:text-4xl font-light italic leading-relaxed text-gray-300">
              BrewHeaven isn't just where I get my coffee; it's where I start my day. The atmosphere, 
              the people, and the perfect cup of coffee make it my home away from home.
            </blockquote>
            <cite className="block mt-6 text-amber-300 text-lg">— Sarah K., Regular Customer</cite>
          </div>
        </section>

        {/* Visit / Contact Section */}
        <section ref={contactRef} className="py-24 px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="bg-gray-900/80 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-700/50">
              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <h3 className="text-3xl font-bold text-amber-400 mb-4">Visit BrewHeaven</h3>
                  <p className="text-gray-300 mb-6">Come experience the magic for yourself. Whether you're a coffee connoisseur or just beginning your journey, we have a seat waiting for you.</p>
                  <div className="space-y-3 text-gray-300">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>97 Coffee Lane , Andheri , Mumbai , CA 94103</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Open Daily: 7:00 AM - 9:00 PM</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>+91 98292 28326</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-amber-400 mb-4">Subscribe to Updates</h3>
                  <p className="text-gray-300 mb-6">Be the first to know about new blends, seasonal specials, and exclusive events.</p>
                  <div className="flex flex-col gap-4">
                    <input 
                      type="email" 
                      placeholder="Your email address" 
                      className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:border-amber-500 text-white transition-colors"
                    />
                    <button className="bg-amber-600 hover:bg-amber-700 px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105">
                      Subscribe Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        
      </div>

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 1s ease-out; }
        .animate-slide-in-left { animation: slideInLeft 0.8s ease-out; }
        .animate-slide-in-right { animation: slideInRight 0.8s ease-out; }
      `}</style>
    </div>
  );
};

export default AboutPage;