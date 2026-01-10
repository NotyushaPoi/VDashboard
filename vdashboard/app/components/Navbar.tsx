import Link from "next/link";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/home" className="flex items-center gap-2">
            <div 
              className="w-8 h-8 flex items-center justify-center text-2xl"
              style={{
                background: 'linear-gradient(135deg, #FF69B4, #FFB6C1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              🎵
            </div>
            <span 
              className="font-bold text-lg hidden sm:inline"
              style={{
                background: 'linear-gradient(135deg, #FF69B4, #FF1493)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              春和音
            </span>
          </Link>

          {/* Spacer */}
          <div />
        </div>
      </div>
    </nav>
  );
}
