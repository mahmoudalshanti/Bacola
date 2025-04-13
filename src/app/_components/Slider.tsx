"use client";
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { actionGetSlides } from "../dashboard/_actions/actionDashboard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PageLoading from "@/components/PageLoading";
import { useRouter } from "next/navigation";

interface Slider {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export default function Slider() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState<number>(0);
  const [slides, setSlides] = React.useState<Slider[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const router = useRouter();

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const scrollTo = (index: number) => {
    api?.scrollTo(index);
  };

  React.useEffect(() => {
    const fetchSlider = async () => {
      try {
        setLoading(true);
        const findSlides = await actionGetSlides();
        setSlides(findSlides as Slider[]);

        if ("errMsg" in findSlides)
          if (findSlides.errMsg) throw new Error(findSlides.errMsg);
      } catch (err) {
        console.error("Something went Error!", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSlider();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-5">
        <div className="relative w-full h-full">
          <Skeleton className="w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-sm" />
          <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
            <PageLoading />
          </div>
        </div>
      </div>
    );
  }

  if (!slides.length) {
    return (
      <div className="relative w-full  mt-5 flex items-center justify-center bg-gray-100 rounded-sm h-[300px] sm:h-[400px] md:h-[500px]">
        <p className="text-gray-500">No slides available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full  h-fit mt-5">
      <Carousel setApi={setApi} className="w-full h-full">
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <Card
                onClick={() => router.push("/product-category")}
                className="relative cursor-pointer border-none h-full"
              >
                <CardContent className="p-0 relative">
                  {/* Image with loading state */}
                  <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px]">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover rounded-sm"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                  </div>

                  {/* Slide Content */}
                  <div className="absolute top-[10%] left-4 md:top-[20%] md:left-8 lg:top-[25%] lg:left-12 w-[90%] md:w-[80%] lg:w-[50%] text-white">
                    <p className="text-sm md:text-base text-slate-600 mb-3 md:mb-5 font-medium">
                      {slide.subtitle}
                    </p>
                    <h2 className="font-extrabold text-slate-800 text-2xl md:text-4xl lg:text-5xl drop-shadow-md">
                      {slide.title}
                    </h2>
                    <p className="text-sm md:text-base font-medium mt-2 drop-shadow-md">
                      {slide.description}
                    </p>
                    <Button
                      asChild
                      className="mt-4 md:mt-8 rounded-full bg-cyan-500 px-5 text-white  hover:bg-cyan-500"
                    >
                      <a href={slide.buttonLink}>{slide.buttonText}</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="hidden sm:flex absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/50 hover:bg-white/80 rounded-full p-2 shadow-lg z-10" />
        <CarouselNext className="hidden sm:flex absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/50 hover:bg-white/80 rounded-full p-2 shadow-lg z-10" />
      </Carousel>

      <div className="absolute bottom-7 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              current === i + 1 ? "bg-white w-6" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
