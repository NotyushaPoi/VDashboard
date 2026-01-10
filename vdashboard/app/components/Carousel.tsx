"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Video } from "@/app/lib/types";

interface CarouselProps {
  videos: Video[];
}

export function Carousel({ videos }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay || videos.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % videos.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlay, videos.length]);

  if (videos.length === 0) {
    return null;
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 6000);
  };

  const goToPrevious = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + videos.length) % videos.length
    );
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 6000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 6000);
  };

  return (
    <div
      className="relative w-full bg-gray-200 rounded-xl overflow-hidden group"
      style={{ aspectRatio: "16/6" }}
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* 只渲染当前索引的视频 */}
      {(() => {
        const video = videos[currentIndex];
        return (
          <a
            href={video.videoUrl}
            key={video.id}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 cursor-pointer group/item"
            style={{
              opacity: 1,
              transition: "opacity 0.5s ease-in-out",
            }}
          >
            {/* Background Image */}
            <Image
              src={video.cover}
              alt={video.title}
              fill
              className="object-cover"
              priority={currentIndex === videos.indexOf(video)}
              sizes="100vw"
            />
            {/* Fallback gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-br from-purple-400 via-pink-400 to-purple-500 opacity-0" />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/20 transition-colors" />
            {/* Video Title at Bottom Left */}
            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-6">
              <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg">
                {video.title}
              </h3>
              {video.description && (
                <p className="text-white/80 text-sm mt-2 line-clamp-2">
                  {video.description}
                </p>
              )}
            </div>
          </a>
        );
      })()}

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
        {videos.map((_, index) => (
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
    </div>
  );
}
