import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useAuth';
import { useToast } from '../components/ui/ToastProvider';

const loginSchema = z.object({
    username: z.string().min(1, 'Username wajib diisi'),
    password: z.string().min(1, 'Password wajib diisi'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const loginMutation = useLogin();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (values: LoginFormValues) => {
        loginMutation.mutate(values, {
            onSuccess: () => {
                showToast('Login berhasil', 'success');
                navigate('/dashboard');
            },
            onError: () => {
                showToast('Username atau password salah.', 'error');
            },
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <h1 className="mb-1 text-xl font-semibold text-slate-900">TaskFlow Manager</h1>
                <p className="mb-6 text-sm text-slate-500">Masuk untuk melanjutkan</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Username</label>
                        <input
                            {...register('username')}
                            type="text"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                            placeholder="admin"
                        />
                        {errors.username && (
                            <p className="mt-1 text-xs text-red-600">{errors.username.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
                        <input
                            {...register('password')}
                            type="password"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                            placeholder="••••••••"
                        />
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loginMutation.isPending}
                        className="w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-60"
                    >
                        {loginMutation.isPending ? 'Memproses...' : 'Masuk'}
                    </button>

                    <p className="text-center text-xs text-slate-400">
                        Kredensial demo: <span className="font-mono">admin / password123</span>
                    </p>
                </form>
            </div>
        </div>
    );
}
