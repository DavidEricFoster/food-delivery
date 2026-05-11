import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useAuthStore } from './store/authStore';
import { Layout } from './components/layout/Layout';
import AppRoutes from './routes/AppRoutes';

// Create Material-UI theme
const theme = createTheme();

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000, // Data fresh for 30 seconds
      gcTime: 300000, // Keep in cache for 5 minutes (was cacheTime in v4)
      refetchOnWindowFocus: false, // Don't refetch on window focus for now
      retry: 2,
    },
  },
});

function App() {
  const initAuth = useAuthStore((s) => s.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Layout>
            <AppRoutes />
          </Layout>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
