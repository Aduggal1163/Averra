import React from 'react';

function Header() {
  const NAV_LINKS = [
    {
      key: 'home-icon',
      label: (
        <img
          src="https://res.cloudinary.com/desmscq2h/image/upload/v1751709265/Gemini_Generated_Image_i1ekbti1ekbti1ek-removebg-preview_f0mcka.ico"
          alt="icon"
          style={{ height: '70px', objectFit: 'contain' }}
        />
      ),
      href: '/',
    },
    { key: 'about', label: 'About', href: '/about' },
    { key: 'contact', label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50" style={{ backgroundColor: '#F6F5ED' }}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Navigation */}
        <nav className="flex items-center space-x-8 text-xl font-extrabold text-green-900">
          {NAV_LINKS.map((link) => (
            <a
              key={link.key}
              href={link.href}
              className="hover:text-lime-700 transition duration-300 flex items-center"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Login Button */}
        <a
          href="/login"
          className="bg-green-700 text-white px-5 py-2 rounded-full text-lg font-bold hover:bg-green-800 transition"
        >
          Login
        </a>
      </div>
    </header>
  );
}

export default Header;
