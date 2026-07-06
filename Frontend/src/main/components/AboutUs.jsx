import React from "react";
import {
  FiUsers,
  FiTruck,
  FiShield,
  FiTrendingUp,
  FiShoppingBag,
  FiClock,
} from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const AboutUsPage = ({ isHomePage = false }) => {
  const navigate = useNavigate();

  return (
    <>
      {!isHomePage && <Navbar />}

      {/* ================= HERO SECTION ================= */}
      <section
        className="relative overflow-hidden py-20 md:py-24"
        style={{
          background:
            "linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 45%, #0f172a 100%)",
          color: "var(--surface)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -top-24 -left-10 h-72 w-72 rounded-full blur-3xl bg-[rgba(15,23,42,0.7)]" />
          <div className="absolute top-32 right-0 h-80 w-80 rounded-full blur-3xl bg-[rgba(59,130,246,0.35)]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-2">
          {/* LEFT CONTENT */}
          <div>
            <h1 className="mb-5 text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
              Premium Men&apos;s Wear
              <br />
              For Every <span style={{ color: "var(--accent)" }}>Occasion</span>
            </h1>

            <p
              className="mb-8 text-sm md:text-base"
              style={{ color: "var(--surface)" }}
            >
              GuptaJi Men&apos;s Wear brings curated shirts, denim, formals and
              ethnic wear together – helping you look sharp from office to
              weddings.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/products")}
                className="rounded-xl px-8 py-3 text-sm font-semibold shadow-lg transition-transform duration-150"
                style={{
                  background: "var(--surface)",
                  color: "var(--primary-dark)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.03)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                Shop Collection
              </button>

              <button
                onClick={() => navigate("/about")}
                className="rounded-xl px-8 py-3 text-sm font-semibold transition-colors"
                style={{
                  border: "1px solid rgba(255,255,255,0.35)",
                  color: "var(--surface)",
                  background: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(15,23,42,0.28)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                Learn More
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE / MOCK */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1633380246874-e25cd8c2cc9d?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Men's fashion"
              className="h-full w-full rounded-3xl object-cover shadow-2xl"
            />

            {/* Floating Stats Card */}
            <div
              className="absolute -bottom-6 -left-4 rounded-2xl px-5 py-4 shadow-xl"
              style={{
                background: "var(--surface)",
                color: "var(--text-primary)",
                border: "1px solid var(--border)",
              }}
            >
              <h3
                className="text-2xl font-bold"
                style={{ color: "var(--primary)" }}
              >
                10K+
              </h3>
              <p
                className="text-xs font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                Happy Men&apos;s Fashion Customers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS SECTION ================= */}
      <section className="py-14" style={{ background: "var(--background)" }}>
        <div className="mx-auto grid max-w-7xl gap-6 px-6 text-center md:grid-cols-4">
          {[
            { icon: <FiUsers />, number: "10K+", label: "Happy Customers" },
            { icon: <FiTruck />, number: "Fast", label: "Quick Shipping" },
            { icon: <FiShield />, number: "Quality", label: "Checked Pieces" },
            {
              icon: <FiTrendingUp />,
              number: "New",
              label: "Styles Every Week",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="transform rounded-2xl bg-white p-7 shadow-sm transition-all duration-150 hover:-translate-y-1 hover:shadow-xl"
              style={{ border: "1px solid var(--border)" }}
            >
              <div
                className="mb-3 flex justify-center text-3xl"
                style={{ color: "var(--primary)" }}
              >
                {item.icon}
              </div>
              <h3
                className="text-xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {item.number}
              </h3>
              <p
                className="mt-1 text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section
        className="py-16 text-center"
        style={{
          background:
            "linear-gradient(135deg, var(--primary-dark), var(--primary))",
          color: "var(--surface)",
        }}
      >
        <h2 className="mb-5 text-2xl font-bold md:text-3xl">
          Ready to Upgrade Your Wardrobe?
        </h2>
        <button
          onClick={() => navigate("/products")}
          className="rounded-xl px-10 py-3 text-sm font-semibold shadow-lg transition-transform duration-150"
          style={{
            background: "var(--surface)",
            color: "var(--primary-dark)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.03)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          Explore Men&apos;s Collection
        </button>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="py-16" style={{ background: "var(--surface)" }}>
        <div className="mx-auto mb-10 max-w-7xl px-6 text-center">
          <h2
            className="mb-3 text-2xl font-bold md:text-3xl"
            style={{ color: "var(--text-primary)" }}
          >
            Why Choose GuptaJi Men&apos;s Wear?
          </h2>
          <p
            className="mx-auto max-w-2xl text-sm md:text-base"
            style={{ color: "var(--text-secondary)" }}
          >
            From classic formals to smart casuals, we focus on fit, fabric and
            finishing – so you don&apos;t have to compromise on style or
            comfort.
          </p>
        </div>

        <div className="mx-auto grid max-w-7xl gap-7 px-6 md:grid-cols-3">
          {[
            {
              icon: <FiShoppingBag />,
              title: "Curated Styles",
              desc: "Shirts, trousers, denim & ethnic wear picked for modern Indian men.",
            },
            {
              icon: <FiClock />,
              title: "Occasion Ready",
              desc: "Office, casual outings or weddings – find a look for every moment.",
            },
            {
              icon: <FiShield />,
              title: "Fit & Quality First",
              desc: "Consistent sizing, quality stitching and easy size support.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-3xl p-8 transition-shadow"
              style={{
                background:
                  "linear-gradient(135deg, rgba(36,133,168,0.06), rgba(15,23,42,0.03))",
                border: "1px solid var(--border)",
              }}
            >
              <div
                className="mb-4 text-3xl"
                style={{ color: "var(--primary)" }}
              >
                {item.icon}
              </div>
              <h3
                className="mb-2 text-lg font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {item.title}
              </h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {!isHomePage && <Footer />}
    </>
  );
};

export default AboutUsPage;
