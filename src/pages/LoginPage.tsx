import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useLogin } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

const loginSchema = z.object({
    username: z.string().min(1, 'Username wajib diisi'),
    password: z.string().min(1, 'Password wajib diisi'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
    const navigate = useNavigate();
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
                toast.success('Login berhasil');
                navigate('/dashboard');
            },
            onError: () => {
                toast.error('Username atau password salah.');
            },
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
            <div className="w-full max-w-sm">
                {/* Brand mark */}
                <div className="mb-8 flex flex-col items-center gap-2 text-center">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                        <span className="text-lg font-semibold">T</span>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                        TaskFlow Manager
                    </span>
                </div>

                <Card className="border-border/60 shadow-sm">
                    <CardHeader className="space-y-1.5 text-center sm:text-left">
                        <CardTitle className="text-2xl tracking-tight">Selamat datang</CardTitle>
                        <CardDescription>Masuk ke akun Anda untuk melanjutkan</CardDescription>
                    </CardHeader>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="admin"
                                    autoComplete="username"
                                    aria-invalid={!!errors.username}
                                    {...register('username')}
                                />
                                {errors.username && (
                                    <p className="text-xs text-destructive">
                                        {errors.username.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    aria-invalid={!!errors.password}
                                    {...register('password')}
                                />
                                {errors.password && (
                                    <p className="text-xs text-destructive">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col gap-4 pt-6">
                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                disabled={loginMutation.isPending}
                            >
                                {loginMutation.isPending ? 'Memproses...' : 'Masuk'}
                            </Button>
                            <p className="text-center text-xs text-muted-foreground">
                                Kredensial demo:{' '}
                                <span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-secondary-foreground">
                                    admin / password123
                                </span>
                            </p>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}