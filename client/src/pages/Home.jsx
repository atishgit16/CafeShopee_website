// src/pages/Home.jsx
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text3D, Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
  Coffee, 
  ShoppingBag, 
  Star, 
  ArrowRight, 
  Sparkles, 
  Flame, 
  Leaf, 
  Heart, 
  Users, 
  Clock, 
  MapPin,
  ChevronRight,
  Play,
  Award,
  Zap,
  Ticket, 
  Percent, 
  Gift, 
  Copy,
  CheckCircle2
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import toast from 'react-hot-toast';

// --- 3D Coffee Cup with Enhanced Design ---
const PremiumCoffeeCup = () => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.05;
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.08;
    }
  });

  return (
    <group ref={meshRef} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      {/* Cup Body with Gradient Effect */}
      <mesh position={[0, -0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 0.5, 1.2, 64]} />
        <meshPhysicalMaterial 
          color={hovered ? "#C97B5A" : "#E8D5B7"} 
          roughness={0.1} 
          metalness={0.7}
          clearcoat={0.3}
          clearcoatRoughness={0.2}
        />
      </mesh>
      
      {/* Cup Handle */}
      <mesh position={[0.9, -0.2, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.3, 0.08, 16, 32, Math.PI]} />
        <meshPhysicalMaterial color="#E8D5B7" metalness={0.8} roughness={0.1} />
      </mesh>
      
      {/* Coffee Liquid with Realistic Shine */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.72, 0.72, 0.08, 64]} />
        <meshPhysicalMaterial 
          color="#3E2723" 
          roughness={0.05} 
          metalness={0.5}
          clearcoat={0.8}
        />
      </mesh>
      
      {/* Foam Art */}
      <mesh position={[0, 0.1, 0]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshPhysicalMaterial color="#F5E6D3" transparent opacity={0.4} roughness={0.8} />
      </mesh>
      <mesh position={[0.15, 0.08, 0.15]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshPhysicalMaterial color="#F5E6D3" transparent opacity={0.3} roughness={0.8} />
      </mesh>
      <mesh position={[-0.1, 0.07, -0.1]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshPhysicalMaterial color="#F5E6D3" transparent opacity={0.3} roughness={0.8} />
      </mesh>
      
      {/* Steam Particles - Enhanced */}
      {[...Array(12)].map((_, i) => (
        <Float key={i} speed={1.5 + i * 0.2} rotationIntensity={0} floatIntensity={1 + i * 0.1}>
          <mesh position={[(-0.25 + i * 0.05), 0.5 + i * 0.03, 0.1]}>
            <sphereGeometry args={[0.03 + i * 0.002, 8, 8]} />
            <meshPhysicalMaterial color="#FFFFFF" transparent opacity={0.4 - i * 0.02} />
          </mesh>
        </Float>
      ))}
      
      {/* Gold Rim */}
      <mesh position={[0, 0.15, 0]}>
        <torusGeometry args={[0.72, 0.02, 16, 64]} />
        <meshPhysicalMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
};

// --- Floating Coffee Beans with Animation ---
const AnimatedBean = ({ position, color, speed, size }) => {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y += Math.sin(state.clock.getElapsedTime() * speed) * 0.002;
      ref.current.rotation.x += 0.008;
      ref.current.rotation.z += 0.008;
      ref.current.rotation.y += 0.005;
    }
  });
  return (
    <mesh ref={ref} position={position} castShadow>
      <sphereGeometry args={[size || 0.12, 16, 16]} />
      <meshPhysicalMaterial 
        color={color} 
        roughness={0.3} 
        metalness={0.4}
        clearcoat={0.2}
      />
    </mesh>
  );
};

// --- 3D Scene with Premium Design ---
const PremiumScene3D = () => {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas 
        shadows={{ type: THREE.PCFSoftShadowMap }} 
        camera={{ position: [0, 0.5, 5], fov: 45 }}
      >
        <color attach="background" args={['#0a0a0a']} />
        <fog attach="fog" args={['#0a0a0a', 5, 8]} />
        
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={2} castShadow />
        <directionalLight position={[-3, 5, 5]} intensity={1.5} castShadow />
        <spotLight position={[0, 8, 2]} intensity={2} castShadow />
        
        {/* Premium Coffee Cup */}
        <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.6}>
          <PremiumCoffeeCup />
        </Float>
        
        {/* Floating Beans - Scattered */}
        <AnimatedBean position={[-2, 1.5, -1.5]} color="#4E342E" speed={1.2} size={0.15} />
        <AnimatedBean position={[2.2, -0.8, -1.8]} color="#6D4C41" speed={0.8} size={0.13} />
        <AnimatedBean position={[0.8, 2.2, -1.2]} color="#3E2723" speed={1.5} size={0.14} />
        <AnimatedBean position={[-1.8, -1.2, -1]} color="#5D4037" speed={1.0} size={0.12} />
        <AnimatedBean position={[2.5, 1.8, -2]} color="#4E342E" speed={1.3} size={0.16} />
        <AnimatedBean position={[-0.8, -1.8, -2.2]} color="#6D4C41" speed={0.9} size={0.11} />
        <AnimatedBean position={[1.5, 0.5, -2.5]} color="#3E2723" speed={1.4} size={0.13} />
        
        {/* 3D Text with Glow */}
        <Text3D
          font="https://threejs.org/examples/fonts/helvetiker_bold.typeface.json"
          size={0.5}
          height={0.1}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelSegments={5}
          position={[-2, 1.8, -2.5]}
        >
          BrewHeaven
          <meshPhysicalMaterial 
            color="#C97B5A" 
            metalness={0.9} 
            roughness={0.1}
            clearcoat={0.5}
            emissive="#C97B5A"
            emissiveIntensity={0.1}
          />
        </Text3D>
        
        {/* Decorative Elements */}
        <mesh position={[0, -1.2, -1]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.5, 2.8, 64]} />
          <meshPhysicalMaterial color="#C97B5A" transparent opacity={0.08} metalness={0.5} />
        </mesh>
        <mesh position={[0, -1.2, -1.5]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.8, 3.1, 64]} />
          <meshPhysicalMaterial color="#E8D5B7" transparent opacity={0.05} metalness={0.3} />
        </mesh>
        
        {/* Floating Particles */}
        {[...Array(50)].map((_, i) => (
          <Float key={i} speed={0.5 + i * 0.02} floatIntensity={0.3}>
            <mesh position={[
              (Math.random() - 0.5) * 6,
              (Math.random() - 0.5) * 4,
              -2 - Math.random() * 3
            ]}>
              <sphereGeometry args={[0.015, 4, 4]} />
              <meshPhysicalMaterial 
                color={i % 2 === 0 ? "#C97B5A" : "#E8D5B7"} 
                transparent opacity={0.3} 
              />
            </mesh>
          </Float>
        ))}
        
        {/* Floor Grid */}
        <gridHelper args={[10, 20, "#C97B5A", "#3E2723"]} position={[0, -1.5, -1]} />
        
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

// --- Parallax Section Component ---
const ParallaxSection = ({ children, speed = 0.5 }) => {
  const ref = useRef();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100]);
  
  return (
    <motion.div ref={ref} style={{ y }}>
      {children}
    </motion.div>
  );
};

// --- Main Home Page Component ---
const HomePage = () => {
  console.log('API URL:', import.meta.env.VITE_API_URL);

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coupons, setCoupons] = useState([]);
  const [couponLoading, setCouponLoading] = useState(true);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const videoRef = useRef(null);
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const menuRef = useRef(null);
  const contactRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCoupons();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Fetch products error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCoupons = async () => {
    try {
      const response = await axios.get(`${API_URL}/coupons`);
      setCoupons(response.data);
    } catch (error) {
      console.error('Fetch coupons error:', error);
    } finally {
      setCouponLoading(false);
    }
  };

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleExploreMenu = () => {
    if (isAuthenticated) {
      navigate('/menu');
    } else {
      navigate('/login');
    }
  };

  const handleCopyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Coupon code copied!');
  };

  const handleApplyCoupon = (coupon) => {
    localStorage.setItem('appliedCoupon', JSON.stringify(coupon));
    toast.success(`Coupon ${coupon.code} applied!`);
    setShowCouponModal(false);
  };

  return (
    <div className="relative bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* 3D Canvas Background */}
      <PremiumScene3D />
      
      {/* Overlay Content */}
      <div className="relative z-10">
        
        {/* Hero Section - Premium */}
        <section ref={heroRef} className="min-h-screen flex items-center justify-center text-center px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a] z-0"></div>
          <div className="relative z-10 max-w-4xl animate-fade-in-up">
            
            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
                BrewHeaven
              </span>
              <br />
              <span className="text-4xl md:text-6xl text-gray-400 font-light">
                Where Coffee Meets Culture
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Experience the perfect blend of artisanal coffee and heavenly ambiance.
              <br />Every cup tells a story, every sip takes you to cloud nine.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={handleExploreMenu}
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-lg shadow-amber-500/20 flex items-center gap-2"
              >
                <Coffee className="w-5 h-5" />
                Explore Our Menu
              </button>
              <button 
                onClick={() => scrollToSection(aboutRef)}
                className="border border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-black px-8 py-3 rounded-full text-lg font-semibold transition-all flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Watch Our Story
              </button>
            </div>
            <div className="mt-12 flex items-center justify-center gap-8 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Award Winning</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Small Batch Roasted</span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-amber-400" />
                <span>Sustainably Sourced</span>
              </div>
            </div>
          </div>
        </section>

        {/* Video Background Section - Cinematic */}
        <div className="relative w-full h-[80vh] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a] z-10"></div>
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover scale-105"
            poster="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-pouring-coffee-into-a-cup-2212-large.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs mb-4">
                <Zap className="w-3 h-3" />
                <span>Cinematic Experience</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                Watch the Magic
              </h2>
              <p className="text-xl text-gray-300">Artisan coffee crafted with passion and precision.</p>
            </div>
          </div>
        </div>

        {/* About Section - Cultural Fusion */}
        <ParallaxSection speed={0.3}>
          <section ref={aboutRef} className="py-24 px-6 bg-gradient-to-b from-[#0a0a0a] to-[#111]">
            <div className="container mx-auto max-w-6xl">
              <div className="grid md:grid-cols-2 gap-16 items-center">
                <div className="space-y-6 animate-slide-in-left relative">
                  <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs">
                    <Heart className="w-3 h-3" />
                    <span>Our Story</span>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                    <span className="text-white">A Fusion of</span>
                    <br />
                    <span className="bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
                      Culture & Coffee
                    </span>
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"></div>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Founded in 2020, BrewHeaven began as a dream to create a sanctuary where 
                    coffee culture meets artistic expression. We source only the finest beans 
                    from sustainable farms worldwide, roasting them to perfection in small batches.
                  </p>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Every cup tells a story of dedication, craftsmanship, and love for the perfect brew.
                  </p>
                  <button 
                    onClick={() => navigate("/About")}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2"
                  >
                    Discover Our Journey <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="relative animate-slide-in-right">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-700">
                      <img 
                        src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=2070" 
                        alt="Coffee beans"
                        className="w-full h-64 object-cover"
                      />
                    </div>
                    <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-700 mt-12">
                      <img 
                        src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070" 
                        alt="Coffee brewing"
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  </div>
                  <div className="absolute -bottom-6 -right-6 bg-amber-600 p-5 rounded-full shadow-xl">
                    <Coffee className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ParallaxSection>

        {/* Menu Section - Premium Grid */}
        <section ref={menuRef} className="py-24 px-6 bg-gradient-to-b from-[#111] to-[#0a0a0a]">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs mb-4">
                <Flame className="w-3 h-3" />
                <span>Signature Collection</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-200 to-amber-600 bg-clip-text text-transparent">
                Heavenly Brews
              </h2>
              <p className="text-xl text-gray-400 mt-4">Each cup is crafted with passion and precision</p>
            </div>
            
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-2 border-amber-500 border-t-transparent"></div>
                <p className="mt-4 text-gray-400">Loading our premium blends...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <Coffee className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400">Our menu is being crafted. Check back soon!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-8">
                {products.slice(0, 6).map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative bg-gradient-to-b from-gray-900 to-black rounded-3xl overflow-hidden hover:scale-105 transition-all duration-500 border border-gray-800 hover:border-amber-500/30"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                      <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span>{product.rating || 4.5}</span>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-amber-600/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                          {product.category || "Premium"}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold mb-2 group-hover:text-amber-400 transition-colors">{product.name}</h3>
                      <p className="text-gray-400 mb-4 line-clamp-2 text-sm">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl text-amber-400 font-bold">₹{product.price.toFixed(2)}</span>
                        <button 
                          onClick={() => isAuthenticated ? navigate('/cart') : navigate('/login')}
                          className="bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 hover:scale-105"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          Order
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            
            {products.length > 6 && (
              <div className="text-center mt-12">
                <button 
                  onClick={() => navigate('/menu')}
                  className="bg-transparent border border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-black px-8 py-3 rounded-full font-semibold transition-all flex items-center gap-2 mx-auto"
                >
                  View All Brews <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Coupon & Offers Section */}
        <section className="py-24 px-6 bg-gradient-to-b from-[#0a0a0a] to-[#111]">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs mb-4">
                <Gift className="w-3 h-3" />
                <span>Exclusive Offers</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-200 to-amber-400 bg-clip-text text-transparent">
                Heavenly Deals
              </h2>
              <p className="text-xl text-gray-400 mt-4">Unlock amazing discounts and combo offers</p>
            </div>

            {couponLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-2 border-green-500 border-t-transparent"></div>
                <p className="mt-4 text-gray-400">Loading offers...</p>
              </div>
            ) : coupons.length === 0 ? (
              <div className="text-center py-12">
                <Ticket className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400">No active offers right now. Check back soon!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coupons.map((coupon, index) => (
                  <motion.div
                    key={coupon._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative bg-gradient-to-br from-gray-900 to-black rounded-3xl overflow-hidden hover:scale-105 transition-all duration-500 border border-gray-800 hover:border-green-500/30"
                  >
                    {/* Coupon Image */}
                    <div className="relative h-40 overflow-hidden">
                      <img 
                        src={coupon.image || 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=2070'} 
                        alt={coupon.code}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                      <div className="absolute top-4 right-4 bg-green-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white">
                        {coupon.type === 'percentage' && `${coupon.value}% OFF`}
                        {coupon.type === 'fixed' && `₹${coupon.value} OFF`}
                        {coupon.type === 'combo' && 'COMBO'}
                        {coupon.type === 'free_delivery' && 'FREE DELIVERY'}
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center justify-between">
                          <span className="text-white font-bold text-lg">{coupon.code}</span>
                          <button
                            onClick={() => handleCopyCoupon(coupon.code)}
                            className="bg-gray-800/80 hover:bg-gray-700 px-3 py-1 rounded-full text-xs text-white transition-colors flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3" />
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-bold mb-2">{coupon.description}</h3>
                      <div className="space-y-2 text-sm text-gray-400">
                        {coupon.minOrderAmount > 0 && (
                          <p className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                            Min. order: ₹{coupon.minOrderAmount}
                          </p>
                        )}
                        {coupon.maxDiscount > 0 && (
                          <p className="flex items-center gap-2">
                            <Percent className="w-4 h-4 text-amber-400" />
                            Max discount: ₹{coupon.maxDiscount}
                          </p>
                        )}
                        <p className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-400" />
                          Valid till: {new Date(coupon.validUntil).toLocaleDateString()}
                        </p>
                        {coupon.usageLimit > 0 && (
                          <p className="text-xs text-gray-500">
                            {coupon.usageLimit - coupon.usedCount} remaining
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          if (isAuthenticated) {
                            handleApplyCoupon(coupon);
                          } else {
                            navigate('/login');
                          }
                        }}
                        className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded-full text-sm font-semibold transition-all flex items-center justify-center gap-2 hover:scale-105"
                      >
                        <Ticket className="w-4 h-4" />
                        Apply Coupon
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>



        {/* Contact Section - Premium */}
        <section ref={contactRef} className="py-24 px-6 bg-gradient-to-b from-[#0a0a0a] to-[#000]">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs mb-4">
              <MapPin className="w-3 h-3" />
              <span>Visit Us</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-200 to-amber-600 bg-clip-text text-transparent">
              Find Your Heaven
            </h2>
            <p className="text-xl text-gray-400 mb-8">123 Coffee Lane, Brewtown | Open Daily 7am - 9pm</p>
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
              <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-2xl border border-gray-800 hover:border-amber-500/30 transition-colors">
                <Users className="w-8 h-8 mx-auto text-amber-400 mb-3" />
                <h3 className="font-bold">Community</h3>
                <p className="text-sm text-gray-400">Join our coffee community</p>
              </div>
              <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-2xl border border-gray-800 hover:border-amber-500/30 transition-colors">
                <Clock className="w-8 h-8 mx-auto text-amber-400 mb-3" />
                <h3 className="font-bold">Daily Fresh</h3>
                <p className="text-sm text-gray-400">Freshly brewed every day</p>
              </div>
              <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-2xl border border-gray-800 hover:border-amber-500/30 transition-colors">
                <Heart className="w-8 h-8 mx-auto text-amber-400 mb-3" />
                <h3 className="font-bold">Made with Love</h3>
                <p className="text-sm text-gray-400">Crafted with passion</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-gray-900 to-black backdrop-blur-md p-8 rounded-3xl border border-gray-800">
              <h3 className="text-2xl font-bold mb-6">Subscribe for Heavenly Offers</h3>
              <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
                <input type="email" placeholder="Your email address" className="flex-1 px-4 py-3 rounded-full bg-gray-800 border border-gray-700 focus:outline-none focus:border-amber-500" />
                <button className="bg-amber-600 hover:bg-amber-700 px-6 py-3 rounded-full font-semibold transition-all hover:scale-105">Subscribe</button>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Custom CSS Animations */}
      <style>{`
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