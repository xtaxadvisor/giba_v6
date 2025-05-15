import React, { useState } from 'react';
import { calculateServicesCost, ServiceRequest, AddonBreakdown } from '../../utils/serviceCalculator';

const ServiceQuote = () => {
  const [quote, setQuote] = useState<any>(null);

  const mockServiceRequest: ServiceRequest[] = [
    {
      type: 'tax-planning',
      hours: 2,
      addons: [
        { name: 'Priority Handling', price: 50, quantity: 1 }
      ]
    }
  ];

  const handleCalculate = () => {
    const result = calculateServicesCost(mockServiceRequest);
    setQuote(result);
  };

  return (
    <div>
      <h2>Service Cost Calculator</h2>
      <button onClick={handleCalculate}>Calculate</button>

      {quote && (
        <div>
          <p>Subtotal: ${quote.subtotal}</p>
          <p>Addons: ${quote.addons}</p>
          <p>Discount: ${quote.discount}</p>
          <p>Total: ${quote.total}</p>

          <h4>Details</h4>
          <ul>
            {quote.details.addonBreakdown.map((addon: AddonBreakdown, idx: number) => (
              <li key={idx}>
                {addon.quantity}x {addon.name} - ${addon.total}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ServiceQuote;