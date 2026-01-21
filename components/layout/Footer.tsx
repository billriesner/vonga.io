export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white py-12">
      <div className="max-w-content mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="h-16 w-auto overflow-hidden">
              <img 
                src="/images/logos/logo.svg" 
                alt="Vonga" 
                className="h-40 w-auto"
                style={{ 
                  filter: 'invert(64%) sepia(88%) saturate(425%) hue-rotate(138deg) brightness(95%) contrast(92%)',
                  marginTop: '-48px'
                }}
              />
            </div>
          </div>

          {/* Minimal Navigation */}
          <nav className="flex gap-6 text-sm">
            <a 
              href="/legal/privacy" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Privacy
            </a>
            <a 
              href="/legal/terms" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Terms
            </a>
          </nav>

          {/* Copyright */}
          <div className="text-sm text-gray-400">
            &copy; {currentYear} Vonga. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
