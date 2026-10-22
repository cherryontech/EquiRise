export default function Layout({ children }) {
  return (
    <div className="shell">
      <header className="topbar">
        <span className="brand">EquiRise</span>
      </header>
      <main className="stage">{children}</main>
    </div>
  );
}
