// HomePage.jsx
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text3D, Float } from '@react-three/drei';
import * as THREE from 'three';
import Header from '../components/Header'; // Adjust path as needed
import Footer from '../components/Footer'; // Adjust path as needed

// --- 3D Coffee Cup Component ---
const CoffeeCup = () => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
      meshRef.current.rotation.z = Math.cos(state.clock.getElapsedTime() * 0.4) * 0.05;
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.05;
    }
  });

  return (
    <group ref={meshRef} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      {/* Cup Body */}
      <mesh position={[0, -0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 0.6, 1, 32]} />
        <meshStandardMaterial color={hovered ? "#8B5A2B" : "#D2B48C"} roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Cup Handle */}
      <mesh position={[0.9, -0.2, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.3, 0.08, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#D2B48C" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Coffee Liquid */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.75, 0.75, 0.1, 32]} />
        <meshStandardMaterial color="#3E2723" roughness={0.1} metalness={0.4} />
      </mesh>
      {/* Steam Particles */}
      {[...Array(8)].map((_, i) => (
        <Float key={i} speed={2} rotationIntensity={0} floatIntensity={0.5 + i * 0.1}>
          <mesh position={[(-0.3 + i * 0.1), 0.4 + i * 0.05, 0.2]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#FFFFFF" transparent opacity={0.6} />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

// --- 3D Floating Beans ---
const FloatingBean = ({ position, color, speed }) => {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y += Math.sin(state.clock.getElapsedTime() * speed) * 0.003;
      ref.current.rotation.x += 0.01;
      ref.current.rotation.z += 0.01;
    }
  });
  return (
    <mesh ref={ref} position={position} castShadow>
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} />
    </mesh>
  );
};

// --- Main Scene ---
const Scene3D = () => {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <directionalLight position={[-5, 5, 5]} intensity={0.8} castShadow />
        <spotLight position={[0, 5, 2]} intensity={0.6} castShadow />
        
        {/* Rotating Coffee Cup */}
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
          <CoffeeCup />
        </Float>
        
        {/* Floating Coffee Beans */}
        <FloatingBean position={[-1.5, 1, -1]} color="#4E342E" speed={1.2} />
        <FloatingBean position={[1.8, -0.5, -1.2]} color="#6D4C41" speed={0.8} />
        <FloatingBean position={[0.5, 1.8, -0.8]} color="#3E2723" speed={1.5} />
        <FloatingBean position={[-1.2, -1, -0.5]} color="#5D4037" speed={1.0} />
        <FloatingBean position={[2, 1.2, -1.5]} color="#4E342E" speed={1.3} />
        
        {/* 3D Text "BrewHeaven" */}
        <Text3D
          font="https://threejs.org/examples/fonts/helvetiker_regular.typeface.json"
          size={0.6}
          height={0.1}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelSegments={5}
          position={[-1.8, 1.2, -2]}
        >
          BrewHeaven
          <meshStandardMaterial color="#C97B5A" metalness={0.9} roughness={0.2} />
        </Text3D>
        
        {/* Decorative Floor Grid */}
        <gridHelper args={[10, 20, "#C97B5A", "#5D4037"]} position={[0, -1.5, -2]} />
        
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
};

// --- Main Home Page Component ---
const HomePage = () => {
  const [scrolled, setScrolled] = useState(false);
  const videoRef = useRef(null);
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const menuRef = useRef(null);
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
    <div className="relative bg-black text-white overflow-x-hidden">
      {/* 3D Canvas Background */}
      <Scene3D />
      
      {/* Overlay Content */}
      <div className="relative z-10">
        
        {/* Header Component */}
        <Header 
          scrolled={scrolled}
          scrollToSection={scrollToSection}
          heroRef={heroRef}
          aboutRef={aboutRef}
          menuRef={menuRef}
          contactRef={contactRef}
        />

        {/* Hero Section */}
        <section ref={heroRef} className="min-h-screen flex items-center justify-center text-center px-4">
          <div className="animate-fade-in-up">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300 bg-clip-text text-transparent">
              BrewHeaven
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-10">
              Experience the perfect blend of artisanal coffee and heavenly ambiance.
              <br />Where every sip takes you to cloud nine.
            </p>
            <button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-lg">
              Explore Our Menu
            </button>
          </div>
        </section>

        {/* Video Background Section */}
        <div className="relative w-full h-[60vh] overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover"
            poster="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-pouring-coffee-into-a-cup-2212-large.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center animate-pulse-slow">
              <h2 className="text-4xl md:text-6xl font-bold mb-4">Watch the Magic</h2>
              <p className="text-xl">Artisan coffee crafted with passion and precision.</p>
            </div>
          </div>
        </div>

        {/* About Section */}
        <section ref={aboutRef} className="py-24 px-6 bg-gradient-to-b from-black to-gray-900">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-slide-in-left">
                <h2 className="text-4xl md:text-5xl font-bold">Our Story</h2>
                <div className="w-24 h-1 bg-amber-500 rounded-full"></div>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Founded in 2020, BrewHeaven began as a dream to create a sanctuary for coffee lovers. 
                  We source only the finest beans from sustainable farms around the world, roasting them 
                  to perfection in small batches. Our skilled baristas transform each bean into liquid art, 
                  crafting drinks that delight the senses and warm the soul.
                </p>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Every cup tells a story of dedication, craftsmanship, and love for the perfect brew.
                </p>
                <button className="border border-amber-500 text-amber-400 px-6 py-2 rounded-full hover:bg-amber-500 hover:text-black transition-all">
                  Learn More
                </button>
              </div>
              <div className="relative animate-slide-in-right">
                <img 
                  src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=2070" 
                  alt="Coffee beans and brewing"
                  className="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute -bottom-5 -right-5 bg-amber-600 p-4 rounded-full shadow-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Menu Section */}
        <section ref={menuRef} className="py-24 px-6 bg-black/50 backdrop-blur-sm">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">Signature Brews</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: "Heavenly Latte", price: "$4.5", desc: "Velvety smooth with a hint of vanilla", img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=2070" },
                { name: "Caramel Cloud", price: "$5.0", desc: "Buttery caramel with whipped cream", img: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=2070" },
                { name: "Mocha Paradise", price: "$5.5", desc: "Rich chocolate espresso blend", img: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4d?q=80&w=2070" }
              ].map((item, idx) => (
                <div key={idx} className="group bg-gray-900/60 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-500 backdrop-blur-sm">
                  <div className="h-48 overflow-hidden">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">{item.name}</h3>
                    <p className="text-gray-400 mb-4">{item.desc}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl text-amber-400 font-bold">{item.price}</span>
                      <button className="bg-amber-600 px-4 py-2 rounded-full text-sm hover:bg-amber-700 transition">Order</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Section with Motion */}
        <section className="py-24 px-6 bg-gradient-to-t from-gray-900 to-black">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">Heavenly Moments</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070",
                "https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=2070",
                "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=2070",
                "https://images.unsplash.com/photo-1498804103071-a0230ba4468d?q=80&w=2070"
              ].map((url, idx) => (
                <div key={idx} className="overflow-hidden rounded-xl shadow-xl animate-float-slow" style={{ animationDelay: `${idx * 0.2}s` }}>
                  <img src={url} alt={`Gallery ${idx}`} className="w-full h-64 object-cover hover:scale-110 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section ref={contactRef} className="py-24 px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Find Your Heaven</h2>
            <p className="text-xl text-gray-400 mb-12">123 Coffee Lane, Brewtown | Open Daily 7am - 9pm</p>
            <div className="bg-gray-900/60 backdrop-blur-md p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-6">Subscribe for Heavenly Offers</h3>
              <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
                <input type="email" placeholder="Your email address" className="flex-1 px-4 py-3 rounded-full bg-gray-800 border border-gray-700 focus:outline-none focus:border-amber-500" />
                <button className="bg-amber-600 hover:bg-amber-700 px-6 py-3 rounded-full font-semibold transition">Subscribe</button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer/>
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
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulseSlow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-fade-in-up { animation: fadeInUp 1s ease-out; }
        .animate-slide-in-left { animation: slideInLeft 0.8s ease-out; }
        .animate-slide-in-right { animation: slideInRight 0.8s ease-out; }
        .animate-float-slow { animation: floatSlow 4s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulseSlow 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default HomePage;