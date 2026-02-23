const Footer = () => {
  return (
    <footer className="bg-[var(--bg-base)] border-t border-[var(--border)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-[var(--primary)] mb-3">TechPulse</h3>
            <p className="text-[var(--text-muted)] text-sm">
              Catalogue & Marketplace High-Tech avec vérification vidéo obligatoire.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-[var(--text-primary)] font-semibold mb-3">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/catalogue" className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">Catalogue</a></li>
              <li><a href="/login" className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">Connexion</a></li>
              <li><a href="/signup" className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">Inscription</a></li>
            </ul>
          </div>

          {/* Tech */}
          <div>
            <h4 className="text-[var(--text-primary)] font-semibold mb-3">Stack</h4>
            <div className="flex flex-wrap gap-2">
              {['React', 'Express', 'MongoDB', 'Docker', 'Kubernetes'].map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 bg-[var(--bg-card)] border border-[var(--border)] rounded text-xs text-[var(--text-muted)]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--border)] mt-8 pt-6 text-center text-xs text-[var(--text-muted)]">
          © 2026 TechPulse — Mathieu Fenouil | Projet portfolio Full-Stack
        </div>
      </div>
    </footer>
  );
};

export default Footer;