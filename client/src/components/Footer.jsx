import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[var(--bg-base)] border-t border-[var(--border)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:py-6">
        {/* Bottom bar */}
        <div className="border-t border-[var(--border)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-lg text-[var(--text-muted)]">
            © 2026 TechPulse — Mathieu Fenouil
          </p>
          <p className="text-lg text-[var(--text-muted)]">
            Projet portfolio Full-Stack · React · Express · MongoDB · Docker
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;