import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import { RestaurantOrders } from '../pages/RestaurantOrders';
import { mockApiClientResponses } from './utils/mockApiClient';
import { renderWithAppProviders } from './utils/renderProtectedPage';

describe('owner order advancement integration', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('lets an owner advance an order until it reaches delivered', async () => {
    const user = userEvent.setup();

    const { getSpy, patchSpy } = mockApiClientResponses({
      ordersByRestaurant: {
        'rest-1': [
          {
            uuid: 'order-1',
            customer_uuid: 'customer-1',
            restaurant_uuid: 'rest-1',
            status: 'placed',
            total_price: 2599,
          },
        ],
      },
    });

    renderWithAppProviders({
      initialEntries: ['/restaurant-orders'],
      authAs: 'owner',
      routes: [
        {
          path: '/restaurant-orders',
          element: (
            <ProtectedRoute requiredRoles={['owner']}>
              <RestaurantOrders />
            </ProtectedRoute>
          ),
        },
        { path: '/signin', element: <div>Sign In Page</div> },
      ],
    });

    expect(await screen.findByText('Status: placed')).toBeInTheDocument();

    const advanceButton = screen.getByRole('button', { name: 'Advance Order' });

    await user.click(advanceButton);
    await screen.findByText('Status: processing');

    await user.click(advanceButton);
    await screen.findByText('Status: in route');

    await user.click(advanceButton);
    await screen.findByText('Status: delivered');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Advance Order' })).toBeDisabled();
    });

    expect(patchSpy).toHaveBeenNthCalledWith(1, '/orders/order-1', { status: 'processing' });
    expect(patchSpy).toHaveBeenNthCalledWith(2, '/orders/order-1', { status: 'in route' });
    expect(patchSpy).toHaveBeenNthCalledWith(3, '/orders/order-1', { status: 'delivered' });
    expect(getSpy).toHaveBeenCalledWith('/restaurants', { params: {} });
    expect(getSpy).toHaveBeenCalledWith('/restaurants/rest-1/orders');
  });
});
