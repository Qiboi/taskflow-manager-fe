import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { setupMockAdapter } from './api/mock/mockAdapter';
import { ToastProvider } from './components/ui/ToastProvider';
import { PrivateRoute } from './routes/PrivateRoute';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';


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
            <ToastProvider>
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
            </ToastProvider>
        </QueryClientProvider>
    );
}

export default App;
