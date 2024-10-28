import { AuthForm } from '@/components/auth/auth-form';

export default function AuthPage() {
  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
    </div>
  );
}