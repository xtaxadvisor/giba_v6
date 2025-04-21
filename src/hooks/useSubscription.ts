import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionService } from '../services/api/subscription';
import { useNotificationStore } from '../lib/store';

export function useSubscription() {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  const { data: plans } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: subscriptionService.getPlans
  });

  const { data: currentSubscription } = useQuery({
    queryKey: ['current-subscription'],
    queryFn: subscriptionService.getCurrentSubscription
  });

  const subscribeMutation = useMutation({
    mutationFn: ({ planId, paymentMethodId }: { planId: string; paymentMethodId: string }) =>
      subscriptionService.subscribe(planId, paymentMethodId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-subscription'] });
      addNotification('Successfully subscribed to plan', 'success');
    },
    onError: () => {
      addNotification('Failed to subscribe to plan', 'error');
    }
  });

  const cancelSubscriptionMutation = useMutation({
    mutationFn: subscriptionService.cancelSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-subscription'] });
      addNotification('Subscription cancelled successfully', 'success');
    },
    onError: () => {
      addNotification('Failed to cancel subscription', 'error');
    }
  });

  return {
    plans,
    currentSubscription,
    subscribe: subscribeMutation.mutate,
    cancelSubscription: cancelSubscriptionMutation.mutate,
    isLoading: subscribeMutation.status === 'pending' || cancelSubscriptionMutation.status === 'pending'
  };
}
