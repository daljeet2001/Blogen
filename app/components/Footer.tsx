"use client";

import { FaInstagram, FaXTwitter, FaLinkedin, FaFacebook, FaYoutube } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="mt-4 bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-10">
          {/* Left Section */}
          <div className="flex flex-col items-start">
            {/* Logo */}
            <div className="flex items-center space-x-2">
                   <img
      src="/logo.png"
      alt="Logo"
      className="h-6 w-6"
      style={{
        filter: "brightness(0) invert(1)", 
      }}
    />
            </div>

            {/* Social Icons */}
            <div className="flex space-x-4 mt-6">
              <FaInstagram className="text-gray-500 hover:text-white cursor-pointer" size={20} />
              <FaXTwitter className="text-gray-500 hover:text-white cursor-pointer" size={20} />
              <FaLinkedin className="text-gray-500 hover:text-white cursor-pointer" size={20} />
              <FaFacebook className="text-gray-500 hover:text-white cursor-pointer" size={20} />
              <FaYoutube className="text-gray-500 hover:text-white cursor-pointer" size={20} />
            </div>

    

            {/* Copyright */}
            <p className="mt-6 text-sm text-gray-500">
              © {new Date().getFullYear()} Blogen Labs, Inc.
            </p>
          </div>

          {/* Right Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-gray-500">
                <li><a href="#">About us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Security</a></li>
                <li><a href="#">Status</a></li>
                <li><a href="#">Terms & Privacy</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Download</h4>
              <ul className="space-y-2 text-gray-500">
                <li><a href="#">iOS & Android</a></li>
                <li><a href="#">Mac & Windows</a></li>
                <li><a href="#">Calendar</a></li>
                <li><a href="#">Web Clipper</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Resources</h4>
              <ul className="space-y-2 text-gray-500">
                <li><a href="#">Help center</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Community</a></li>
                <li><a href="#">Integrations</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Blogen for</h4>
              <ul className="space-y-2 text-gray-500">
                <li><a href="#">Enterprise</a></li>
                <li><a href="#">Small Business</a></li>
                <li><a href="#">Personal</a></li>
              </ul>
              <a href="#" className="block mt-3 text-[#2563EB] font-medium hover:underline">
                Explore more →
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
