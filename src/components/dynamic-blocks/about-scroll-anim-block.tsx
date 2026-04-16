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
  const fourthSceneBackgroundRef = useRef<HTMLDivElement>(null);
  const fourthSceneTopImageRef = useRef<HTMLDivElement>(null);
  const fourthSceneBottomImageRef = useRef<HTMLDivElement>(null);
  const fourthSceneImages = useRef<(HTMLDivElement | null)[]>([]);
  const fifthSceneRef = useRef<HTMLDivElement>(null);
  const fifthSceneTitleRef = useRef<HTMLDivElement>(null);
  const fifthSceneSecondTitleRef = useRef<HTMLDivElement>(null);
  const sixthSceneRef = useRef<HTMLDivElement>(null);
  const sixthSceneTopPartRef = useRef<HTMLDivElement>(null);
  const sixthSceneBottomPartRef = useRef<HTMLDivElement>(null);
  const sixthScenePictureOne = useRef<HTMLDivElement>(null);
  const sixthScenePictureTwo = useRef<HTMLDivElement>(null);
  const sixthScenePictureTwoBis = useRef<HTMLDivElement>(null);
  const sixthScenePictureThree = useRef<HTMLDivElement>(null);
  const sixthScenePictureThreeBis = useRef<HTMLDivElement>(null);
  const sixthScenePictureFour = useRef<HTMLDivElement>(null);
  const sixthScenePictureFourBis = useRef<HTMLDivElement>(null);
  const sixthScenePictureFive = useRef<HTMLDivElement>(null);
  const sixthScenePictureSix = useRef<HTMLDivElement>(null);
  const sixthScenePictureSeven = useRef<HTMLDivElement>(null);
  const sixthScenePictureFiveBis = useRef<HTMLDivElement>(null);
  const sixthSceneTitleRef = useRef<HTMLDivElement>(null);
  const sixthSceneTitleTwoRef = useRef<HTMLDivElement>(null);
  const sixthSceneTitleThreeRef = useRef<HTMLDivElement>(null);
  const seventhSceneRef = useRef<HTMLDivElement>(null);
  const seventhSceneTitleRef = useRef<HTMLDivElement>(null);
  const seventhSceneSecondTitleRef = useRef<HTMLDivElement>(null);

  const parallaxValues = [100, -150, 120, -80];
  const fourthSceneParallaxValues = [400, -400, -220, -380];

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
      const sixthSceneTitleSplit = SplitText.create(
        sixthSceneTitleRef.current,
        {
          type: "words",
        },
      );
      const sixthSceneTitleTwoSplit = SplitText.create(
        sixthSceneTitleTwoRef.current,
        {
          type: "words",
        },
      );
      const sixthSceneTitleThreeSplit = SplitText.create(
        sixthSceneTitleThreeRef.current,
        {
          type: "words",
        },
      );

      const aboutTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=1600%",
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
        .to({}, { duration: 0.5 })
        .to(
          secondSceneRef.current,
          {
            display: "flex",
          },
          "secondSceneRef",
        )
        .to(
          secondSceneRef.current,
          {
            height: "100vh",
            duration: 0.8,
          },
          "secondSceneRef",
        )
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
        .to({}, { duration: 0.8 })
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
            duration: 0.8,
          },
          "thirdSceneImage-=0.3",
        )
        .to({}, { duration: 1 })
        .to(
          fourthSceneRef.current,
          {
            display: "flex",
            duration: 0.3,
          },
          "fourthSceneTitleSplit",
        )
        .from(
          fourthSceneTopImageRef.current,
          {
            yPercent: -100,
            duration: 1,
          },
          "fourthSceneTitleSplit",
        )
        .from(
          fourthSceneBottomImageRef.current,
          {
            yPercent: 100,
            duration: 1,
          },
          "fourthSceneTitleSplit",
        )
        .set(
          fourthSceneBackgroundRef.current,
          {
            display: "flex",
          },
          "fourthSceneBackgroundRef",
        )
        .from(
          fourthSceneTitleSplit.words,
          {
            opacity: 0,
            stagger: { each: 0.1 },
            duration: 0.1,
          },
          "fourthSceneBackgroundRef",
        )
        .to(
          fourthSceneTopImageRef.current,
          {
            yPercent: -100,
            duration: 1,
          },
          "fourthSceneEnd",
        )
        .to(
          fourthSceneBottomImageRef.current,
          {
            yPercent: 100,
            duration: 1,
          },
          "fourthSceneEnd",
        )
        .to(
          fifthSceneRef.current,
          {
            display: "flex",
          },
          "fifthScene",
        )
        .to(
          fifthSceneRef.current,
          {
            height: "100vh",
            duration: 0.8,
          },
          "fifthScene",
        )
        .to(
          fifthSceneTitleRef.current?.querySelectorAll("span") ?? [],
          {
            opacity: 1,
            stagger: {
              each: 0.1,
              from: "center",
            },
            duration: 0.5,
          },
          "fifthScene",
        )
        .to(fifthSceneTitleRef.current, {
          display: "none",
        })
        .to(fifthSceneSecondTitleRef.current, {
          display: "flex",
        })
        .to(
          sixthSceneRef.current,
          {
            display: "flex",
          },
          "sixthScene",
        )
        .to(
          fifthSceneSecondTitleRef.current,
          {
            x: "-170vw",
            duration: 1.3,
            ease: "linear",
          },
          "sixthScene",
        )
        .to({}, { duration: 1 })
        .from(
          sixthSceneTopPartRef.current,
          {
            yPercent: -100,
            duration: 1,
          },
          "sixthScene+=0.2",
        )
        .from(
          sixthSceneBottomPartRef.current,
          {
            yPercent: 100,
            duration: 1,
          },
          "sixthScene+=0.2",
        )
        .to(
          sixthScenePictureOne.current,
          {
            display: "flex",
          },
          "sixthScene+=0.6",
        )
        .from(
          sixthSceneTitleSplit.words,
          {
            opacity: 0,
            stagger: { each: 0.1 },
            duration: 0.1,
          },
          "sixthSceneTitleSplit",
        )
        .to(
          sixthScenePictureTwo.current,
          {
            display: "flex",
          },
          "sixthSceneTitleSplit+=0.1",
        )
        .to(
          sixthScenePictureTwoBis.current,
          {
            display: "flex",
          },
          "sixthSceneTitleSplit+=0.1",
        )
        .to(
          sixthScenePictureThree.current,
          {
            display: "flex",
          },
          "sixthSceneTitleSplit+=0.5",
        )
        .to(
          sixthScenePictureFour.current,
          {
            display: "flex",
          },
          "sixthSceneTitleSplit+=0.9",
        )
        .to(
          sixthScenePictureFourBis.current,
          {
            display: "flex",
          },
          "sixthSceneTitleSplit+=0.9",
        )
        .to(sixthSceneTitleRef.current, {
          opacity: 0,
          duration: 0,
        })
        .from(
          sixthSceneTitleTwoSplit.words,
          {
            opacity: 0,
            stagger: { each: 0.1 },
            duration: 0.1,
          },
          "sixthSceneTitleTwoSplit",
        )
        .to(sixthScenePictureFive.current, {
          display: "flex",
        })
        .to(
          sixthScenePictureFiveBis.current,
          {
            display: "flex",
          },
          "sixthSceneTitleTwoSplit+=0.1",
        )
        .to(
          sixthScenePictureSix.current,
          {
            display: "flex",
          },
          "sixthSceneTitleTwoSplit+=0.1",
        )
        .to(
          sixthScenePictureSeven.current,
          {
            display: "flex",
          },
          "sixthSceneTitleTwoSplit+=0.5",
        )
        .to(sixthSceneTitleTwoRef.current, {
          opacity: 0,
          duration: 0,
        })
        .from(
          sixthSceneTitleThreeSplit.words,
          {
            opacity: 0,
            stagger: { each: 0.1 },
            duration: 0.1,
          },
          "sixthSceneTitleThreeSplit",
        )
        .to({}, { duration: 0.7 })
        .to(
          seventhSceneRef.current,
          {
            display: "flex",
          },
          "seventhScene",
        )
        .to(
          seventhSceneRef.current,
          {
            height: "100vh",
            duration: 0.5,
          },
          "seventhScene",
        )
        .to(
          seventhSceneTitleRef.current?.querySelectorAll("span") ?? [],
          {
            opacity: 1,
            stagger: {
              each: 0.1,
              from: "center",
            },
            duration: 0.5,
          },
          "seventhScene-=0.1",
        )
        .to(seventhSceneTitleRef.current, {
          display: "none",
        })
        .to(seventhSceneSecondTitleRef.current, {
          display: "flex",
        })
        .to(seventhSceneSecondTitleRef.current, {
          x: () => {
            const scrollW =
              seventhSceneSecondTitleRef.current?.scrollWidth ?? 0;
            return -(scrollW - window.innerWidth);
          },
          duration: 3,
          ease: "linear",
        })
        .to({}, { duration: 1 });

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1921px)", () => {
        aboutTimeline.to(
          sixthScenePictureThreeBis.current,
          {
            display: "flex",
          },
          "sixthSceneTitleSplit+=0.5",
        );
      });

      fourthSceneImages.current.forEach((img, index) => {
        if (!img) return;
        aboutTimeline.to(
          img,
          {
            y: fourthSceneParallaxValues[
              index % fourthSceneParallaxValues.length
            ],
            duration: 1.2,
            scrub: 1.5,
          },
          "fourthSceneBackgroundRef+=0.5",
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
        className="hidden flex-wrap gap-4 absolute justify-center items-center inset-0 z-10 top-1/2 -translate-y-1/2 w-full h-0"
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
          className="absolute top-[-40px] left-0 w-full h-[100px] bg-repeat-x"
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
          className="absolute bottom-[-50px] left-0 w-full h-[100px] bg-repeat-x"
          style={{
            backgroundImage: `url("/images/article/article_ripped.webp")`,
            backgroundSize: "auto 65%",
          }}
        />
      </div>
      <div
        className="hidden flex-wrap gap-4 absolute h-full justify-center inset-0 z-30 top-1/2 -translate-y-1/2 w-full h-full overflow-hidden"
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
          className="absolute md:h-[75%] h-1/2 w-full -bottom-10 left-1/2 -translate-x-1/2 aspect-4/7 flex items-end justify-end"
          ref={thirdSceneImageRef}
        >
          <Image
            src={"/images/about/wdc.png"}
            alt="Papper texture about"
            fill
            className="lg:object-contain h-1/2 aspect-4/7"
          />
        </div>
      </div>
      <div
        className="w-full h-screen hidden justify-center items-center absolute inset-0 z-30"
        ref={fourthSceneRef}
      >
        <div
          className="w-full h-full absolute inset-0 hidden"
          ref={fourthSceneBackgroundRef}
        >
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
                  ? "top-[0%] left-[25%] lg:top-[-60%] lg:left-[44%] -rotate-6"
                  : index === 1
                    ? "bottom-[-10%] right-[2%] lg:bottom-[-50%] lg:right-[6%] rotate-[5deg]"
                    : "bottom-[-5%] left-[-8%] lg:bottom-[-45%] lg:left-[12%] rotate-8",
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
          style={{
            backgroundImage: `url("/images/about/fourth-top.webp")`,
            backgroundSize: "cover",
            backgroundPosition: "bottom center",
          }}
          ref={fourthSceneTopImageRef}
        ></div>
        <div
          className="w-full h-1/3 absolute bottom-0 left-0"
          style={{
            backgroundImage: `url("/images/about/fourth-bottom.webp")`,
            backgroundSize: "cover",
            backgroundPosition: "top center",
          }}
          ref={fourthSceneBottomImageRef}
        ></div>

        <p
          className="heading-xl-obviously text-pink text-center px-10 relative z-10"
          ref={fourthSceneTitleRef}
        >
          We&apos;re here to show
          <br />
          footbal how we see it.
        </p>
      </div>
      <div
        className="flex-wrap gap-4 hidden h-0 absolute justify-center items-center inset-0 z-50 top-1/2 -translate-y-1/2 w-full "
        ref={fifthSceneRef}
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
          className="heading-xl-obviously [&>span]:opacity-0 flex flex-col text-pink w-full text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          ref={fifthSceneTitleRef}
        >
          <span>No clubs</span>
          <span>No clubs</span>
          <span>No clubs</span>
          <span>No clubs</span>
          <span>No clubs</span>
          <span>No clubs</span>
          <span>No clubs</span>
          <span>No clubs</span>
          <span>No clubs</span>
          <span>No clubs</span>
          <span>No clubs</span>
          <span>No clubs</span>
          <span>No clubs</span>
          <span>No clubs</span>
        </div>
        <div
          className="heading-xl-obviously hidden whitespace-nowrap h-full justify-start items-center text-[160px] lg:text-[320px] text-pink w-full "
          ref={fifthSceneSecondTitleRef}
        >
          <span className="flex gap-20 justify-start items-center">
            <span>No colors</span>
            <span>No colors</span>
            <span>No colors</span>
          </span>
        </div>
        <div
          className="absolute top-[-40px] left-0 w-full h-[100px] bg-repeat-x"
          style={{
            backgroundImage: `url("/images/article/article_ripped.webp")`,
            backgroundSize: "auto 65%",
          }}
        />
        <div
          className="absolute bottom-[-50px] left-0 w-full h-[100px] bg-repeat-x"
          style={{
            backgroundImage: `url("/images/article/article_ripped.webp")`,
            backgroundSize: "auto 65%",
          }}
        />
      </div>
      <div
        className="flex-wrap gap-4 h-full absolute justify-center items-center inset-0 z-50 top-1/2 -translate-y-1/2 w-full"
        ref={sixthSceneRef}
      >
        <div
          className="flex absolute top-0 bg-pink w-full h-1/2"
          ref={sixthSceneTopPartRef}
        >
          <div
            className="absolute bottom-[-50px] left-0 w-full h-[100px] bg-repeat-x"
            style={{
              backgroundImage: `url("/images/article/article_ripped.webp")`,
              backgroundSize: "auto 65%",
            }}
          />
          <div
            className="h-[120%] aspect-3/2 -top-[10%] left-[25%] absolute hidden"
            ref={sixthScenePictureOne}
          >
            <Image
              src={"/images/about/sixthScenePictureOne.webp"}
              alt="Papper texture about"
              className="object-contain"
              fill
            />
          </div>
        </div>

        <div
          className="flex absolute bottom-0 bg-pink w-full h-1/2"
          ref={sixthSceneBottomPartRef}
        >
          <div
            className="absolute top-[-40px]  left-0 w-full h-[100px] bg-repeat-x"
            style={{
              backgroundImage: `url("/images/article/article_ripped.webp")`,
              backgroundSize: "auto 65%",
            }}
          />
        </div>
        <div
          className="h-[120%] w-1/3 absolute -bottom-[10%] -right-[10%] hidden"
          ref={sixthScenePictureTwo}
        >
          <Image
            src={"/images/about/sixthScenePictureTwo.webp"}
            alt="Papper texture about"
            className="object-cover"
            fill
          />
        </div>
        <div
          className="aspect-5/4 w-auto h-[70%] absolute -bottom-[80px] left-[25%] hidden"
          ref={sixthScenePictureTwoBis}
        >
          <Image
            src={"/images/about/sixthScenePictureTwoBis.webp"}
            alt="Papper texture about"
            className="object-contain"
            fill
          />
        </div>
        <div
          className="h-[50%] w-[620px] absolute bottom-0 left-1/2 -translate-x-1/2 hidden"
          ref={sixthScenePictureThree}
        >
          <Image
            src={"/images/about/sixthScenePictureThree.webp"}
            alt="Papper texture about"
            className="object-cover"
            width={620}
            height={1354}
          />
        </div>
        <div
          className="h-[60%] w-auto aspect-square absolute -top-20 left-[60%] -translate-x-1/2 hidden"
          ref={sixthScenePictureThreeBis}
        >
          <Image
            src={"/images/about/sixthScenePictureThreeBis.webp"}
            alt="Papper texture about"
            className="object-contain"
            fill
          />
        </div>
        <div
          className=" absolute h-[150%] aspect-4/7 bottom-[-50%] left-[5%] hidden xl:bottom-[-47%]"
          ref={sixthScenePictureFour}
        >
          <Image
            src={"/images/about/sixthScenePictureFour.webp"}
            alt="Papper texture about"
            className="h-full w-full top-0 left-0"
            fill
          />
        </div>

        <div
          className=" absolute h-[75%] aspect-5/8 bottom-[-15%] left-[50%] hidden"
          ref={sixthScenePictureFourBis}
        >
          <Image
            src={"/images/about/sixthScenePictureFourBis.webp"}
            alt="Papper texture about"
            className="h-full w-full top-0 left-0"
            fill
          />
        </div>
        <div
          className="h-[125%] aspect-3/7 z-30 absolute -bottom-[50%] left-0 -translate-x-[25%] hidden"
          ref={sixthScenePictureFive}
        >
          <Image
            src={"/images/about/sixthScenePictureFive.webp"}
            alt="Papper texture about"
            fill
          />
        </div>
        <div
          className="h-[70%] aspect-7/10 absolute top-[-10%] left-20 -translate-x-[25%] hidden"
          ref={sixthScenePictureFiveBis}
        >
          <Image
            src={"/images/about/sixthScenePictureFiveBis.webp"}
            alt="Papper texture about"
            fill
          />
        </div>
        <div
          className="h-[150%] aspect-2/3  absolute top-[-15%] right-[7%] xl:right-[4%] hidden"
          ref={sixthScenePictureSix}
        >
          <Image
            src={"/images/about/sixthScenePictureSeven.webp"}
            alt="Papper texture about"
            fill
          />
        </div>
        <div
          className="h-[100%] aspect-2/3 absolute bottom-[-30%] right-0 hidden"
          ref={sixthScenePictureSeven}
        >
          <Image
            src={"/images/about/sixthScenePictureSix.webp"}
            alt="Papper texture about"
            fill
          />
        </div>
        <p
          className="heading-xl-obviously absolute top-1/2 -translate-x-1/2 left-1/2  -translate-y-1/2 title-shadow text-white text-center px-10  z-10"
          ref={sixthSceneTitleRef}
        >
          Just symbols,
          <br />
          shapes, RITUAL,
          <br /> NOISES
        </p>
        <p
          className="heading-xl-obviously z-30 absolute top-1/2 -translate-x-1/2 left-1/2  -translate-y-1/2 title-shadow text-white text-center px-10 "
          ref={sixthSceneTitleTwoRef}
        >
          We don’t support
          <br /> anything.
        </p>
        <p
          className="heading-xl-obviously absolute top-1/2 -translate-x-1/2 left-1/2  -translate-y-1/2 title-shadow text-white text-center px-10  z-30"
          ref={sixthSceneTitleThreeRef}
        >
          We reinterpret
          <br />
          everything.
        </p>
      </div>
      <div
        className="flex-wrap hidden gap-4 h-0 absolute justify-center items-center inset-0 z-50 top-1/2 -translate-y-1/2 w-full"
        ref={seventhSceneRef}
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
          className="heading-xl-obviously [&>span]:opacity-0 flex flex-col text-pink w-full text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          ref={seventhSceneTitleRef}
        >
          <span>No Games</span>
          <span>No Games</span>
          <span>No Games</span>
          <span>No Games</span>
          <span>No Games</span>
          <span>No Games</span>
          <span>No Games</span>
          <span>No Games</span>
          <span>No Games</span>
          <span>No Games</span>
          <span>No Games</span>
          <span>No Games</span>
          <span>No Games</span>
          <span>No Games</span>
        </div>
        <div
          className="heading-xl-obviously hidden whitespace-nowrap justify-start px-10 text-[160px] lg:text-[320px] text-pink w-full text-left absolute top-1/2 left-0 -translate-y-1/2"
          ref={seventhSceneSecondTitleRef}
        >
          <span>Just football through the eyes of design</span>
        </div>
        <div
          className="absolute top-[-40px] left-0 w-full h-[100px] bg-repeat-x"
          style={{
            backgroundImage: `url("/images/article/article_ripped.webp")`,
            backgroundSize: "auto 65%",
          }}
        />
        <div
          className="absolute bottom-[-50px] left-0 w-full h-[100px] bg-repeat-x"
          style={{
            backgroundImage: `url("/images/article/article_ripped.webp")`,
            backgroundSize: "auto 65%",
          }}
        />
      </div>
    </section>
  );
}
