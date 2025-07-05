import React from 'react'
import { Phone } from 'lucide-react'
function Footer() {
  return (
    <div>
      <footer className="bg-stone-900 text-stone-200 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-lg font-bold text-white mb-2">Averra</h4>
            <p className="text-sm">
              Empowering smarter, safer communities through digital innovation.
            </p>
            <p className="text-sm mt-2">&copy; {new Date().getFullYear()} Averra</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
            <ul className="text-sm space-y-2">
              <li>
                <a href="/" className="hover:text-lime-400">Home</a>
              </li>
              <li>
                <a href="#features" className="hover:text-lime-400">Features</a>
              </li>
              <li>
                <a href="/login" className="hover:text-lime-400">Login</a>
              </li>
              <li>
                <a href="/register" className="hover:text-lime-400">Register</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">Contact</h4>
            <div className="flex items-center mb-2">
              <Phone className="h-5 w-5 text-lime-600 mr-2" />
              <span className="text-sm">+91 85353 158388</span>
            </div>
            <p className="text-sm">Email: support@Averra.com</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer
