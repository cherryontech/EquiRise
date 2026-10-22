import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import Layout from "./Layout.jsx";

export default function SignIn() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    setBusy(true);
    try {
      await signIn(email, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <Layout>
      <section className="hero">
        <h1 className="display">Welcome back. Pick up where you left off.</h1>
        <p className="lede">Sign in to continue your adventures and keep your progress, XP and avatar in sync.</p>
      </section>

      <section className="card" aria-labelledby="signin-title">
        <p className="card-kicker">Sign in</p>
        <h2 id="signin-title" className="card-title">Sign in to your account</h2>

        <form onSubmit={onSubmit} noValidate>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "form-error" : undefined}
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <div className="input-wrap">
              <input
                id="password"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={Boolean(error)}
              />
              <button
                type="button"
                className="toggle"
                onClick={() => setShow((s) => !s)}
                aria-pressed={show}
              >
                {show ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="forgot">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <p id="form-error" className="error" role="alert" hidden={!error}>{error}</p>

          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? "Signing in…" : "Sign in →"}
          </button>
        </form>

        <p className="swap">New here? <Link to="/create-account">Create an account</Link></p>

        <div className="divider"><span>Coming soon</span></div>
        <button type="button" className="btn btn-social" disabled>
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"/>
            <path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z"/>
            <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.400-4.800 2.300-8.400 2.300-6.300 0-11.600-4.100-13.500-9.800l-7.900 6.100C6.500 42.600 14.600 48 24 48z"/>
          </svg>
          Continue with Google
        </button>
        <button type="button" className="btn btn-social" disabled>
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M16.4 12.6c0-2.500 2-3.700 2.100-3.800-1.200-1.700-3-1.900-3.600-2-1.500-.2-3 .9-3.800.9s-2-.9-3.300-.9c-1.700 0-3.300 1-4.200 2.500-1.800 3.100-.5 7.700 1.300 10.200.9 1.200 1.900 2.600 3.200 2.500 1.300-.1 1.800-.8 3.300-.8s2 .8 3.300.8c1.400 0 2.300-1.200 3.100-2.500 1-1.400 1.400-2.800 1.400-2.900-.1 0-2.800-1.100-2.800-4zM13.900 5.100c.7-.9 1.200-2.100 1-3.300-1 0-2.300.7-3 1.600-.7.800-1.200 2-1.100 3.200 1.200.1 2.400-.6 3.100-1.500z"/>
          </svg>
          Continue with Apple
        </button>
      </section>
    </Layout>
  );
}
