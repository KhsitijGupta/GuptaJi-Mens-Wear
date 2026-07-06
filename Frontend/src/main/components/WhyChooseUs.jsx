import React from "react";
import {
  FiShield,
  FiTruck,
  FiHeart,
  FiMapPin,
  FiClock,
  FiUsers,
} from "react-icons/fi";

const values = [
  {
    icon: FiShield,
    title: "Quality First",
    desc: "Hand-picked fresh produce from trusted farms, rigorously quality checked before delivery.",
  },
  {
    icon: FiTruck,
    title: "Fast Delivery",
    desc: "Lightning 2-hour delivery across Indore with temperature-controlled transport.",
  },
  {
    icon: FiHeart,
    title: "Customer Trust",
    desc: "Transparent pricing, no hidden charges, and 100% satisfaction guaranteed always.",
  },
  {
    icon: FiMapPin,
    title: "Local Farmers",
    desc: "Direct partnerships with Indore's best farmers for freshest produce at fair prices.",
  },
  {
    icon: FiClock,
    title: "Always Available",
    desc: "24/7 customer support and same-day delivery for all your grocery emergencies.",
  },
  {
    icon: FiUsers,
    title: "Community Love",
    desc: "Serving 50K+ happy families while uplifting local farmers and communities.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-linear-to-br from-orange-50/50 via-white to-emerald-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-13">
          <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold text-gray-900 mb-4">
            Why Choose ZK?
          </h2>
          <p className="text-lg  text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Fresh groceries delivered with speed, quality, and care
          </p>
        </div>

        {/* Values Grid - 6 Cards */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {values.map((value, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-lg md:rounded-xl p-4 md:p-6 text-center shadow-md hover:shadow-xl hover:-translate-y-2 hover:border-orange-200 transition-all duration-500 border border-gray-100 h-full flex flex-col justify-center  mx-auto"
            >
              {/* Icon - Smaller */}
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 rounded-lg md:rounded-xl flex items-center justify-center bg-orange-50/80 text-orange-600 shadow-sm group-hover:shadow-md group-hover:bg-orange-100 transition-all duration-400 group-hover:scale-105 border border-orange-100">
                <value.icon className="w-6 h-6 md:w-8 md:h-8" />
              </div>

              {/* Title */}
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3 group-hover:text-orange-700 transition-colors">
                {value.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed text-xs md:text-sm flex-1 group-hover:text-gray-700 transition-colors px-2">
                {value.desc}
              </p>

              {/* Hover accent line */}
              <div className="absolute -bottom-2 md:-bottom-3 left-1/2 -translate-x-1/2 w-16 md:w-20 h-1 bg-orange-400 rounded opacity-0 group-hover:opacity-100 transition-all duration-500 scale-0 group-hover:scale-100 shadow-sm" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
