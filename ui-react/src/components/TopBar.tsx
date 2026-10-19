
import { Link, NavLink } from "react-router-dom";

export default function TopBar() {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `transition-colors duration-200 hover:text-white ${
      isActive ? "text-white" : "text-neutral-400"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-md">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-10">
        {/* Logo */}
        <Link
          to="/"
          className="font-serif text-3xl italic tracking-wide text-white transition-opacity hover:opacity-75"
        >
          security
        </Link>

        {/* Navegación */}
        <div className="flex items-center gap-6 text-sm font-medium md:gap-10">
        
          {/* Analysis */}
          <NavLink to="/analysis" className={navLinkClass}>
            Analysis
          </NavLink>

        
          {/* About */}
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
