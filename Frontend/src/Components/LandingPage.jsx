import React from "react";
import {
  Phone,
  Users,
  Key,
  AlertTriangle,
  Megaphone,
  BarChart2,
  CheckSquare,
} from "lucide-react";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Features", href: "#features" },
  { label: "Contact", href: "#contact" },
];

const FEATURES = [
  {
    icon: <Users className="h-7 w-7 text-green-700 mb-3" />,
    title: "Resident Helpdesk",
    desc: "Log complaints, track their progress, and communicate seamlessly with management.",
  },
  {
    icon: <Key className="h-7 w-7 text-green-700 mb-3" />,
    title: "Digital Gatepass",
    desc: "Approve or request visitor entry and manage deliveries securely from your phone.",
  },
  {
    icon: <AlertTriangle className="h-7 w-7 text-green-700 mb-3" />,
    title: "Emergency SOS",
    desc: "Send instant alerts to security and admins during emergencies for rapid response.",
  },
  {
    icon: <Megaphone className="h-7 w-7 text-green-700 mb-3" />,
    title: "Community Announcements",
    desc: "Stay informed with real-time updates, events, and notices from your society admins.",
  },
  {
    icon: <BarChart2 className="h-7 w-7 text-green-700 mb-3" />,
    title: "Polls & Voting",
    desc: "Participate in important community decisions and make your voice heard securely.",
  },
  {
    icon: <CheckSquare className="h-7 w-7 text-green-700 mb-3" />,
    title: "Task Management",
    desc: "Admins can assign, monitor, and verify daily tasks for staff and security teams.",
  },
];

const LandingPage = () => {
  return (
    <div className="font-[Poppins] min-h-screen flex flex-col" style={{ backgroundColor: "#F6F5ED" }}>
      {/* Header / Navbar */}
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

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between max-w-7xl mx-auto px-6 py-20 md:py-28 gap-12 w-full">
        {/* Left Side - Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="rounded-2xl overflow-hidden shadow-xl border border-lime-100 w-full max-w-lg">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
              alt="Residents interacting with dashboard"
              className="w-full h-72 md:h-96 object-cover"
            />
          </div>
        </div>

        {/* Right Side - Text */}
        <div className="w-full md:w-1/2 flex flex-col items-start">
          <h2
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-green-800"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Welcome to{" "}
            <span
              className="text-green-800 md:text-7xl italic font-extrabold"
              style={{ fontFamily: "Dancing Script" }}
            >
              Averra
            </span>
          </h2>
          <p className="text-lg mb-8 text-stone-700 font-medium" style={{ fontFamily: "Poppins, sans-serif" }}>
            <b>
              Effortlessly manage your community with a unified, nature-inspired platform
              for residents, security, and admins. From instant alerts to visitor
              management and community polls, Averra brings harmony and transparency
              to your society.
            </b>
          </p>
          <div className="flex space-x-4">
            <a href="#features" className="bg-black text-white font-bold px-6 py-3 rounded-full transition">
              Explore Features
            </a>
            <a
              href="/register"
              className="bg-black text-white font-bold px-6 py-3 rounded-full border border-lime-200 transition"
            >
              Register Now
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20" style={{ backgroundColor: "#F6F5ED" }}>
        <div className="max-w-5xl mx-auto px-6">
          <h3 className="text-4xl font-bold mb-4 text-center text-green-800">
            Everything Your Community Needs
          </h3>
          <p className="text-lg mb-12 text-center text-gray-800 font-medium">
            <b>
              Averra simplifies daily society life with powerful, easy-to-use digital
              tools for every resident, admin, and guard.
            </b>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-16">
            {FEATURES.map((f, idx) => (
              <div key={idx} className="flex items-start space-x-5">
                <div className="flex-shrink-0 rounded-lg p-3">{f.icon}</div>
                <div>
                  <h4 className="text-xl font-semibold mb-1 text-gray-900">{f.title}</h4>
                  <p className="text-gray-700">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
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
  );
};

export default LandingPage;
