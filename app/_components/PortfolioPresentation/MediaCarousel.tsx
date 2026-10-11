"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { useState } from "react";

import { Image } from "@/components/ui/Image";

import type { ProjectSlide } from "./projects";
import styles from "./styles.module.scss";

type MediaCarouselProps = {
  priority?: boolean;
  projectTitle: string;
  slides: ProjectSlide[];
};

const MediaCarousel: React.FC<MediaCarouselProps> = ({ priority = false, projectTitle, slides }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultipleSlides = slides.length > 1;

  const showPrevious = () => setActiveIndex((index) => (index - 1 + slides.length) % slides.length);
  const showNext = () => setActiveIndex((index) => (index + 1) % slides.length);

  return (
    <div className={styles.carousel} aria-roledescription="carousel" aria-label={`${projectTitle} media`}>
      <div className={styles.carouselViewport}>
        <div className={styles.carouselTrack} style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
          {slides.map((slide, slideIndex) => (
            <div
              className={styles.slide}
              data-count={slide.media.length}
              aria-hidden={slideIndex !== activeIndex}
              key={slide.media.map(({ src }) => src).join("|")}
            >
              {slide.media.map((media) => (
                <figure className={styles.mediaFrame} key={media.src}>
                  <Image
                    className={styles.media}
                    data-fit={media.fit ?? "cover"}
                    src={media.src}
                    alt={media.alt}
                    loading={priority && slideIndex === 0 ? "eager" : "lazy"}
                    sizes={
                      slide.media.length === 2
                        ? "(max-width: 768px) 50vw, 560px"
                        : "(max-width: 1200px) 100vw, 1120px"
                    }
                  />
                </figure>
              ))}
            </div>
          ))}
        </div>
      </div>

      {hasMultipleSlides && (
        <div className={styles.carouselControls}>
          <button type="button" onClick={showPrevious} aria-label={`Previous ${projectTitle} media slide`}>
            <ChevronLeftIcon aria-hidden="true" />
          </button>
          <span aria-label={`Slide ${activeIndex + 1} of ${slides.length}`}>
            {activeIndex + 1} / {slides.length}
          </span>
          <button type="button" onClick={showNext} aria-label={`Next ${projectTitle} media slide`}>
            <ChevronRightIcon aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MediaCarousel;
