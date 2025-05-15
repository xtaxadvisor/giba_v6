import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero } from '../components/home/Hero';
import Services from '../components/home/Services';
import { Features } from '../components/home/Features';
import { FeatureShowcase } from '../components/home/FeatureShowcase';
import ServiceQuote from '../components/quotes/ServiceQuote';
import { TrustIndicators } from '../components/home/TrustIndicators';
import { Testimonials } from '../components/home/Testimonials';
import { Subscriptions } from '../components/home/Subscriptions';
import { AboutUs } from '../components/home/AboutUs';
import { Contact } from '../components/home/Contact';
import { Header } from '../components/layout/Header';
import { AIAssistantWidget } from '../components/ai/AIAssistantWidget';
import PricingCards from '../components/pricing/PricingCards'; // Verify the file exists or create it if missing

export default function Home() {
  const navigate = useNavigate();

  const handleBookNow = (serviceType: string) => {
    // Store selected service for redirect after login
    sessionStorage.setItem('preferredService', serviceType);
    // Navigate to login page to authenticate user before booking
    navigate('/login');
  };

  return (
    <>
      <Header />
      <main>
        <Hero onBookNow={handleBookNow} />
        <PricingCards />
        <Features />
        <FeatureShowcase />
        <ServiceQuote />
        <Subscriptions />
        <TrustIndicators />
        <Testimonials />
        <AboutUs />
        <Contact />
      </main>
      <AIAssistantWidget />
    </>
  );
}