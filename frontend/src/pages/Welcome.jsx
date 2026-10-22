import { Link } from "react-router-dom";
import Layout from "./Layout.jsx";

export default function Welcome() {
  return (
    <Layout>
      <section className="hero">
        <p className="hello">Hello there</p>
        <h1 className="display">Welcome to EquiRise.</h1>
        <p className="lede">
          Short adventures on pay transparency and fair work. Build your avatar, earn XP and level up as you go.
        </p>
      </section>

      <section className="card" aria-labelledby="start-title">
        <p className="card-kicker">Get started</p>
        <h2 id="start-title" className="card-title">Let’s get you set up</h2>
        <p className="card-copy">New here? Create an account. Already playing? Sign in to pick up where you left off.</p>
        <Link to="/create-account" className="btn btn-primary">Create an account →</Link>
        <Link to="/sign-in" className="btn btn-secondary">Sign in</Link>
      </section>
    </Layout>
  );
}
