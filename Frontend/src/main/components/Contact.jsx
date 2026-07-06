import React, { useState } from "react";import api from '@/utils/api';
import Swal from "sweetalert2";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiFacebook,
  FiInstagram,
  FiTwitter,
} from "react-icons/fi";
import { BsWhatsapp } from "react-icons/bs";
import Navbar from "../components/Navbar";
import Footer from "./Footer";

const Contact = ({ isHomePage = false }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/api/contact/addContactMessage", formData);

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Message Sent Successfully!",
          text: "Thank you for reaching out to us.",
          confirmButtonColor: "#2563eb",
        });

        setFormData({
          fullName: "",
          email: "",
          message: "",
        });
      }
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to send message. Please try again.",
      });
    }
  };

  const socialLinks = [
    { icon: FiFacebook, href: "#" },
    { icon: FiInstagram, href: "#" },
    { icon: BsWhatsapp, href: "#" },
    { icon: FiTwitter, href: "#" },
  ];

  return (
    <>
      {!isHomePage && <Navbar />}

      <div
        className="min-h-screen py-10"
        style={{
          background:
            "linear-gradient(45deg, var(--background) 0%, #ffffff 40%, #e0f2fe 100%)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          {/* Heading */}
          <div className="mb-6 text-center">
            <h1
              className="text-xl font-bold md:text-3xl"
              style={{ color: "var(--text-primary)" }}
            >
              Contact Us
            </h1>
            <p
              className="mx-auto max-w-2xl text-sm font-medium leading-relaxed md:text-base"
              style={{ color: "var(--text-secondary)" }}
            >
              Have a question about sizes, orders, or styles? Send us a message
              and we&apos;ll get back to you shortly.
            </p>
          </div>

          {/* Main Card */}
          <div
            className="mx-auto rounded-3xl border bg-white/95 p-4 shadow-xl md:p-10"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="grid items-start gap-8 md:gap-10 lg:grid-cols-2">
              {/* Contact Details */}
              <div className="space-y-4">
                {/* Phone */}
                <div
                  className="group min-w-72 rounded-xl border p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(248,250,252,1), rgba(226,232,240,0.6))",
                    borderColor: "var(--border)",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-white shadow-sm"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                      }}
                    >
                      <FiPhone className="h-5 w-5" />
                    </div>
                    <div>
                      <h3
                        className="mb-1 text-sm font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Phone
                      </h3>
                      <p
                        className="mb-1 text-base font-bold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        +91 9993534374
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        10 AM – 8 PM, All days
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div
                  className="group min-w-72 rounded-xl border p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(248,250,252,1), rgba(224,242,254,0.6))",
                    borderColor: "var(--border)",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-white shadow-sm"
                      style={{
                        background: "linear-gradient(135deg, #22c55e, #16a34a)",
                      }}
                    >
                      <FiMail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3
                        className="mb-1 text-sm font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Email
                      </h3>
                      <p
                        className="mb-1 text-sm font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        kg221688@gmail.com
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        We usually reply within a few hours.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div
                  className="group min-w-72 rounded-xl border p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(248,250,252,1), rgba(219,234,254,0.6))",
                    borderColor: "var(--border)",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-white shadow-sm"
                      style={{
                        background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                      }}
                    >
                      <FiMapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3
                        className="mb-1 text-sm font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Store Address
                      </h3>
                      <p
                        className="mb-1 text-xs font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        GuptaJi Men&apos;s Wear
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Killai Naka ,Damoh, MP
                      </p>
                    </div>
                  </div>
                </div>

                {/* Follow Us */}
                <div
                  className="rounded-xl border p-4 shadow-sm"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(239,246,255,1), rgba(219,234,254,1))",
                    borderColor: "var(--border)",
                  }}
                >
                  <h3
                    className="mb-3 flex items-center gap-2 text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: "var(--primary)" }}
                    />
                    Follow Us
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/social flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border bg-white text-gray-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                        style={{ borderColor: "var(--border)" }}
                      >
                        <social.icon className="h-4 w-4 transition-colors group-hover/social:text-[var(--primary)]" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div
                className="rounded-2xl border p-5 shadow-lg md:p-6"
                style={{
                  background:
                    "linear-gradient(135deg, #ffffff, rgba(248,250,252,1))",
                  borderColor: "var(--border)",
                }}
              >
                <h2
                  className="mb-4 text-lg font-bold md:text-xl"
                  style={{ color: "var(--text-primary)" }}
                >
                  Send us a message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your name"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="w-full rounded-lg px-4 py-2.5 text-sm shadow-sm transition-all duration-200 focus:outline-none"
                      style={{
                        background: "white",
                        border: "1px solid var(--border)",
                      }}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full rounded-lg px-4 py-2.5 text-sm shadow-sm transition-all duration-200 focus:outline-none"
                      style={{
                        background: "white",
                        border: "1px solid var(--border)",
                      }}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Message *
                    </label>
                    <textarea
                      rows="4"
                      required
                      placeholder="How can we help you?"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full resize-vertical rounded-lg px-4 py-2.5 text-sm shadow-sm transition-all duration-200 focus:outline-none"
                      style={{
                        background: "white",
                        border: "1px solid var(--border)",
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-lg py-3 text-sm font-semibold shadow-lg transition-all duration-200"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                      color: "var(--surface)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "translateY(-2px)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "translateY(0)")
                    }
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!isHomePage && <Footer />}
    </>
  );
};

export default Contact;
