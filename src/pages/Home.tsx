import React, { useState } from 'react';
import { Hero } from '../components/home/Hero';
import Services from '../components/home/Services';
import { Features } from '../components/home/Features';
import { FeatureShowcase } from '../components/home/FeatureShowcase';
import { TrustIndicators } from '../components/home/TrustIndicators';
import { Testimonials } from '../components/home/Testimonials';
import { Subscriptions } from '../components/home/Subscriptions';
import { AboutUs } from '../components/home/AboutUs';
import { Contact } from '../components/home/Contact';
import { Header } from '../components/layout/Header';
import { AIAssistantWidget } from '../components/ai/AIAssistantWidget';
import BookingModal from '../components/booking/BookingModal';

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
        <Services onBookNow={handleBookNow} />
        <Features />
        <FeatureShowcase />
        <Subscriptions />
        <TrustIndicators />
        <Testimonials />
        <AboutUs />
        <Contact />
      </main>
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={closeBookingModal}
        serviceType={selectedService}
      />
      <AIAssistantWidget />
    </>
  );
}