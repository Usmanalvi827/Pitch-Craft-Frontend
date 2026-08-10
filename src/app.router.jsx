import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./features/landingPage/LandingPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import LoginPage from "./features/auth/pages/LoginPage";
import DashboardPage from "./features/dashboard/DashboardPage";
import ProtectedRoute from "./features/auth/routes/ProtectedRoute";
import PublicRoute from "./features/auth/routes/PublicRoute";
import StartupWorkspace from "./features/startup/pages/StartupWorkspace";
import OverviewPage from "./features/startup/pages/OverviewPage";
import BusinessPage from "./features/startup/pages/BusinessPage";
import AudiencePage from "./features/startup/pages/AudiencePage";
import FeaturesPage from "./features/startup/pages/FeaturesPage";
import LandingPageModule from "./features/startup/pages/LandingPageModule";
import PitchPage from "./features/startup/pages/PitchPage";
import CompletePitchPage from "./features/startup/pages/CompletePitchPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    element: <PublicRoute />,
    children: [
      { path: "/register", element: <RegisterPage /> },
      { path: "/login", element: <LoginPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/startup/:id", element: <StartupWorkspace /> },
      { path: "/startup/:id/overview", element: <OverviewPage /> },
      { path: "/startup/:id/business", element: <BusinessPage /> },
      { path: "/startup/:id/audience", element: <AudiencePage /> },
      { path: "/startup/:id/features", element: <FeaturesPage /> },
      { path: "/startup/:id/landing-page", element: <LandingPageModule /> },
      { path: "/startup/:id/pitch", element: <PitchPage /> },
      { path: "/startup/:id/complete", element: <CompletePitchPage /> },
    ],
  },
]);
