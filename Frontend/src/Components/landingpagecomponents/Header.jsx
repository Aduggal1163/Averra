import React from 'react'

function Header() {
    const NAV_LINKS = [
  {label:"Home", href:'/'},
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
  return (
    <div>
      <header className="sticky top-0 z-50" style={{ backgroundColor: "#F6F5ED" }}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <nav className="flex space-x-8 text-xl font-extrabold text-green-900">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-lime-700 transition duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <a
            href="/login"
            className="bg-green-700 text-white px-5 py-2 rounded-full text-lg font-bold hover:bg-green-800 transition"
          >
            Login
          </a>
        </div>
      </header>
    </div>
  )
}

export default Header
