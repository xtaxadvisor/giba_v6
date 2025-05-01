import React from 'react';
import { Subscriptions } from '@/components/home/Subscriptions';

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Choose Your Plan
        </h1>
        <Subscriptions />
      </div>
    </main>
  );
}