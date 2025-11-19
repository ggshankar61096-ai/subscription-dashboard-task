import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  duration: number;
}

interface Subscription {
  id: string;
  name?: string; // optional; API may return only planId
  planId: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
}

interface SubscriptionState {
  plans: Plan[];
  subscription: Subscription | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: SubscriptionState = {
  plans: [],
  subscription: null,
  isLoading: false,
  error: null,
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setPlans: (state, action: PayloadAction<Plan[]>) => {
      state.plans = action.payload;
    },
    setSubscription: (state, action: PayloadAction<Subscription | null>) => {
      const payload = action.payload;
      if (!payload) {
        state.subscription = null;
        return;
      }

      // If API didn't provide a plan name, try to resolve it from known plans
      let subscriptionToStore = payload;
      if (!payload.name && payload.planId) {
        const plan = state.plans.find((p) => p.id === payload.planId);
        if (plan) {
          subscriptionToStore = { ...payload, name: plan.name };
        }
      }

      state.subscription = subscriptionToStore;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setPlans, setSubscription, setLoading, setError } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
