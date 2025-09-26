import { lazy } from 'react';
import type { RouteConfig } from './types';
import { ComponentSuspense } from '@/components/ui/suspense-wrapper';

const HomePage = lazy(() => import('@/pages/app/user/home'));
const ApplicationsPage = lazy(() => import('@/pages/app/user/my-applications'));
const AnswerApplicationPage = lazy(() => import('@/pages/app/user/answer-application'));
const ApplicationResponsePage = lazy(() => import('@/pages/app/user/application-response'));

// QR Code pages
const GenerateQrCode = lazy(() => import('@/pages/app/qr-code/generate-qr-code'));
const MyDocuments = lazy(() => import('@/pages/app/qr-code/my-documents'));
const AllDocuments = lazy(() => import('@/pages/app/qr-code/all-documents'));

export const userRoutes: RouteConfig[] = [
  {
    path: "",
    element: (
      <ComponentSuspense >
        <HomePage />
      </ComponentSuspense>
    ),
    meta: {
      title: "Home | UzaForm",
      description: "Apply for different services"
    }
  },
  {
    path: "applications",
    element: (
      <ComponentSuspense >
        <ApplicationsPage />
      </ComponentSuspense>
    ),
    meta: {
      title: "Applications | UzaForm",
      description: "View your applications"
    }
  },
  {
    path: "answer-application/:processId/:formId",
    element: (
      <ComponentSuspense >
        <AnswerApplicationPage />
      </ComponentSuspense>
    ),
    meta: {
      title: "Answer Applications | UzaForm",
      description: "Answer applications"
    }
  },
  {
    path: "application-response/:processId/:applicantProcessId/:formId",
    element: (
      <ComponentSuspense >
        <ApplicationResponsePage />
      </ComponentSuspense>
    ),
  },
  // QR Code routes
  {
    path: "qr-code/generate",
    element: (
      <ComponentSuspense>
        <GenerateQrCode />
      </ComponentSuspense>
    ),
    meta: {
      title: "Generate QR Code | UzaForm",
      description: "Generate QR codes for documents",
    },
  },
  {
    path: "qr-code/my-documents",
    element: (
      <ComponentSuspense>
        <MyDocuments />
      </ComponentSuspense>
    ),
    meta: {
      title: "My Documents | UzaForm",
      description: "View and manage your QR code documents",
    },
  },
  {
    path: "qr-code/all-documents",
    element: (
      <ComponentSuspense>
        <AllDocuments />
      </ComponentSuspense>
    ),
    meta: {
      title: "All Documents | UzaForm",
      description: "View and manage all QR code documents",
    },
  },
];
