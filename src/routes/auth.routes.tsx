import { lazy } from 'react';
import type { RouteConfig } from './types';
import { ComponentSuspense } from '@/components/ui/suspense-wrapper';

const LoginPage = lazy(() => import('@/pages/auth/login'));
const RegisterPage = lazy(() => import('@/pages/auth/register'));
const VerifyEmailPage = lazy(() => import('@/pages/auth/verify-email'));
const RecoverPasswordPage = lazy(() => import('@/pages/auth/recover-password'));

export const authRoutes: RouteConfig[] = [
  {
    path: "/auth/login",
    element: (
      <ComponentSuspense >
        <LoginPage />
      </ComponentSuspense>
    ),
    meta: {
      title: "UzaForm | Login",
      description: "Login to your uzaform account"
    }
  },
  {
    path: "/auth/register", 
    element: (
      <ComponentSuspense >
        <RegisterPage />
      </ComponentSuspense>
    ),
    meta: {
      title: "UzaForm | Register",
      description: "Create a new uzaform account"
    }
  },
  {
    path: "/auth/forgot-password",
    element: (
      <ComponentSuspense >
        <RecoverPasswordPage />
      </ComponentSuspense>
    ),
    meta: {
      title: "UzaForm | Forgot Password",
      description: "Reset your uzaform password"
    }
  },
  {
    path: "/auth/verify-email",
    element: (
      <ComponentSuspense >
        <VerifyEmailPage />
      </ComponentSuspense>
    ),
    meta: {
      title: "UzaForm | Verify Email",
      description: "Verify your uzaform email"
    }
  }
];
