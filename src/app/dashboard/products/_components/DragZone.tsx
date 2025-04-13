"use client";

import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import { X } from "lucide-react";

function DragZone({
  handelUploadImage,
  type,
  imagePreview,
  setImagePreview,
  setErrMsg,
  updateComponent,
}: {
  handelUploadImage: (type: string, image: string, file: File) => void;
  type: string;
  imagePreview: string;
  setImagePreview: React.Dispatch<React.SetStateAction<string>>;
  setErrMsg: React.Dispatch<React.SetStateAction<string[]>>;
  updateComponent?: boolean;
}) {
  const [image, setImage] = useState<File | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => setImage(acceptedFiles[0]),
    accept: { "image/*": [] },
    maxSize: 5 * 1024 * 1000,
    multiple: false,

    onDropRejected: (err) =>
      setErrMsg(err[0].errors.map((error) => error.message)),
  });

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImagePreview(result);
        handelUploadImage(type, result, image); // Pass the image data to the parent component
      };
      reader.readAsDataURL(image);
    }
  }, [image]);

  const handelImageCanceled = () => {
    setImage(null);
    setImagePreview("");
  };

  return (
    <div className="relative w-fit">
      {/* Display cancel icon if `updateComponent` flag is true and an image is present */}
      {updateComponent && imagePreview && (
        <X
          className="absolute right-0 top-[-10px] text-red-600 cursor-pointer"
          onClick={handelImageCanceled}
        />
      )}

      {/* Display the upload zone */}
      <div className="h-24 w-24 flex items-center justify-center border-2 border-dashed border-slate-600 rounded-lg bg-slate-200 hover:bg-slate-100 transition-colors m-2">
        {imagePreview ? (
          // If there's an image preview, show the image
          <img src={imagePreview} className="w-full h-full object-cover " />
        ) : (
          // If no image is selected, show the drag-and-drop area
          <div
            {...getRootProps({
              className:
                "flex flex-col items-center justify-center cursor-pointer",
            })}
          >
            <input {...getInputProps()} />
            <ArrowUpTrayIcon className="w-8 h-8 text-slate-600 mb-2" />
            {isDragActive ? (
              // Show this message when a file is being dragged over the area
              <p className="text-slate-600 text-xs font-semibold text-center">
                Drop files here...
              </p>
            ) : (
              // Show default message when no file is being dragged
              <p className="text-slate-600 text-xs font-semibold text-center">
                {type}
                <br />
                Drag & drop or click
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DragZone;
