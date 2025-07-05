import React from "react";
import {
  Users,
  Key,
  AlertTriangle,
  Megaphone,
  BarChart2,
  CheckSquare,
} from "lucide-react";
import Header from "./landingpagecomponents/Header";
import Footer from "./landingpagecomponents/Footer";

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
      <Header/>
    
      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between max-w-7xl mx-auto px-6 py-20 md:py-28 gap-12 w-full">
        {/* Left Side - Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="rounded-2xl overflow-hidden shadow-xl border border-lime-100 w-full max-w-lg">
            <img
              src="https://content.jdmagicbox.com/comp/pune/i4/020pxx20.xx20.181011231025.j1i4/catalogue/ruby-park-co-operative-housing-society-wakad-pune-residential-buildings-xhj9ung491.jpg"
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
      <Footer/>
    </div>
  );
};

export default LandingPage;
