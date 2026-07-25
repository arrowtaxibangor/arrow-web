'use client';
import { QueryClient, QueryClientProvider } from 'react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 3000,
      retry: 1,
    },
  },
});
export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return <QueryClientProvider client={queryClient}> {children}</QueryClientProvider>;
}
