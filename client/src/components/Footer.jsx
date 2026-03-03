const Footer = () => {
  return (
    <footer className="bg-[var(--bg-base)] border-t border-[var(--border)] mt-auto">
      <div className="max-w-8xl mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs sm:text-sm text-[var(--text-muted)] font-request">
            © 2026 TechPulse — Mathieu Fenouil
          </p>
          <p className="text-[10px] text-center sm:text-xs text-[var(--text-muted)]/60 font-request">
            Projet portfolio Full-Stack · React · Express · MongoDB · Docker
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;