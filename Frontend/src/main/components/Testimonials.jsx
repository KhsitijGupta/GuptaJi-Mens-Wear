// import React from "react";
// import { FiStar } from "react-icons/fi";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Pagination, Autoplay } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";

// const testimonials = [
//   {
//     name: "Priya Sharma",
//     text: "Fresh vegetables delivered super fast. Makes my life so much easier!",
//     rating: 5,
//     avatar:
//       "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200",
//   },
//   {
//     name: "Rahul Patel",
//     text: "Best grocery service in Indore. Great quality at reasonable prices.",
//     rating: 5,
//     avatar:
//       "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
//   },
//   {
//     name: "Anita Verma",
//     text: "Love the fresh produce variety. App is very user-friendly too!",
//     rating: 5,
//     avatar:
//       "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
//   },
//   {
//     name: "Amit Singh",
//     text: "Reliable weekly grocery delivery. Always fresh and excellent service.",
//     rating: 5,
//     avatar:
//       "https://images.unsplash.com/photo-1502764613149-7f1d229e230f?w=200",
//   },
// ];

// const Testimonials = () => {
//   return (
//     <section className="relative py-28 bg-linear-to-br from-orange-50 via-white to-emerald-50 overflow-hidden">

//       {/* Floating Background Blur */}
//       <div className="absolute top-0 left-0 w-72 h-72 bg-orange-200 rounded-full blur-3xl opacity-30 -z-10"></div>
//       <div className="absolute bottom-0 right-0 w-72 h-72 bg-emerald-200 rounded-full blur-3xl opacity-30 -z-10"></div>

//       <div className="max-w-6xl mx-auto px-6">

//         {/* HEADER */}
//         <div className="text-center mb-16">
//           <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//             Testimonial
//           </h2>
//           <p className="text-gray-600 text-lg max-w-2xl mx-auto">
//             Thousands trust ZK Online Service for fresh groceries delivered in 2 hours.
//           </p>

//           {/* Rating Badge */}
//           <div className="mt-6 inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md">
//             <div className="flex text-orange-400">
//               {[...Array(5)].map((_, i) => (
//                 <FiStar key={i} className="fill-orange-400" />
//               ))}
//             </div>
//             <span className="font-semibold text-gray-800">4.9/5 Rating</span>
//           </div>
//         </div>

//         {/* SLIDER */}
//         <Swiper
//           modules={[Pagination, Autoplay]}
//           spaceBetween={30}
//           slidesPerView={1}
//           loop
//           autoplay={{ delay: 4000 }}
//           pagination={{ clickable: true }}
//           breakpoints={{
//             768: { slidesPerView: 2 },
//             1024: { slidesPerView: 3 },
//           }}
//         >
//           {testimonials.map((testimonial, index) => (
//             <SwiperSlide key={index} className="mb-12">
//               <div className="bg-white/70 backdrop-blur-lg border border-orange-100 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition duration-500 hover:-translate-y-3 flex flex-col justify-between h-full">

//                 {/* Stars */}
//                 <div className="flex gap-1 mb-6 text-orange-400">
//                   {[...Array(5)].map((_, i) => (
//                     <FiStar key={i} className="fill-orange-400" />
//                   ))}
//                 </div>

//                 {/* Quote */}
//                 <p className="text-gray-700 leading-relaxed mb-8 flex-1 italic text-base">
//                   “{testimonial.text}”
//                 </p>

//                 {/* Author */}
//                 <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
//                   <img
//                     src={testimonial.avatar}
//                     alt={testimonial.name}
//                     className="w-14 h-14 rounded-full object-cover ring-4 ring-orange-100"
//                   />
//                   <div>
//                     <h4 className="font-semibold text-gray-900">
//                       {testimonial.name}
//                     </h4>
//                     <p className="text-sm text-gray-500">Verified Customer</p>
//                   </div>
//                 </div>
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>
//     </section>
//   );
// };

// export default Testimonials;
import React from "react";
import { FiStar } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
  {
    name: "Priya Sharma",
    text: "Fresh fabrics, perfect fitting, and on‑time delivery. GuptaJi has become my go‑to for menswear.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200",
  },
  {
    name: "Rahul Patel",
    text: "Great collection for every occasion. The styling guidance helped a lot before my event.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
  },
  {
    name: "Anita Verma",
    text: "Ordered formals for my brother. Quality, stitching and fit were all on point.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
  },
  {
    name: "Amit Singh",
    text: "Super smooth experience. Sizes were accurate and exchange support was very helpful.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1502764613149-7f1d229e230f?w=200",
  },
];

const Testimonials = () => {
  return (
    <section
      className="relative overflow-hidden py-20 md:py-24"
      style={{
        background:
          "radial-gradient(circle at top left, rgba(59,130,246,0.10), transparent 55%), radial-gradient(circle at bottom right, rgba(56,189,248,0.12), transparent 55%), var(--background)",
      }}
    >
      {/* Soft glowing blobs */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div
          className="absolute -top-24 -left-20 h-72 w-72 rounded-full blur-3xl"
          style={{ background: "rgba(59,130,246,0.18)" }}
        />
        <div
          className="absolute bottom-0 right-0 h-72 w-72 rounded-full blur-3xl"
          style={{ background: "rgba(56,189,248,0.16)" }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        {/* Header */}
        <div className="mb-12 text-center md:mb-16">
          <span
            className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.25em]"
            style={{
              background: "rgba(15,23,42,0.8)",
              color: "var(--primary-light)",
              border: "1px solid rgba(148,163,184,0.7)",
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
            Trusted by shoppers
          </span>

          <h2
            className="mt-5 text-2xl font-bold md:text-4xl"
            style={{ color: "var(--text-primary)" }}
          >
            What our customers say
          </h2>

          <p
            className="mx-auto mt-3 max-w-2xl text-sm md:text-base"
            style={{ color: "var(--text-secondary)" }}
          >
            Real reviews from people who shop menswear at GuptaJi – quality, fit
            and service they can rely on.
          </p>

          {/* Rating badge */}
          <div
            className="mt-6 inline-flex items-center gap-3 rounded-full px-5 py-2.5 text-xs md:text-sm"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              boxShadow: "var(--card-shadow)",
              backdropFilter: "blur(14px)",
            }}
          >
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className="h-4 w-4 fill-yellow-400" />
              ))}
            </div>
            <span
              className="font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              4.9/5 average rating
            </span>
            <span
              className="text-[11px]"
              style={{ color: "var(--text-secondary)" }}
            >
              Based on 500+ orders
            </span>
          </div>
        </div>

        {/* Slider */}
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          loop
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index} className="pb-12 my-5">
              <div
                className="flex h-full flex-col justify-between rounded-3xl p-6 text-sm shadow-lg transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl md:p-7"
                style={{
                  background:
                    "radial-gradient(circle at top left, rgba(59, 131, 246, 0.438), rgba(15,23,42,0.95))",
                  border: "1px solid rgba(148,163,184,0.7)",
                  backdropFilter: "blur(18px)",
                }}
              >
                {/* Stars */}
                <div className="mb-5 flex gap-1 text-yellow-400">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar
                      key={i}
                      className="h-4 w-4 fill-yellow-400 drop-shadow-sm"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p
                  className="mb-6 flex-1 text-sm leading-relaxed md:text-[15px]"
                  style={{ color: "#e5e7eb" }}
                >
                  “{testimonial.text}”
                </p>

                {/* Author */}
                <div
                  className="flex items-center gap-4 border-t pt-5"
                  style={{ borderColor: "rgba(148,163,184,0.5)" }}
                >
                  <div className="relative">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="h-12 w-12 rounded-full object-cover md:h-14 md:w-14"
                      style={{
                        boxShadow:
                          "0 0 0 3px rgba(15,23,42,1), 0 0 0 5px rgba(59,130,246,0.6)",
                      }}
                    />
                    <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white">
                      ✓
                    </span>
                  </div>
                  <div className="leading-tight">
                    <h4
                      className="text-sm font-semibold md:text-base"
                      style={{ color: "var(--surface)" }}
                    >
                      {testimonial.name}
                    </h4>
                    <p
                      className="text-[11px] md:text-xs"
                      style={{ color: "rgba(209,213,219,0.85)" }}
                    >
                      Verified customer
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Bottom line */}
        <div className="mt-6 text-center">
          <p
            className="text-xs md:text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            Join hundreds of shoppers who already trust us for everyday and
            occasion wear.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
