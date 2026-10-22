import { Link } from "react-router-dom";
import Layout from "./Layout.jsx";

export default function ComingNext({ title }) {
  return (
    <Layout>
      <section className="hero">
        <h1 className="display">{title}</h1>
        <p className="lede">This screen isn’t part of the login build yet.</p>
      </section>
      <section className="card">
        <Link to="/sign-in" className="btn btn-secondary">Back to sign in</Link>
      </section>
    </Layout>
  );
}
