import Link from "next/link";

export function Footer() {
  return (
    <footer className="text-bg" style={{ backgroundColor: '#303E55' }}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <Link href="/" className="flex items-center justify-start mb-4">
              <img src="/images/logos/logo.svg" alt="Vonga" className="h-40 w-auto" style={{ filter: 'brightness(0) saturate(100%) invert(68%) sepia(66%) saturate(459%) hue-rotate(140deg) brightness(94%) contrast(87%)' }} />
            </Link>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="font-semibold mb-4" style={{ color: '#33BECC' }}>Solutions</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/sports-teams" className="text-gray-300 hover:text-accent transition-colors">
                  Teams & Leagues
                </Link>
              </li>
              <li>
                <Link href="/schools" className="text-gray-300 hover:text-accent transition-colors">
                  Schools & Universities
                </Link>
              </li>
              <li>
                <Link href="/creators" className="text-gray-300 hover:text-accent transition-colors">
                  Creators & Communities
                </Link>
              </li>
              <li>
                <Link href="/studios-clubs" className="text-gray-300 hover:text-accent transition-colors">
                  Studios & Clubs
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4" style={{ color: '#33BECC' }}>Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-accent transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4" style={{ color: '#33BECC' }}>Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/how-it-works" className="text-gray-300 hover:text-accent transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/glossary" className="text-gray-300 hover:text-accent transition-colors">
                  Glossary
                </Link>
              </li>
              <li>
                <Link href="/intake" className="text-gray-300 hover:text-accent transition-colors">
                  Let's Connect
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Vonga. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/legal/privacy" className="text-sm text-gray-400 hover:text-accent transition-colors">
                Privacy Policy
              </Link>
              <Link href="/legal/terms" className="text-sm text-gray-400 hover:text-accent transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
