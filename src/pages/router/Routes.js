import React from 'react';

// Import lazy-loaded components
const LazyHesUtility = React.lazy(() => import('../utility/module/hes'));
const LazyMdmsUtility = React.lazy(() => import('../utility/module/mdms'));
const LazySlaReports = React.lazy(() =>
  import('../utility/module/sla-Reports')
);
const LazySat = React.lazy(() => import('../utility/module/sat'));

export const routes = [
  {
    id: 1,
    title: 'LPDD',
    icon: 'Award',
    key: 'lpdd',
    modules: [
      {
        id: 1,
        title: 'HES',
        path: '/utility/lpdd/hes',
        icon: 'Circle',
        key: 'lpdd-hes',
        component: LazyHesUtility, // Assign lazy-loaded component
      },
      {
        id: 2,
        title: 'MDMS',
        path: '/utility/lpdd/mdms',
        icon: 'Circle',
        key: 'lpdd-mdms',
        component: LazyMdmsUtility, // Assign lazy-loaded component
      },
      {
        id: 3,
        title: 'SLA REPORTS',
        path: '/utility/lpdd/sla-reports',
        icon: 'Circle',
        key: 'lpdd-sla',
        component: LazySlaReports, // Assign lazy-loaded component
      },
      {
        id: 4,
        title: 'SAT',
        path: '/utility/lpdd/sat',
        icon: 'Circle',
        key: 'lpdd-sat',
        component: LazySat, // Assign lazy-loaded component
      },
    ],
  },
  {
    id: 2,
    title: 'SBPDCL',
    icon: 'Award',
    key: 'sbpdcl',
    modules: [
      {
        id: 1,
        title: 'HES',
        path: '/utility/sbpdcl/hes',
        icon: 'Circle',
        key: 'sbpdcl-hes',
        component: LazyHesUtility, // Assign lazy-loaded component
      },
      {
        id: 2,
        title: 'MDMS',
        path: '/utility/sbpdcl/mdms',
        icon: 'Circle',
        key: 'sbpdcl-mdms',
        component: LazyMdmsUtility, // Assign lazy-loaded component
      },
      {
        id: 3,
        title: 'SLA REPORTS',
        path: '/utility/sbpdcl/sla-reports',
        icon: 'Circle',
        key: 'sbpdcl-sla',
        component: LazySlaReports, // Assign lazy-loaded component
      },
      {
        id: 4,
        title: 'SAT',
        path: '/utility/sbpdcl/sat',
        icon: 'Circle',
        key: 'sbpdcl-sat',
        component: LazySat, // Assign lazy-loaded component
      },
    ],
  },
];
