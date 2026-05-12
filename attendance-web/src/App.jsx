import { Suspense, lazy } from 'react';
import { ConfigProvider } from 'antd';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FullSpin from '@/components/FullSpin';
import themeConfig from '@/theme/themeConfig';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ProtectedRoute from './components/ProtectedRoute';
import { useGetLoggedUser } from './utilities/authorization';

const PageLayout = lazy(() => import('@/components/layout/PageLayout'));
const DashboardLayout = lazy(() => import('@/components/layout/dashboard/DashboardLayout'));
const Error404 = lazy(() => import('@/pages/Error404'));
const ScrollToTop = lazy(() => import('@/components/ScrollToTop'));
const HomePage = lazy(() => import('@/pages/home'));

// Authentication
const LayoutAuth = lazy(() => import('@/pages/auth/components/LayoutAuth'));
const LoginPage = lazy(() => import('@/pages/auth/login'));
const RegisterPage = lazy(() => import('@/pages/auth/register'));

// User
const DashboardPage = lazy(() => import('@/pages/dashboard'));
const AttendancePage = lazy(() => import('@/pages/dashboard/attendance'));
const FaceGalleryPage = lazy(() => import('@/pages/dashboard/face-gallery'));
const AddFaceGalleryPage = lazy(() => import('@/pages/dashboard/face-gallery/AddFace'));

// Admin

const AdminDashboardPage = lazy(() => import('@/pages/admin-dashboard'));
const AdminAttendanceListDashboardPage = lazy(
  () => import('@/pages/admin-dashboard/attendance-list')
);
const AdminUsersDashboardPage = lazy(() => import('@/pages/admin-dashboard/users'));
const AdminUsersDetailDashboardPage = lazy(
  () => import('@/pages/admin-dashboard/users/DetailUser')
);
const AdminMasterEmployeeStatusDashboardPage = lazy(
  () => import('@/pages/admin-dashboard/master-data/employee-status')
);
const AdminMasterWorkingStatusDashboardPage = lazy(
  () => import('@/pages/admin-dashboard/master-data/working-status')
);
const AdminMasterSquadDashboardPage = lazy(
  () => import('@/pages/admin-dashboard/master-data/squad')
);
const AdminMasterConditionDashboardPage = lazy(
  () => import('@/pages/admin-dashboard/master-data/condition')
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 0,
      retry: 3,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    },
  },
});

const helmetContext = {};

function App() {
  return (
    <HelmetProvider context={helmetContext}>
      <QueryClientProvider client={queryClient}>
        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
        <ConfigProvider theme={themeConfig}>
          <BrowserRouter>
            <Suspense fallback={<FullSpin size="large" />}>
              <ScrollToTop />
              <Routes>
                <Route path="*" element={<Error404 />} />
                <Route path="/" element={<PageLayout />}>
                  <Route index element={<HomePage />} />

                  <Route path="login" element={<LayoutAuth />}>
                    <Route index element={<LoginPage />} />
                  </Route>

                  <Route path="register" element={<LayoutAuth />}>
                    <Route index element={<RegisterPage />} />
                  </Route>
                </Route>

                <Route element={<ProtectedRoute allowAdminOnly={false} />}>
                  <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<DashboardPage />} />
                    <Route path="attendance" element={<AttendancePage />} />
                    <Route path="facegallery" element={<FaceGalleryPage />} />
                    <Route path="facegallery/add" element={<AddFaceGalleryPage />} />
                  </Route>
                </Route>

                <Route element={<ProtectedRoute allowAdminOnly={true} />}>
                  <Route path="/admin-dashboard" element={<DashboardLayout />}>
                    <Route index element={<AdminDashboardPage />} />
                    <Route path="attendance-list" element={<AdminAttendanceListDashboardPage />} />
                    <Route path="users" element={<AdminUsersDashboardPage />} />
                    <Route path="users/:slug" element={<AdminUsersDetailDashboardPage />} />
                    <Route
                      path="master-data/status-employee"
                      element={<AdminMasterEmployeeStatusDashboardPage />}
                    />
                    <Route path="master-data/squad" element={<AdminMasterSquadDashboardPage />} />
                    <Route
                      path="master-data/status-work"
                      element={<AdminMasterWorkingStatusDashboardPage />}
                    />
                    <Route
                      path="master-data/condition"
                      element={<AdminMasterConditionDashboardPage />}
                    />
                  </Route>
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </ConfigProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
