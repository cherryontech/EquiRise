import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import Layout from "./pages/Layout.jsx";
import Welcome from "./pages/Welcome.jsx";
import SignIn from "./pages/SignIn.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Landing from "./pages/Landing.jsx";
import ComingNext from "./pages/ComingNext.jsx";

/** Landing page, or whichever login screen the entry logic picks. */
function Entry() {
  const { status } = useAuth();
  if (status === "loading") return <Layout><p className="status" role="status">Loading…</p></Layout>;
  if (status === "SIGNED_IN") return <Landing />;
  return <Navigate to={status === "EXPIRED" ? "/sign-in" : "/welcome"} replace />;
}

/** Signed-in users who open a login route (e.g. a bookmark) go to the landing page. */
function GuestOnly({ children }) {
  const { status } = useAuth();
  if (status === "loading") return <Layout><p className="status" role="status">Loading…</p></Layout>;
  if (status === "SIGNED_IN") return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Entry />} />
      <Route path="/welcome" element={<GuestOnly><Welcome /></GuestOnly>} />
      <Route path="/sign-in" element={<GuestOnly><SignIn /></GuestOnly>} />
      <Route path="/forgot-password" element={<GuestOnly><ForgotPassword /></GuestOnly>} />
      <Route path="/create-account" element={<GuestOnly><ComingNext title="Create account" /></GuestOnly>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
