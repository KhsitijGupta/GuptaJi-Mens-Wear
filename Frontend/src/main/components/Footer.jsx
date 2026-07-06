// import React from "react";
// import {
//   FiFacebook,
//   FiTwitter,
//   FiInstagram,
//   FiPhone,
//   FiMail,
//   FiMapPin,
//   FiSend,
// } from "react-icons/fi";
// import logo from "../../Assests/logo.png";
// import { Link } from "react-router-dom";

// const Footer = () => {
//   return (
//     <div className="relative ">

//       {/* Wave */}
//       <div className="overflow-hidden leading-none -mb-1">
//         <svg
//           className="block w-full h-20"
//           viewBox="0 0 1200 120"
//           preserveAspectRatio="none"
//         >
//           <path
//             d="M321.39 56.44C176 117 0 0 0 0V120H1200V0s-176 117-321.39 56.44C733.22-3.11 567.52-3.11 321.39 56.44z"
//             className="fill-gray-900"
//           />
//         </svg>
//       </div>

//       <footer className="bg-gray-900 text-white pt-16 pb-10">
//         <div className="max-w-7xl mx-auto px-6">

//           {/* MAIN GRID */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">

//             {/* Brand */}
//             <div>
//               <Link to="/" className="flex items-center gap-3 mb-6 group">
//                 <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
//                   <img
//                     src={logo}
//                     alt="Logo"
//                     className="w-full h-full object-contain p-2"
//                   />
//                 </div>
//                 <h2 className="text-xl font-bold group-hover:text-orange-400 transition">
//                   ZK Online Services
//                 </h2>
//               </Link>

//               <p className="text-gray-400 text-sm leading-relaxed mb-6">
//                 Fresh groceries delivered to your doorstep in 48 hours.
//                 Quality products sourced directly from trusted farmers.
//               </p>

//               {/* <div className="flex gap-4">
//                 {[FiFacebook, FiTwitter, FiInstagram].map((Icon, i) => (
//                   <div
//                     key={i}
//                     className="w-10 h-10 bg-white/10 hover:bg-orange-500 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110"
//                   >
//                     <Icon size={18} />
//                   </div>
//                 ))}
//               </div> */}
//             </div>

//             {/* Quick Links */}
//             <div>
//               <h3 className="text-lg font-semibold mb-6">
//                 Quick Links
//               </h3>

//               <ul className="space-y-3">
//                 {[
//                   { name: "Home", path: "/" },
//                   { name: "Products", path: "/products" },
//                   { name: "About", path: "/about" },
//                   { name: "Contact", path: "/contact" },
//                 ].map((item) => (
//                   <li key={item.name}>
//                     <Link
//                       to={item.path}
//                       className="text-gray-400 hover:text-orange-400 transition relative inline-block"
//                     >
//                       {item.name}
//                       <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-orange-400 transition-all duration-300 group-hover:w-full"></span>
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Services */}
//             <div>
//               <h3 className="text-lg font-semibold mb-6">
//                 Services
//               </h3>

//               <ul className="space-y-3 text-gray-400 text-sm">
//                 <li>Upto 48 Hours Delivery</li>
//                 <li>Fresh Guarantee</li>
//                 <li>Local Farmers</li>
//                 <li>Weekly Subscriptions</li>
//               </ul>
//             </div>

//             {/* Contact */}
//             <div>
//               <h3 className="text-lg font-semibold mb-6">
//                 Contact Info
//               </h3>

//               <div className="space-y-4 text-gray-400 text-sm">
//                 <div className="flex items-center gap-3">
//                   <FiPhone className="text-orange-400" />
//                   +91 9174433650
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <FiMail className="text-orange-400" />
//                   zkonlineservices001@gmail.com
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <FiMapPin className="text-orange-400" />
//                   Ashoka Garden, Bhopal, MP
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Bottom Bar */}
//           <div className="border-t border-gray-800 pb-12 md:pb-0 pt-6 flex flex-col md:flex-row justify-between md:items-center text-sm text-gray-500">
//             {/* <p className="text-xs md:text-sm">© 2026 ZK Online Services. All rights reserved.</p> */}
//             <p className="text-sm">
//               © 2026 Developed & Managed by{" "}
//               <a
//                 href="https://www.binarylogix.in"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-orange-400 font-medium hover:text-blue-500  transition"
//               >
//                 Binarylogix Technologies LLP
//               </a>
//               .
//             </p>

//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Footer;
import React from "react";
import {
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiPhone,
  FiMail,
  FiMapPin,
} from "react-icons/fi";
import logo from "../../Assests/logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="relative">
      {/* Wave */}
      <div className="overflow-hidden leading-none -mb-1">
        <svg
          className="block h-20 w-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39 56.44C176 117 0 0 0 0V120H1200V0s-176 117-321.39 56.44C733.22-3.11 567.52-3.11 321.39 56.44z"
            style={{ fill: "var(--secondary)" }}
          />
        </svg>
      </div>

      <footer
        className="pt-14 pb-10"
        style={{ background: "var(--secondary)", color: "var(--surface)" }}
      >
        <div className="mx-auto max-w-7xl px-6">
          {/* MAIN GRID */}
          <div className="mb-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <Link to="/" className="group mb-6 flex items-center gap-3">
                <div
                  className="flex h-30 w-50 items-center justify-center rounded-2xl backdrop-blur-md"
                  style={{ background: "rgb(255, 255, 255)" }}
                >
                  <img
                    src={logo}
                    alt="Logo"
                    className="h-full w-full p-2 object-contain"
                  />
                </div>
                {/* <h2 className="text-xl font-bold transition-colors group-hover:text-[var(--primary-light)]">
                  GuptaJi Mens Wear
                </h2> */}
              </Link>

              

              <div className="flex gap-3">
                {[FiFacebook, FiTwitter, FiInstagram].map((Icon, i) => (
                  <button
                    key={i}
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-sm transition-all duration-200"
                    style={{
                      background: "rgba(15,23,42,0.4)",
                      color: "var(--text-light)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--primary)";
                      e.currentTarget.style.color = "var(--surface)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(15,23,42,0.4)";
                      e.currentTarget.style.color = "var(--text-light)";
                    }}
                  >
                    <Icon size={16} />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="mb-5 text-lg font-semibold">Quick Links</h3>

              <ul className="space-y-3 text-sm">
                {[
                  { name: "Home", path: "/" },
                  { name: "Products", path: "/products" },
                  { name: "About", path: "/about" },
                  { name: "Contact", path: "/contact" },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className="relative inline-block transition-colors"
                      style={{ color: "var(--text-light)" }}
                    >
                      <span className="group/link">
                        {item.name}
                        <span
                          className="absolute left-0 -bottom-1 h-[2px] w-0 transition-all duration-300"
                          style={{ background: "var(--primary)" }}
                        />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="mb-5 text-lg font-semibold">Services</h3>

             <ul
  className="space-y-2 text-sm"
  style={{ color: "var(--text-light)" }}
>
  <li>Latest Trends in Men&apos;s Fashion</li>
  <li>Premium Quality Fabrics & Stitching</li>
  <li>Perfect Fit for Every Occasion</li>
  <li>Easy Exchanges & Size Support</li>
</ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="mb-5 text-lg font-semibold">Contact Info</h3>

              <div
                className="space-y-3 text-sm"
                style={{ color: "var(--text-light)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full"
                    style={{ background: "rgba(36,133,168,0.15)" }}
                  >
                    <FiPhone
                      size={16}
                      style={{ color: "var(--primary-light)" }}
                    />
                  </div>
                  <span>+91 9993534374</span>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full"
                    style={{ background: "rgba(36,133,168,0.15)" }}
                  >
                    <FiMail
                      size={16}
                      style={{ color: "var(--primary-light)" }}
                    />
                  </div>
                  <a
                    href="mailto:zkonlineservices001@gmail.com"
                    className="transition-colors"
                    style={{ color: "var(--text-light)" }}
                  >
                    kg221688@gmail.com
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full"
                    style={{ background: "rgba(36,133,168,0.15)" }}
                  >
                    <FiMapPin
                      size={16}
                      style={{ color: "var(--primary-light)" }}
                    />
                  </div>
                  <span>Damoh, MP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div
            className="flex flex-col gap-3 border-t pt-5 text-sm md:flex-row md:items-center md:justify-between"
            style={{ borderColor: "#020617", color: "var(--text-light)" }}
          >
            <p className="text-xs md:text-sm">
              © 2026 GuptaJi Mens Wear. All rights reserved.
            </p>

            <p className="text-xs md:text-sm">
              Developed & Managed by{" "}
              <a
                href="https://khsitijgupta.github.io/Portfolio/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium transition-colors"
                style={{ color: "var(--primary-light)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--info)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--primary-light)")
                }
              >
                kshitijgupta
              </a>
              .
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
