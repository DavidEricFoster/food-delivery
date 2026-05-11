import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Cart } from '../pages/Cart';
import { Menu } from '../pages/Menu';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import { useCartStore } from '../store/cartStore';
import { mockApiClientResponses } from './utils/mockApiClient';
import { renderWithAppProviders } from './utils/renderProtectedPage';

describe('menu to cart integration', () => {
  beforeEach(() => {
    useCartStore.setState({ cartsByRestaurant: {} });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('adds meals from Menu and shows matching quantity in Cart after navigation', async () => {
    const user = userEvent.setup();
    mockApiClientResponses();

    renderWithAppProviders({
      initialEntries: ['/menu/rest-1'],
      includeLayout: true,
      authAs: 'customer',
      routes: [
        { path: '/menu/:rid', element: <Menu /> },
        {
          path: '/cart',
          element: (
            <ProtectedRoute requiredRoles={['customer']}>
              <Cart />
            </ProtectedRoute>
          ),
        },
        { path: '/signin', element: <div>Sign In Page</div> },
      ],
    });

    const addButton = await screen.findByRole('button', { name: 'Add to Order' });

    await user.click(addButton);
    await user.click(addButton);

    await user.click(screen.getAllByRole('link', { name: 'Cart' })[0]);

    expect(await screen.findByRole('heading', { name: 'Pizza Palace' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Margherita Pizza' })).toBeInTheDocument();
    expect(screen.getByText('Quantity:')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
