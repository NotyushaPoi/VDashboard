"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Streamer } from "@/app/lib/types";

interface CarouselProps {
  streamers: Streamer[];
}

export function Carousel({ streamers }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % streamers.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlay, streamers.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);
  };

  const goToPrevious = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + streamers.length) % streamers.length
    );
    setIsAutoPlay(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % streamers.length);
    setIsAutoPlay(false);
  };

  const currentStreamer = streamers[currentIndex];

  return (
    <div
      className="relative w-full h-96 md:h-[500px] bg-gray-200 dark:bg-gray-800 rounded-xl overflow-hidden group"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* Images */}
      {streamers.map((streamer, index) => (
        <Link
          href={`/streamer/${streamer.id}`}
          key={streamer.id}
          className="absolute inset-0 cursor-pointer"
          style={{
            opacity: index === currentIndex ? 1 : 0,
            transition: "opacity 0.5s ease-in-out",
          }}
        >
          <div className="relative w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xl font-bold">
            {streamer.banner}
            <span className="absolute bottom-6 left-6 text-2xl font-bold drop-shadow-lg">
              {streamer.name}
            </span>
          </div>
        </Link>
      ))}

      {/* Previous Button */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Next Button */}
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {streamers.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Info Panel */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 z-10">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
          {currentStreamer.name}
        </h3>
        <p className="text-white/90 text-sm md:text-base line-clamp-2">
          {currentStreamer.bio}
        </p>
        <Link
          href={`/streamer/${currentStreamer.id}`}
          className="mt-4 inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-shadow w-fit"
        >
          查看详情 →
        </Link>
      </div>
    </div>
  );
}
