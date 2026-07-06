import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useNavigate } from "react-router-dom";import api from '@/utils/api';

const defaultSlides = [
  {
    title: "Redefine Your Style with Premium Men's Fashion",
    desc: "Discover a wide range of stylish shirts, t-shirts, jeans, trousers, and ethnic wear crafted for the modern gentleman.",
    badge: "🔥 New Arrivals",
  },
  {
    title: "Quality You Can Wear with Confidence",
    desc: "Experience superior fabrics, perfect fitting, and timeless designs that keep you comfortable and stylish every day.",
    badge: "⭐ Premium Collection",
  },
  {
    title: "Dress Smart. Look Sharp. Feel Confident.",
    desc: "Shop the latest fashion trends with exclusive deals, trusted quality, and fast doorstep delivery—all in one place.",
    badge: "🚚 Free Delivery on Selected Orders",
  },
];

const HeroSlider = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await api.get("/api/websiteBanner/getAllWebsiteBanners");
        console.log("Fetched slider images:", res.data);
        setImages(res.data);
      } catch (error) {
        console.error("Error loading slider images", error);
      }
    };

    fetchImages();
  }, []);

  return (
    <>
      <style jsx>{`
        .swiper-pagination {
          bottom: 20px !important;
        }

        .swiper-pagination-bullet {
          width: 12px !important;
          height: 12px !important;
          margin: 0 6px !important;
          border-radius: 999px !important;
          background: var(--primary) !important;
          opacity: 0.35 !important;
          transition: all 0.35s ease;
        }

        .swiper-pagination-bullet:hover {
          opacity: 0.7 !important;
          transform: scale(1.1);
        }

        .swiper-pagination-bullet-active {
          width: 34px !important;
          border-radius: 999px !important;
          background: linear-gradient(
            90deg,
            var(--primary),
            var(--primary-light)
          ) !important;
          opacity: 1 !important;
          box-shadow: 0 4px 12px rgba(36, 133, 168, 0.35);
        }
      `}</style>

      <section className="relative overflow-hidden m-3 rounded-3xl border border-[var(--border)] bg-[var(--background)] shadow-2xl">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop
          speed={900}
          className="h-[45vh] sm:h-[55vh] md:h-[68vh] lg:h-[75vh]"
        >
          {images.map((img, index) => {
            const slideContent = defaultSlides[index % defaultSlides.length];

            return (
              <SwiperSlide key={index}>
                <div
                  className="relative flex h-full items-center overflow-hidden"
                  style={{
                    backgroundImage: `
                linear-gradient(
                  90deg,
                  rgba(17,24,39,.82) 0%,
                  rgba(17,24,39,.60) 35%,
                  rgba(36,133,168,.28) 70%,
                  rgba(17,24,39,.35) 100%
                ),
                url(${img.image})
              `,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* Decorative Blur */}
                  <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[var(--primary)]/20 blur-3xl"></div>
                  <div className="absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-white/10 blur-3xl"></div>

                  {/* Content */}
                  <div className="relative z-10 max-w-3xl px-6 md:px-16 text-center md:text-left">
                    {/* Badge */}
                    <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-5 py-2 text-xs md:text-sm font-semibold tracking-wide text-white shadow-lg">
                      {slideContent.badge}
                    </span>

                    {/* Heading */}
                    <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white drop-shadow-xl">
                      {slideContent.title}
                    </h1>

                    {/* Description */}
                    <p className="mt-6 max-w-xl text-sm sm:text-base md:text-lg leading-7 text-white/85">
                      {slideContent.desc}
                    </p>

                    {/* Buttons */}
                    <div className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
                      <button
                        onClick={() => navigate("/products")}
                        className="rounded-xl bg-[var(--primary)] px-8 py-3 font-semibold text-white shadow-xl transition-all duration-300 hover:bg-[var(--hover)] hover:scale-105"
                      >
                        Shop Collection
                      </button>

                      <button
                        onClick={() => navigate("/categories")}
                        className="rounded-xl border border-white/30 bg-white/10 backdrop-blur-md px-8 py-3 font-semibold text-white transition-all duration-300 hover:bg-white/20"
                      >
                        Explore Styles
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </section>
    </>
  );
};

export default HeroSlider;
