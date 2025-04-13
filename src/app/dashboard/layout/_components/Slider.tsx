"use client";

import { useState, useEffect } from "react";
import Input from "@/components/Input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { actionUpdateSlider } from "../../_actions/actionDashboard";

export default function Slider({ sliders }: { sliders: Slider[] }) {
  const [slides, setSlides] = useState<Slider[]>(sliders);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [editedSlide, setEditedSlide] = useState<Slider>(slides[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setEditedSlide(slides[currentSlideIndex]);
  }, [currentSlideIndex, slides]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedSlide((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const imageUrl = reader.result as string;
        setEditedSlide((prev) => ({ ...prev, image: imageUrl }));
      };

      reader.onerror = () => {
        setError("Error reading image file");
      };

      reader.readAsDataURL(file);
    }
  };

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!editedSlide?.title || !editedSlide?.image) {
        throw new Error("Title and image are required");
      }

      const response = await actionUpdateSlider(editedSlide);

      if (!response.success) {
        throw new Error(response.message);
      }

      setSlides((prev) =>
        prev.map((slide) => (slide.id === editedSlide.id ? editedSlide : slide))
      );
    } catch (err) {
      console.error("Something went Error!", err);
      setError(err instanceof Error ? err.message : "Failed to update slide");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-8">
      <h1 className="text-lg text-slate-700 font-semibold mb-6">
        Slider Manager
      </h1>

      {/* Slide Preview */}
      {/* Slide Preview */}
      <div className="bg-white rounded-lg shadow-md p-5 mb-3 relative">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-4">
            <div
              className="text-gray-800  p-2 rounded-full absolute left-3 cursor-pointer  top-[50%] z-10 -translate-y-1/2 bg-gray-200 hover:bg-gray-200"
              onClick={prevSlide}
            >
              <ChevronLeft className="text-slate-600" />
            </div>
            <span className="font-medium">
              Slide {currentSlideIndex + 1} of {slides.length}
            </span>
            <div
              className="text-gray-800  p-2 rounded-full absolute cursor-pointer right-3 top-[50%] z-10 -translate-y-1/2 bg-gray-200 hover:bg-gray-200"
              onClick={nextSlide}
            >
              <ChevronRight className="text-slate-600" />
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2">
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={editedSlide?.image}
                alt="Slide preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 space-y-4">
            <h2 className="text-xl font-semibold">Slide Preview</h2>
            <h3 className="text-2xl font-bold text-slate-700">
              {editedSlide?.title}
            </h3>
            <p className="text-lg text-blue-600">{editedSlide?.subtitle}</p>
            <p className="text-gray-600">{editedSlide?.description}</p>
            <Button className="mt-4">{editedSlide?.buttonText}</Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {/* Edit Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Edit Slide</h2>

        <div className="space-y-4">
          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Slide Image
            </label>
            <input
              id="slide-image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100 focus:outline-none focus:ring-0"
            />
          </div>

          {/* Text Inputs */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <Input
              name="title"
              value={editedSlide?.title}
              onChange={handleInputChange}
              className="text-gray-800 w-full border-gray-700 focus:outline-none focus:ring-0"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Subtitle
            </label>
            <Input
              name="subtitle"
              value={editedSlide?.subtitle}
              onChange={handleInputChange}
              className="text-gray-800 w-full border-gray-700 focus:outline-none focus:ring-0"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <Textarea
              name="description"
              value={editedSlide?.description}
              onChange={handleInputChange}
              className="text-gray-800 w-full border-gray-700 focus:outline-none focus:ring-0"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Button Text
              </label>
              <Input
                name="buttonText"
                value={editedSlide?.buttonText}
                onChange={handleInputChange}
                className="text-gray-800 w-full border-gray-700 focus:outline-none focus:ring-0"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Button Link
              </label>
              <Input
                name="buttonLink"
                value={editedSlide?.buttonLink}
                onChange={handleInputChange}
                className="text-gray-800 w-full border-gray-700 focus:outline-none focus:ring-0"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleUpdate} disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Slide"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
