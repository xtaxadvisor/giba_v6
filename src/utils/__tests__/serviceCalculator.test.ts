import { describe, it, expect } from 'vitest';
import {
  calculateServicesCost,
  ServiceTypes,
  type ServiceRequest
} from '../serviceCalculator';

describe('serviceCalculator', () => {
  it('calculates basic service cost correctly', () => {
    const services: ServiceRequest[] = [{
      type: ServiceTypes.TAX_PLANNING,
      hours: 2
    }];

    const result = calculateServicesCost(services);
    expect(result.total).toBeGreaterThan(0);
    expect(result.details.basePrice).toBe(200);
    expect(result.details.hourlyCharges).toBe(300); // 2 hours * $150
  });

  it('applies minimum hours when not specified', () => {
    const services: ServiceRequest[] = [{
      type: ServiceTypes.TAX_PLANNING
    }];

    const result = calculateServicesCost(services);
    expect(result.details.hourlyCharges).toBe(150); // 1 hour minimum * $150
  });

  it('calculates multiple services correctly', () => {
    const services: ServiceRequest[] = [
      {
        type: ServiceTypes.TAX_PLANNING,
        hours: 2
      },
      {
        type: ServiceTypes.FINANCIAL_REVIEW,
        hours: 1
      }
    ];

    const result = calculateServicesCost(services);
    // Tax Planning: $200 (base) + $300 (2hrs * $150)
    // Financial Review: $150 (base) + $125 (1hr * $125)
    expect(result.subtotal).toBe(775); // 500 + 275
  });

  it('applies quantity multiplier correctly', () => {
    const services: ServiceRequest[] = [{
      type: ServiceTypes.TAX_PLANNING,
      hours: 1,
      quantity: 2
    }];

    const result = calculateServicesCost(services);
    expect(result.subtotal).toBe(700); // (200 + 150) * 2
  });

  it('calculates addons correctly', () => {
    const services: ServiceRequest[] = [{
      type: ServiceTypes.TAX_PLANNING,
      hours: 1,
      addons: [
        { name: 'Rush Processing', price: 50 },
        { name: 'Document Review', price: 75, quantity: 2 }
      ]
    }];

    const result = calculateServicesCost(services);
    expect(result.addons).toBe(200); // 50 + (75 * 2)
  });

  it('applies discounts correctly', () => {
    const services: ServiceRequest[] = [{
      type: ServiceTypes.BUSINESS_CONSULTING,
      hours: 10 // High value to trigger discount
    }];

    const result = calculateServicesCost(services);
    expect(result.discount).toBeGreaterThan(0);
  });

  it('handles invalid input gracefully', () => {
    const services: any[] = [{
      type: 'invalid-service',
      hours: -1
    }];

    expect(() => calculateServicesCost(services)).toThrow();
  });

  it('rounds monetary values correctly', () => {
    const services: ServiceRequest[] = [{
      type: ServiceTypes.TAX_PLANNING,
      hours: 1.5
    }];

    const result = calculateServicesCost(services);
    expect(Number.isInteger(result.total * 100)).toBe(true); // Check for 2 decimal places
  });
});