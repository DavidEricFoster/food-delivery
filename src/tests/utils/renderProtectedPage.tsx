import type { ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { ProtectedRoute } from '../../routes/ProtectedRoute';
import { useAuthStore, type AuthStatus, type User, type UserRole } from '../../store/authStore';

type AuthMode = 'authenticated' | 'unauthenticated' | 'loading';

interface AuthSeed {
  status?: AuthStatus;
  user?: User | null;
  error?: string | null;
}

type AuthAs = 'customer' | 'owner' | 'admin' | 'unauthorized';

interface TestRoute {
  path: string;
  element: ReactElement;
}

interface RenderWithAppProvidersOptions {
  routes: TestRoute[];
  initialEntries?: string[];
  includeLayout?: boolean;
  auth?: AuthSeed;
  authAs?: AuthAs;
}

const DEFAULT_CUSTOMER_USER: User = {
  uuid: 'test-user-uuid',
  email: 'test@example.com',
  role: 'customer',
  created_at: new Date().toISOString(),
  status: 'active',
};

function seedAuthStore(auth?: AuthSeed) {
  useAuthStore.setState({
    user: auth?.user ?? null,
    status: auth?.status ?? 'unauthenticated',
    error: auth?.error ?? null,
  });
}

function buildAuthSeed(authAs: AuthAs): AuthSeed {
  if (authAs === 'unauthorized') {
    return {
      status: 'unauthenticated',
      user: null,
      error: null,
    };
  }

  return {
    status: 'authenticated',
    user: {
      ...DEFAULT_CUSTOMER_USER,
      role: authAs,
      email: `${authAs}@example.com`,
    },
    error: null,
  };
}

export function renderWithAppProviders({
  routes,
  initialEntries = ['/'],
  includeLayout = false,
  auth,
  authAs,
}: RenderWithAppProvidersOptions) {
  seedAuthStore(auth ?? (authAs ? buildAuthSeed(authAs) : undefined));

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  const renderedRoutes = (
    <Routes>
      {routes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}
    </Routes>
  );

  return {
    queryClient,
    ...render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>
          {includeLayout ? <Layout>{renderedRoutes}</Layout> : renderedRoutes}
        </MemoryRouter>
      </QueryClientProvider>
    ),
  };
}

interface RenderProtectedPageOptions {
  route?: string;
  path?: string;
  requiredRoles?: string[];
  authMode?: AuthMode;
  role?: UserRole;
}

export function renderProtectedPage(
  page: ReactElement,
  {
    route = '/protected',
    path = '/protected',
    requiredRoles,
    authMode = 'authenticated',
    role = 'customer',
  }: RenderProtectedPageOptions = {}
) {
  const user =
    authMode === 'authenticated'
      ? {
          ...DEFAULT_CUSTOMER_USER,
          role,
        }
      : null;

  return renderWithAppProviders({
    initialEntries: [route],
    routes: [
      {
        path,
        element: (
          <ProtectedRoute requiredRoles={requiredRoles}>
            {page}
          </ProtectedRoute>
        ),
      },
      { path: '/signin', element: <div>Sign In Page</div> },
      { path: '/unauthorized', element: <div>Unauthorized Page</div> },
    ],
    auth: {
      status: authMode,
      user,
      error: null,
    },
  });
}

export function resetAuthStoreForTests() {
  useAuthStore.setState({
    user: null,
    status: 'unauthenticated',
    error: null,
  });
}