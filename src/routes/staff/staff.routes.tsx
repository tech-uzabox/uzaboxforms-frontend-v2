import { lazy } from 'react';
import type { RouteConfig } from '../types';
import { ComponentSuspense } from '@/components/ui/suspense-wrapper';

// Lazy load all staff pages
const PendingApplicationsPage = lazy(() => import('@/pages/app/staff/incoming/pending-applications/pending-applications'));
const PendingProcessApplicationsPage = lazy(() => import('@/pages/app/staff/incoming/pending-applications/pending-process-applications'));
const PendingApplicantApplicationPage = lazy(() => import('@/pages/app/staff/incoming/pending-applications/pending-applicant-application'));

const CompletedApplicationsPage = lazy(() => import('@/pages/app/staff/incoming/completed-applications/completed-applications'));
const CompletedProcessApplicationsPage = lazy(() => import('@/pages/app/staff/incoming/completed-applications/completed-process-applications'));
const CompletedApplicantApplicationPage = lazy(() => import('@/pages/app/staff/incoming/completed-applications/completed-applicant-application.tsx'));

const ProcessedApplicationsPage = lazy(() => import('@/pages/app/staff/incoming/processed-applications/processed-applications'));
const ProcessedProcessApplicationsPage = lazy(() => import('@/pages/app/staff/incoming/processed-applications/processed-process-applications'));
const ProcessedApplicantApplicationPage = lazy(() => import('@/pages/app/staff/incoming/processed-applications/processed-applcant-application'));

const DisabledApplicationsPage = lazy(() => import('@/pages/app/staff/incoming/disabled-applications/disabled-applications'));
const DisabledProcessApplicationsPage = lazy(() => import('@/pages/app/staff/incoming/disabled-applications/disabled-process-applications'));
const DisabledApplicantApplicationPage = lazy(() => import('@/pages/app/staff/incoming/disabled-applications/disabled-applicant-application'));

export const staffRoutes: RouteConfig[] = [
  // Pending Applications Routes
  {
    path: "staff/incoming/pending-applications",
    element: (
      <ComponentSuspense>
        <PendingApplicationsPage />
      </ComponentSuspense>
    ),
    meta: {
      title: "Pending Applications | UzaForm",
      description: "View pending applications"
    }
  },
  {
    path: "staff/incoming/pending-applications/:processId",
    element: (
      <ComponentSuspense>
        <PendingProcessApplicationsPage />
      </ComponentSuspense>
    ),
    meta: {
      title: "Pending Process Applications | UzaForm",
      description: "View pending applications for specific process"
    }
  },
  {
    path: "staff/incoming/pending-applications/:processId/:applicantProcessId",
    element: (
      <ComponentSuspense>
        <PendingApplicantApplicationPage />
      </ComponentSuspense>
    ),
    meta: {
      title: "Pending Applicant Application | UzaForm",
      description: "View specific pending applicant application"
    }
  },

  // Completed Applications Routes
  {
    path: "staff/incoming/completed-applications",
    element: (
      <ComponentSuspense>
        <CompletedApplicationsPage />
      </ComponentSuspense>
    ),
    meta: {
      title: "Completed Applications | UzaForm",
      description: "View completed applications"
    }
  },
  {
    path: "staff/incoming/completed-applications/:processId",
    element: (
      <ComponentSuspense>
        <CompletedProcessApplicationsPage />
      </ComponentSuspense>
    ),
    meta: {
      title: "Completed Process Applications | UzaForm",
      description: "View completed applications for specific process"
    }
  },
  {
    path: "staff/incoming/completed-applications/:processId/:applicantProcessId",
    element: (
      <ComponentSuspense>
        <CompletedApplicantApplicationPage />
      </ComponentSuspense>
    ),
    meta: {
      title: "Completed Applicant Application | UzaForm",
      description: "View specific completed applicant application"
    }
  },

  // Processed Applications Routes
  {
    path: "staff/incoming/processed-applications",
    element: (
      <ComponentSuspense>
        <ProcessedApplicationsPage />
      </ComponentSuspense>
    ),
    meta: {
      title: "Processed Applications | UzaForm",
      description: "View processed applications"
    }
  },
  {
    path: "staff/incoming/processed-applications/:processId",
    element: (
      <ComponentSuspense>
        <ProcessedProcessApplicationsPage />
      </ComponentSuspense>
    ),
    meta: {
      title: "Processed Process Applications | UzaForm",
      description: "View processed applications for specific process"
    }
  },
  {
    path: "staff/incoming/processed-applications/:processId/:applicantProcessId",
    element: (
      <ComponentSuspense>
        <ProcessedApplicantApplicationPage />
      </ComponentSuspense>
    ),
    meta: {
      title: "Processed Applicant Application | UzaForm",
      description: "View specific processed applicant application"
    }
  },

  // Disabled Applications Routes
  {
    path: "staff/incoming/disabled-applications",
    element: (
      <ComponentSuspense>
        <DisabledApplicationsPage />
      </ComponentSuspense>
    ),
    meta: {
      title: "Disabled Applications | UzaForm",
      description: "View disabled applications"
    }
  },
  {
    path: "staff/incoming/disabled-applications/:processId",
    element: (
      <ComponentSuspense>
        <DisabledProcessApplicationsPage />
      </ComponentSuspense>
    ),
    meta: {
      title: "Disabled Process Applications | UzaForm",
      description: "View disabled applications for specific process"
    }
  },
  {
    path: "staff/incoming/disabled-applications/:processId/:applicantProcessId",
    element: (
      <ComponentSuspense>
        <DisabledApplicantApplicationPage />
      </ComponentSuspense>
    ),
    meta: {
      title: "Disabled Applicant Application | UzaForm",
      description: "View specific disabled applicant application"
    }
  }
];
