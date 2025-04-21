export const ServiceTypes = {
  TAX_PLANNING: 'tax-planning',
  FINANCIAL_REVIEW: 'financial-review',
  INVESTMENT_ADVISORY: 'investment-advisory', 
  BUSINESS_CONSULTING: 'business-consulting',
  TAX_PREPARATION: 'tax-preparation'
} as const;

export type ServiceType = typeof ServiceTypes[keyof typeof ServiceTypes];

interface ServicePriceConfig {
  basePrice: number;
  hourlyRate: number;
  minimumHours: number;
}

export interface ServiceRequest {
  type: ServiceType;
  hours?: number;
  quantity?: number;
  addons?: ServiceAddon[];
}

export interface ServiceAddon {
  name: string;
  price: number;
  quantity?: number;
}

interface CostBreakdown {
  subtotal: number;
  addons: number;
  discount: number;
  total: number;
  details: {
    basePrice: number;
    hourlyCharges: number;
    addonBreakdown: Array<{
      name: string;
      quantity: number;
      price: number;
      total: number;
    }>;
    appliedDiscount: {
      percentage: number;
      amount: number;
    };
  };
}

const ServicePricing: Record<ServiceType, ServicePriceConfig> = {
  [ServiceTypes.TAX_PLANNING]: {
    basePrice: 200.00,
    hourlyRate: 150.00,
    minimumHours: 1
  },
  [ServiceTypes.FINANCIAL_REVIEW]: {
    basePrice: 150.00,
    hourlyRate: 125.00,
    minimumHours: 1
  },
  [ServiceTypes.INVESTMENT_ADVISORY]: {
    basePrice: 250.00,
    hourlyRate: 175.00,
    minimumHours: 1.5
  },
  [ServiceTypes.BUSINESS_CONSULTING]: {
    basePrice: 300.00,
    hourlyRate: 200.00,
    minimumHours: 2
  },
  [ServiceTypes.TAX_PREPARATION]: {
    basePrice: 175.00,
    hourlyRate: 125.00,
    minimumHours: 1
  }
};

const DiscountTiers = [
  { threshold: 5000, percentage: 0.10 },
  { threshold: 2500, percentage: 0.05 },
  { threshold: 1000, percentage: 0.03 }
];

function roundToTwoDecimals(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateServicesCost(services: ServiceRequest[]): CostBreakdown {
  if (!Array.isArray(services) || services.length === 0) {
    throw new Error('At least one service is required');
  }

  let totalBasePrice = 0;
  let totalHourlyCharges = 0;
  let totalAddons = 0;
  const addonBreakdown: CostBreakdown['details']['addonBreakdown'] = [];

  // Calculate base costs
  services.forEach(service => {
    const pricing = ServicePricing[service.type];
    if (!pricing) {
      throw new Error(`Invalid service type: ${service.type}`);
    }

    const quantity = service.quantity || 1;
    const hours = Math.max(service.hours || 0, pricing.minimumHours);

    totalBasePrice += pricing.basePrice * quantity;
    totalHourlyCharges += pricing.hourlyRate * hours * quantity;

    // Calculate addon costs
    if (service.addons) {
      service.addons.forEach(addon => {
        const addonQuantity = addon.quantity || 1;
        const addonTotal = addon.price * addonQuantity;
        totalAddons += addonTotal;

        addonBreakdown.push({
          name: addon.name,
          quantity: addonQuantity,
          price: addon.price,
          total: addonTotal
        });
      });
    }
  });

  const subtotal = totalBasePrice + totalHourlyCharges + totalAddons;

  // Calculate discount
  const applicableDiscount = DiscountTiers.find(tier => subtotal >= tier.threshold);
  const discountPercentage = applicableDiscount?.percentage || 0;
  const discountAmount = roundToTwoDecimals(subtotal * discountPercentage);

  const total = roundToTwoDecimals(subtotal - discountAmount);

  return {
    subtotal: roundToTwoDecimals(subtotal),
    addons: roundToTwoDecimals(totalAddons),
    discount: discountAmount,
    total,
    details: {
      basePrice: roundToTwoDecimals(totalBasePrice),
      hourlyCharges: roundToTwoDecimals(totalHourlyCharges),
      addonBreakdown,
      appliedDiscount: {
        percentage: discountPercentage * 100,
        amount: discountAmount
      }
    }
  };
}