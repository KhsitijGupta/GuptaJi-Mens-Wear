import React from "react";
import { Truck, Leaf, Gift, CreditCard } from "lucide-react";

const features = [
  {
    icon: <Truck className="w-9 h-9" style={{ color: "var(--primary)" }} />,
    title: "Fast Delivery",
    description: "Doorstep delivery on time for every occasion.",
  },
  {
    icon: <Leaf className="w-9 h-9" style={{ color: "var(--primary)" }} />,
    title: "Premium Fabrics",
    description: "Comfortable, long‑lasting materials for daily wear.",
  },
  {
    icon: <Gift className="w-9 h-9" style={{ color: "var(--primary)" }} />,
    title: "Best Style Deals",
    description: "Seasonal offers on shirts, jeans & ethnic wear.",
  },
  {
    icon: (
      <CreditCard className="w-9 h-9" style={{ color: "var(--primary)" }} />
    ),
    title: "Secure Payments",
    description: "Safe checkout with multiple payment options.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-6 my-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 rounded-2xl p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              {/* Icon wrapper */}
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ background: "rgba(36,133,168,0.08)" }}
              >
                {item.icon}
              </div>

              {/* Text */}
              <div>
                <h3
                  className="text-sm font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {item.title}
                </h3>
                <p
                  className="mt-1 text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
