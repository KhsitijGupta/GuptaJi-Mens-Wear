import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ImageSlider = ({ images = [], productName }) => {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const thumbRef = useRef(null);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  /* -------- TOUCH EVENTS -------- */
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) nextSlide();
    if (touchStartX.current - touchEndX.current < -50) prevSlide();
  };

  /* -------- THUMB SCROLL -------- */
  const scrollThumbs = (direction) => {
    if (!thumbRef.current) return;

    const scrollAmount = 150;
    thumbRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (!images.length) return null;

  return (
    <div className="w-full bg-white rounded-2xl shadow p-1">
      {/* MAIN IMAGE */}
      <div className="relative overflow-hidden rounded-xl">
        <div
          className="w-full flex items-center justify-center bg-gray-50"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={images[current]}
            alt={productName}
            className="w-full h-[260px] sm:h-[400px] lg:h-[440px] object-contain"
          />
        </div>

        <button
          onClick={prevSlide}
          className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={nextSlide}
          className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* THUMBNAIL SLIDER */}
      <div className="relative ">
        {/* Left Thumb Button */}
        <button
          onClick={() => scrollThumbs("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow p-1 rounded-full z-10"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Thumbnails */}
        <div
          ref={thumbRef}
          className="flex gap-3  scroll-smooth px-8 scrollbar-hide"
        >
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`thumb-${index}`}
              onClick={() => setCurrent(index)}
              className={`h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-lg cursor-pointer border-2 shrink-0 transition-all ${
                current === index
                  ? "border-black scale-105"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            />
          ))}
        </div>

        {/* Right Thumb Button */}
        <button
          onClick={() => scrollThumbs("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow p-1 rounded-full z-10"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default ImageSlider;
