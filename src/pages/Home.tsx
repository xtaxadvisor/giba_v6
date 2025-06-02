import React, { useState } from 'react';
import { Hero } from '../components/home/Hero';
import { Features } from '../components/home/Features';
import { FeatureShowcase } from '../components/home/FeatureShowcase';
import { TrustIndicators } from '../components/home/TrustIndicators';
import { Testimonials } from '../components/home/Testimonials';
import { Subscriptions } from '../components/home/Subscriptions';
import { AboutUs } from '../components/home/AboutUs';
import { Contact } from '../components/home/Contact';
import { Header } from '../components/layout/Header';
import BookingModal from '../components/booking/BookingModal';
import PricingCards from '../components/pricing/PricingCards';
import { JenniferWidget } from '@/components/ai/JenniferWidget';


export default function Home() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');

  const handleBookNow = (serviceType: string) => {
    setSelectedService(serviceType);
    setBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setBookingModalOpen(false);
    setSelectedService('');
  };

  return (
    <>
      <Header />
      <main>
        <Hero onBookNow={handleBookNow} />
        <PricingCards />
        <Features />
        <FeatureShowcase />
        <Subscriptions />
        <TrustIndicators />
        <Testimonials />
        <AboutUs />
        <Contact />
         <JenniferWidget />
      </main>
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={closeBookingModal}
        serviceType={selectedService}
      />
  
    </>
  );
}