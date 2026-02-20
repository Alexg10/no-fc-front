"use client";

import { getStrapiImageUrl } from "@/lib/strapi";
import type { StrapiCommunAboutScrollAnim } from "@/types/strapi";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";
import Image from "next/image";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText);

interface AboutScrollAnimBlockProps {
  block: StrapiCommunAboutScrollAnim;
}

export function AboutScrollAnimBlock({ block }: AboutScrollAnimBlockProps) {
  console.log("[AboutScrollAnimBlock] block", block);

  const containerRef = useRef<HTMLDivElement>(null);
  const firstSceneRef = useRef<HTMLDivElement>(null);
  const firstImagesRefs = useRef<(HTMLDivElement | null)[]>([]);
  const firstSceneTitleRef = useRef<HTMLParagraphElement>(null);
  const secondSceneRef = useRef<HTMLDivElement>(null);
  const secondSceneTitleRef = useRef<HTMLParagraphElement>(null);
  const thirdSceneRef = useRef<HTMLDivElement>(null);
  const thirdSceneTitleRef = useRef<HTMLParagraphElement>(null);
  const thirdSceneImageRef = useRef<HTMLDivElement>(null);
  const fourthSceneRef = useRef<HTMLDivElement>(null);
  const fourthSceneTitleRef = useRef<HTMLParagraphElement>(null);
  const fourthSceneTopImageRef = useRef<HTMLDivElement>(null);
  const fourthSceneBottomImageRef = useRef<HTMLDivElement>(null);
  const fourthSceneImages = useRef<(HTMLDivElement | null)[]>([]);

  const parallaxValues = [100, -150, 120, -80];
  const fourthSceneParallaxValues = [470, -400, -220, -380];

  useGSAP(
    () => {
      if (!firstSceneRef.current || !secondSceneRef.current) return;
      if (!block.firstImages?.length) return;

      const firstSceneTitleSplit = SplitText.create(
        firstSceneTitleRef.current,
        {
          type: "words",
        },
      );
      const secondSceneTitleSplit = SplitText.create(
        secondSceneTitleRef.current,
        {
          type: "words",
        },
      );
      const thirdSceneTitleSplit = SplitText.create(
        thirdSceneTitleRef.current,
        {
          type: "words",
        },
      );
      const fourthSceneTitleSplit = SplitText.create(
        fourthSceneTitleRef.current,
        {
          type: "words",
        },
      );

      const aboutTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=400%",
          pin: true,
          pinSpacing: true,
          scrub: 1,
          // markers: true,
        },
      });
      aboutTimeline
        .from(firstSceneTitleSplit.words, {
          opacity: 0,
          stagger: { each: 0.15 },
          duration: 0.1,
        })
        .to(secondSceneRef.current, {
          height: "100vh",
          duration: 0.3,
        })
        .from(
          secondSceneTitleSplit.words,
          {
            opacity: 0,
            stagger: { each: 0.15 },
            duration: 0.1,
          },
          "secondSceneTitleSplit-=0.4",
        )
        .from(
          secondSceneTitleRef.current,
          {
            yPercent: 25,
            duration: 0.1,
          },
          "secondSceneTitle-=0.6",
        )
        .to(
          thirdSceneRef.current,
          {
            display: "flex",
            duration: 0.3,
          },
          "thirdScene",
        )
        .from(
          thirdSceneTitleSplit.words,
          {
            opacity: 0,
            stagger: { each: 0.1 },
            duration: 0.1,
          },
          "thirdSceneTitleSplit-=0.3",
        )
        .from(
          thirdSceneImageRef.current,
          {
            yPercent: 100,
            duration: 0.5,
          },
          "thirdSceneImage-=0.3",
        )
        .to({}, { duration: 0.5 })
        .to(
          fourthSceneRef.current,
          {
            display: "flex",
            duration: 0.3,
          },
          "fourthSceneTitleSplit",
        )
        .from(
          fourthSceneTitleSplit.words,
          {
            opacity: 0,
            stagger: { each: 0.1 },
            duration: 0.1,
          },
          "fourthSceneTitleSplit",
        )
        .to(
          fourthSceneTopImageRef.current,
          {
            yPercent: -100,
            duration: 1,
          },
          "fourthSceneImage-=0.3",
        )
        .to(
          fourthSceneBottomImageRef.current,
          {
            yPercent: 100,
            duration: 1,
          },
          "fourthSceneImage-=0.3",
        );

      fourthSceneImages.current.forEach((img, index) => {
        if (!img) return;
        aboutTimeline.to(
          img,
          {
            y: fourthSceneParallaxValues[
              index % fourthSceneParallaxValues.length
            ],
            duration: 1,
          },
          "fourthSceneImage-=0.3",
        );
      });

      firstImagesRefs.current.forEach((img, index) => {
        if (!img) return;
        gsap.fromTo(
          firstImagesRefs.current[index],
          { y: 0 },
          {
            y: parallaxValues[index % parallaxValues.length],
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          },
        );
      });
    },
    { scope: containerRef },
  );

  if (!block.firstImages?.length) return null;

  return (
    <section
      className=" min-h-screen overflow-hidden relative flex flex-col justify-center items-center"
      ref={containerRef}
    >
      <div
        className="w-full h-screen flex justify-center items-center relative"
        ref={firstSceneRef}
      >
        <div className="w-full h-full absolute inset-0">
          <Image
            src={"/images/about/papper-texture-about.jpg"}
            alt="Papper texture about"
            fill
            className="object-cover"
          />
        </div>
        {block.firstImages?.map((image, index) => (
          <div
            key={image.id}
            className={[
              "absolute aspect-2/3 w-[38vw] lg:w-[22vw]",
              index === 0
                ? "top-[5%] left-[25%] lg:top-[8%] lg:left-[44%] -rotate-6"
                : index === 1
                  ? "bottom-[14%] right-[2%] lg:bottom-[6%] lg:right-[6%] rotate-[5deg]"
                  : "bottom-[5%] left-[-8%] lg:bottom-[8%] lg:left-[12%] rotate-8",
            ].join(" ")}
            ref={(el) => {
              firstImagesRefs.current[index] = el;
            }}
          >
            <Image
              src={getStrapiImageUrl(image.url)}
              alt={image.alternativeText || ""}
              fill
              className="object-cover first-images"
            />
          </div>
        ))}
        <p
          className="heading-xl-obviously text-pink text-center px-10 relative z-10"
          ref={firstSceneTitleRef}
        >
          Aesthetic football isn’t just Zidane & Riquelme.
        </p>
      </div>
      <div
        className="flex flex-wrap gap-4 absolute justify-center items-center inset-0 z-10 top-1/2 -translate-y-1/2 w-full h-0 overflow-hidden"
        ref={secondSceneRef}
      >
        <video
          src="/videos/about/about-texture-video.mp4"
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
        <div
          className="absolute top-[-40px] left-0 w-full h-[100px] bg-no-repeat"
          style={{
            backgroundImage: `url("/images/article/article_ripped.webp")`,
            backgroundSize: "auto 65%",
          }}
        />

        <p
          className="heading-xl-obviously text-white w-full text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          ref={secondSceneTitleRef}
        >
          ARE WE A MEDIA?
          <br />
          ARE WE A DESIGNERS?
        </p>
        <div
          className="absolute bottom-[-50px] left-0 w-full h-[100px] bg-no-repeat"
          style={{
            backgroundImage: `url("/images/article/article_ripped.webp")`,
            backgroundSize: "auto 65%",
          }}
        />
      </div>
      <div
        className="hidden flex-wrap gap-4 absolute justify-center inset-0 z-30 top-1/2 -translate-y-1/2 w-full h-full overflow-hidden"
        ref={thirdSceneRef}
      >
        <video
          src="/videos/about/about-scene-three.mp4"
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="text-pink heading-xl-obviously text-center text-[160px] lg:text-[400px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <p ref={thirdSceneTitleRef}>
            We <br />
            Don&apos;t
            <br />
            Care
          </p>
        </div>
        <div
          className=" absolute -bottom-10 left-1/2 -translate-x-1/2"
          ref={thirdSceneImageRef}
        >
          <Image
            src={"/images/about/wdc.png"}
            alt="Papper texture about"
            className="object-contain"
            width={830}
            height={830}
          />
        </div>
      </div>
      <div
        className="w-full h-screen hidden justify-center items-center absolute inset-0 z-30"
        ref={fourthSceneRef}
      >
        <div className="w-full h-full absolute inset-0">
          <Image
            src={"/images/about/papper-texture-about.jpg"}
            alt="Papper texture about"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 w-full h-full">
          {block.fourthSceneImages?.map((image, index) => (
            <div
              key={image.id}
              className={[
                "absolute aspect-2/3 w-[38vw] lg:w-[22vw]",
                index === 0
                  ? "top-[0%] left-[25%] lg:top-[-30%] lg:left-[44%] -rotate-6"
                  : index === 1
                    ? "bottom-[-10%] right-[2%] lg:bottom-[-36%] lg:right-[6%] rotate-[5deg]"
                    : "bottom-[-5%] left-[-8%] lg:bottom-[-8%] lg:left-[12%] rotate-8",
              ].join(" ")}
              ref={(el) => {
                fourthSceneImages.current[index] = el;
              }}
            >
              <Image
                src={getStrapiImageUrl(image.url)}
                alt={image.alternativeText || ""}
                fill
                className="object-cover first-images"
              />
            </div>
          ))}
        </div>
        <div
          className="w-full h-1/3 absolute top-0 left-0"
          ref={fourthSceneTopImageRef}
        >
          <Image
            src={"/images/about/fourth-top.webp"}
            alt="Papper texture about"
            className="object-cover"
            fill
          />
        </div>
        <div
          className="w-full h-1/3 absolute bottom-0 left-0"
          ref={fourthSceneBottomImageRef}
        >
          <Image
            src={"/images/about/fourth-bottom.webp"}
            alt="Papper texture about"
            className="object-cover"
            fill
          />
        </div>

        <p
          className="heading-xl-obviously text-pink text-center px-10 relative z-10"
          ref={fourthSceneTitleRef}
        >
          We're here to show
          <br />
          footbal how we see it.
        </p>
      </div>
    </section>
  );
}
