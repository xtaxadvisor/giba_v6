import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useNotificationStore } from '../../lib/store';
import { useState } from 'react';
import type { SubscriptionPlan } from '../../types/subscription';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SubscriptionPlan;
  onSubscribe: (paymentMethodId: string) => Promise<void>;
}

export function SubscriptionModal({ isOpen, onClose, plan, onSubscribe }: SubscriptionModalProps) {
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const { addNotification } = useNotificationStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real implementation, you would tokenize the card details
      // and only send the token to your server
      const mockPaymentMethodId = 'pm_' + Date.now();
      await onSubscribe(mockPaymentMethodId);
      onClose();
      addNotification('Subscription successful!', 'success');
    } catch (error) {
      addNotification(
        error instanceof Error ? error.message : 'Subscription failed',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Subscribe to ${plan.name}`}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Payment Details</h3>
          <p className="mt-1 text-sm text-gray-500">
            You will be charged ${plan.price} per {plan.interval}
          </p>
        </div>

        <Input
          label="Card Number"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
          maxLength={16}
          placeholder="1234 5678 9012 3456"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Expiry Date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            placeholder="MM/YY"
            maxLength={5}
            required
          />
          <Input
            label="CVC"
            value={cvc}
            onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
            maxLength={4}
            type="password"
            required
          />
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Subscribe'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
