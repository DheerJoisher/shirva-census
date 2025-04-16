import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Import react-icons for better social media icons
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
// Import the logo SVG
import logo from '../assets/logo.svg';

const Landing = () => {
  // State for mobile navigation toggle
  const [isNavOpen, setIsNavOpen] = useState(false);
  // Add scroll state to control navbar appearance
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Sample data for initiatives
  const initiatives = [
    {
      id: 1,
      title: "Community Development",
      description: "Projects aimed at improving infrastructure and quality of life in Shirva.",
      icon: "🏙️",
    },
    {
      id: 2,
      title: "Education Support",
      description: "Scholarships and resources for students from the Shirva community.",
      icon: "🎓",
    },
    {
      id: 3,
      title: "Cultural Preservation",
      description: "Efforts to document and preserve the unique cultural heritage of Shirva.",
      icon: "🏛️",
    },
  ];

  // Sample data for photo gallery with direct dummy links
  const photos = [
    { id: 1, url: "https://source.unsplash.com/random/300x200?temple", caption: "Historic Temple" },
    { id: 2, url: "https://source.unsplash.com/random/300x200?community", caption: "Annual Gathering" },
    { id: 3, url: "https://source.unsplash.com/random/300x200?market", caption: "Traditional Market" },
    { id: 4, url: "https://source.unsplash.com/random/300x200?school", caption: "Education Initiative" },
    { id: 5, url: "https://source.unsplash.com/random/300x200?dance", caption: "Cultural Performance" },
    { id: 6, url: "https://source.unsplash.com/random/300x200?nature", caption: "Local Scenery" },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full flex justify-between items-center px-[5%] bg-white ${isScrolled ? 'shadow-md' : ''} z-50 transition-all duration-300`}>
        <div className="logo flex items-center">
          <img src={logo} alt="Shirva Census Logo" className="h-10 w-10 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">Shirva Census</h1>
        </div>
        
        {/* Mobile menu button */}
        <button className="md:hidden block" onClick={() => setIsNavOpen(!isNavOpen)}>
          <div className="flex flex-col space-y-1.5">
            <span className={`block w-6 h-0.5 bg-gray-800 transition-transform ${isNavOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-800 transition-opacity ${isNavOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-800 transition-transform ${isNavOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </div>
        </button>
        
        {/* Navigation Links */}
        <div className={`md:flex md:items-center md:static fixed top-16 inset-x-0 bg-white md:bg-transparent shadow-md md:shadow-none md:flex-row flex-col p-5 transition-all duration-300 ${isNavOpen ? 'flex z-40' : 'hidden md:flex'}`}>
          <ul className="md:flex md:items-center md:space-x-8 w-full">
            <li className="my-3 md:my-0"><a href="#home" className="text-gray-800 font-semibold hover:text-blue-500 transition-colors">Home</a></li>
            <li className="my-3 md:my-0"><a href="#about" className="text-gray-800 font-semibold hover:text-blue-500 transition-colors">About</a></li>
            <li className="my-3 md:my-0"><a href="#initiatives" className="text-gray-800 font-semibold hover:text-blue-500 transition-colors">Initiatives</a></li>
            <li className="my-3 md:my-0"><a href="#gallery" className="text-gray-800 font-semibold hover:text-blue-500 transition-colors">Gallery</a></li>
            <li className="my-3 md:my-0"><a href="#contact" className="text-gray-800 font-semibold hover:text-blue-500 transition-colors">Contact</a></li>
            <li className="my-3 md:my-0 md:ml-auto">
              <a href="/signin" className="border-2 border-blue-500 text-blue-500 font-semibold py-2 px-4 rounded-md hover:bg-blue-500 hover:text-white hover:scale-105 transition-transform transition-colors block text-center">
                Sign In
              </a>
            </li>
            <li className="my-3 md:my-0 md:ml-6">
              <a href="/register" className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 hover:scale-105 transition-transform transition-colors block text-center">
                Register
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero/Banner Section */}
      <section id="home" className="flex items-center justify-center min-h-screen bg-cover bg-center text-white text-center pt-20" style={{backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("https://source.unsplash.com/random/1920x1080?village")'}}>
        <div className="px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-5 drop-shadow-lg">Welcome to Shirva Census</h1>
          <p className="text-xl md:text-2xl mb-8 drop-shadow">Connecting our community, preserving our heritage</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-md text-lg transition-colors inline-block">Join The Census</a>
            <a href="/signin" className="border-2 border-white hover:border-blue-300 text-white font-bold py-3 px-8 rounded-md text-lg transition-colors inline-block hover:bg-white/10">Sign In</a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-5 bg-gray-50">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">About Shirva Census</h2>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-10 max-w-6xl mx-auto">
          <div className="flex-1 min-w-[300px]">
            <p className="text-lg text-gray-700 leading-relaxed mb-5">The Shirva Census initiative aims to document and connect all individuals with roots in Shirva, creating a comprehensive database that helps preserve our cultural heritage while fostering community bonds.</p>
            <p className="text-lg text-gray-700 leading-relaxed">Our mission is to build a strong network of Shirva natives across the globe, supporting each other and working together for the development of our hometown.</p>
          </div>
          <div className="flex-1 min-w-[300px]">
            <img src="https://source.unsplash.com/random/600x400?community" alt="Shirva Community" className="w-full rounded-lg shadow-lg" />
          </div>
        </div>
      </section>

      {/* Initiatives Section */}
      <section id="initiatives" className="py-20 px-5">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">Our Initiatives</h2>
          <p className="text-xl text-gray-600">Projects that strengthen our community and heritage</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {initiatives.map(initiative => (
            <div key={initiative.id} className="bg-white p-8 rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl text-center">
              <div className="text-5xl mb-5">{initiative.icon}</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">{initiative.title}</h3>
              <p className="text-gray-600 mb-6">{initiative.description}</p>
              <button className="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white hover:scale-105 font-semibold py-2 px-5 rounded-md transition-transform transition-colors">
                Learn More
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section id="gallery" className="py-20 px-5 bg-gray-50">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">Photo Gallery</h2>
          <p className="text-xl text-gray-600">Glimpses of Shirva and our community events</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {photos.map(photo => (
            <div key={photo.id} className="relative overflow-hidden rounded-lg shadow-md hover:scale-[1.02] transition-transform duration-300">
              <img src={photo.url} alt={photo.caption} className="w-full h-64 object-cover" />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-transparent to-transparent text-white py-2 px-3 text-center">
                <p className="font-semibold">{photo.caption}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-md transition-colors">View All Photos</button>
        </div>
      </section>

      {/* Footer Section */}
      <footer id="contact" className="bg-gray-800 text-white py-16 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h2 className="text-2xl font-bold mb-3">Shirva Census</h2>
              <p className="text-gray-300">Uniting the Shirva community worldwide</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-5 pb-2 border-b-2 border-blue-500 inline-block">Quick Links</h3>
              <ul className="space-y-3">
                <li><a href="#home" className="text-gray-300 hover:text-blue-400 transition-colors">Home</a></li>
                <li><a href="#about" className="text-gray-300 hover:text-blue-400 transition-colors">About</a></li>
                <li><a href="#initiatives" className="text-gray-300 hover:text-blue-400 transition-colors">Initiatives</a></li>
                <li><a href="#gallery" className="text-gray-300 hover:text-blue-400 transition-colors">Gallery</a></li>
                <li><a href="#contact" className="text-gray-300 hover:text-blue-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-5 pb-2 border-b-2 border-blue-500 inline-block">Contact Us</h3>
              <p className="text-gray-300 mb-2">Email: info@shirvacensus.org</p>
              <p className="text-gray-300 mb-5">Phone: +91 98765 43210</p>
              <div className="flex gap-4 mt-5">
                <a href="#" aria-label="Facebook" className="w-10 h-10 bg-gray-700 hover:bg-blue-500 flex items-center justify-center rounded-full transition-colors">
                  <FaFacebook className="text-xl" />
                </a>
                <a href="#" aria-label="Twitter" className="w-10 h-10 bg-gray-700 hover:bg-blue-500 flex items-center justify-center rounded-full transition-colors">
                  <FaTwitter className="text-xl" />
                </a>
                <a href="#" aria-label="Instagram" className="w-10 h-10 bg-gray-700 hover:bg-blue-500 flex items-center justify-center rounded-full transition-colors">
                  <FaInstagram className="text-xl" />
                </a>
                <a href="#" aria-label="LinkedIn" className="w-10 h-10 bg-gray-700 hover:bg-blue-500 flex items-center justify-center rounded-full transition-colors">
                  <FaLinkedin className="text-xl" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="text-center text-gray-400 text-sm pt-8 mt-10 border-t border-gray-700">
            <p>&copy; 2023 Shirva Census. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
