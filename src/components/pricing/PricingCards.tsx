import React from 'react';
import { ServiceCard } from '../booking/ServiceCard';

const services = [
  {
    title: 'Tax Planning',
    basePrice: 200,
    hourlyRate: 150,
    minimumHours: 1,
    features: ['Custom strategies', 'Audit readiness', 'Annual tax projections'],
  },
  {
    title: 'Financial Review',
    basePrice: 150,
    hourlyRate: 125,
    minimumHours: 1,
    features: ['Spending analysis', 'Debt planning', 'Savings targets'],
  },
  {
    title: 'Investment Advisory',
    basePrice: 250,
    hourlyRate: 175,
    minimumHours: 1.5,
    features: ['Portfolio review', 'Risk assessment', 'Goal-based planning'],
  },
  {
    title: 'Business Consulting',
    basePrice: 300,
    hourlyRate: 200,
    minimumHours: 2,
    features: ['Entity structure', 'Profit growth plans', 'Compliance consulting'],
  },
];

const PricingCards: React.FC = () => {
  return (
    <section className="py-10 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
          Request Your Consultation Now!
        </h2>
        <div className="flex flex-wrap lg:flex-nowrap justify-center gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              basePrice={service.basePrice}
              hourlyRate={service.hourlyRate}
              minimumHours={service.minimumHours}
              features={service.features}
              onBook={() => console.log(`Book ${service.title}`)}
              description={`Professional ${service.title} service`}
              price={service.basePrice.toString()}
              duration={service.minimumHours.toString()}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingCards;