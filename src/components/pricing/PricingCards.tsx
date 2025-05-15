import React from 'react';

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
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-6 w-full md:w-1/4 text-center border border-gray-200"
            >
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-2xl font-bold text-blue-700 mb-2">
                ${service.basePrice.toFixed(2)} + ${service.hourlyRate.toFixed(2)}/hr
              </p>
              <p className="text-sm text-gray-500 mb-4">Min {service.minimumHours} hrs</p>
              <ul className="text-sm text-gray-600 mb-4">
                {service.features.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
              <button className="mt-auto bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                Book Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingCards;