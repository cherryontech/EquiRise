import { useAuth } from "../AuthContext.jsx";
import Layout from "./Layout.jsx";

/** Placeholder for the real landing page. Only reachable with a valid session. */
export default function Landing() {
  const { user, signOut } = useAuth();
  return (
    <Layout>
      <section className="hero">
        <p className="hello">You’re signed in</p>
        <h1 className="display">Good to see you again.</h1>
        <p className="lede">Signed in as {user?.email}. Your landing page goes here.</p>
      </section>
      <section className="card">
        <button type="button" className="btn btn-secondary" onClick={signOut}>Sign out</button>
      </section>
    </Layout>
  );
}
