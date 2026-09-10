import Link from "next/link";
import { Logo } from "./Logo";

export function Nav() {
  return (
    <header className="nav-shell">
      <nav className="nav container">
        <Link href="/" className="logo-link"><Logo /></Link>
        <div className="nav-links">
          <Link href="/verify">Verify</Link>
          <Link href="/dashboard" className="button button-small">Dashboard</Link>
        </div>
      </nav>
    </header>
  );
}
