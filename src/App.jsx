import { useContext } from "react";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./app.router.jsx";
import {
  AuthProvider,
  AuthContext,
} from "./features/auth/context/auth.context.jsx";
import { ToastContainer } from "react-toastify";
import PageLoader from "./components/ui/PageLoader.jsx";
import { UserDataShowProvider } from "./features/startup/context/main.context.jsx";

function AppContent() {
  const { loadingPage } = useContext(AuthContext);

  if (loadingPage) {
    return <PageLoader />;
  }

  return <RouterProvider router={router} />;
}

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        theme="colored"
      />
      <AuthProvider>
        <UserDataShowProvider>
          <AppContent />
        </UserDataShowProvider>
      </AuthProvider>
    </>
  );
}

export default App;
