import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { setupMockAdapter } from '@/api/mock/mockAdapter';
import { Toaster } from '@/components/ui/sonner';
import { PrivateRoute } from '@/routes/PrivateRoute';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

function App() {
    const [mockReady, setMockReady] = useState(false);

    // Mock adapter hanya perlu dipasang sekali di seluruh siklus hidup aplikasi.
    useEffect(() => {
        setupMockAdapter();
        Promise.resolve().then(() => setMockReady(true));
    }, []);

    if (!mockReady) return null;

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <DashboardPage />
                            </PrivateRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </BrowserRouter>
            <Toaster position="bottom-right" />
        </QueryClientProvider>
    );
}

export default App;