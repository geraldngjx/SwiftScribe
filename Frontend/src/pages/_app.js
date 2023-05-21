import "@/styles/globals.css";
import Navbar from "../components/navigation/Navbar";
import { AuthContextProvider } from "../context/AuthContext";
import { useRouter } from "next/router";
import ProtectedRoute from "../components/navigation/ProtectedRoute";

const noAuthRequired = ["/signin", "/signup"];

export default function App({ Component, pageProps }) {
  const router = useRouter();
  return (
    <AuthContextProvider>
      <div className="flex">
        <div className="navbar">
          <Navbar />
        </div>
        <div className="main-content flex-1">
          {noAuthRequired.includes(router.pathname) ? (
            <Component {...pageProps} />
          ) : (
            <ProtectedRoute>
              <Component {...pageProps} />
            </ProtectedRoute>
          )}
        </div>
      </div>
    </AuthContextProvider>
  );
}
