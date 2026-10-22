import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import Layout from "./Layout.jsx";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await api.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Layout>
      <section className="hero">
        <h1 className="display">Locked out? We’ll get you back in.</h1>
        <p className="lede">Enter the email you signed up with and we’ll send a link to set a new password.</p>
      </section>

      <section className="card" aria-labelledby="forgot-title">
        <p className="card-kicker">Reset password</p>
        <h2 id="forgot-title" className="card-title">Reset your password</h2>

        {sent ? (
          <p className="card-copy" role="status">
            If an account exists for {email}, a reset link is on its way. The link works once.
          </p>
        ) : (
          <form onSubmit={onSubmit} noValidate>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" autoComplete="email" placeholder="you@email.com"
                     value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <p className="error" role="alert" hidden={!error}>{error}</p>
            <button type="submit" className="btn btn-primary" disabled={busy || !email.trim()}>
              {busy ? "Sending…" : "Send reset link →"}
            </button>
          </form>
        )}
        <p className="swap"><Link to="/sign-in">Back to sign in</Link></p>
      </section>
    </Layout>
  );
}
