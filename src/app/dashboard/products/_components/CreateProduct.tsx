"use client";
import { DrawerDialog } from "@/components/Drawer";
import Input from "@/components/Input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import { SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { InfoIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import DragZone from "./DragZone";
import { actionCreateProduct } from "../../_actions/actionDashboard";
import Loading from "@/components/Loading";
import { capitalizeIfAmpersand } from "@/lib/utils";

function CreateProduct({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Button
        className="mb-5 flex  ml-auto px-9 text-sm bg-emerald-800 hover:bg-emerald-900 transition-colors"
        onClick={() => setOpen(true)}
      >
        NEW PRODUCT
      </Button>
      <DrawerDialog
        open={open}
        setOpen={setOpen}
        content={<Content categories={categories} setOpen={setOpen} />}
      />
    </>
  );
}

const Content = ({
  categories,
  setOpen,
}: {
  categories: Category[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [name, setName] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [sizes, setSizes] = useState<string>("");
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [offer, setOffer] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [next, setNext] = useState<boolean>(false);
  const [imagePreviewDef, setImagePreviewDef] = useState<string>("");
  const [imagePreviewTwo, setImagePreviewTwo] = useState<string>("");
  const [imagePreviewThree, setImagePreviewThree] = useState<string>("");
  const [imagePreviewFour, setImagePreviewFour] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("");
  const [openError, setOpenError] = useState<boolean>(false);

  const [images, setImages] = useState<
    { type: string; image: string; file: File }[] | null
  >(null);

  const handelUploadImage = (type: string, image: string, file: File): void => {
    setImages([...(images || []), { type: type, image: image, file: file }]);
  };

  const formatDecimal = (value: string): number => {
    if (!value) return 0;
    const num = parseFloat(value);
    return isNaN(num) ? 0 : parseFloat(num.toFixed(2));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Create the product with the provided details and images
      const data = await actionCreateProduct({
        name,
        category,
        description,
        isFeatured,
        offer: formatDecimal(offer),
        price: formatDecimal(price),
        images: images ?? [],
        sizes,
        type,
      });

      if (data && "errMsg" in data && data.errMsg) {
        throw new Error(data.errMsg);
      } else {
        setOpen(false);
        setErrMsg("");
        setLoading(false);
        setOpenError(false);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong!";
      setErrMsg(message);
      setOpenError(true);
    } finally {
      setLoading(false);
    }
  };

  const validateDecimal = (value: string): boolean => {
    return /^\d*\.?\d{0,2}$/.test(value);
  };

  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    offer = false
  ) => {
    const value = e.target.value;
    if (value === "" || validateDecimal(value)) {
      if (offer) {
        setOffer(value);
      } else {
        setPrice(value);
      }
    }
  };

  return (
    <div className="p-5 md:p-0 overflow-y-scroll h-[500px] scrollbar-custom-sheet">
      {next ? (
        <>
          <UploadImage
            handelUploadImage={handelUploadImage}
            imagePreviewDef={imagePreviewDef}
            setImagePreviewDef={setImagePreviewDef}
            imagePreviewTwo={imagePreviewTwo}
            setImagePreviewTwo={setImagePreviewTwo}
            imagePreviewThree={imagePreviewThree}
            setImagePreviewThree={setImagePreviewThree}
            imagePreviewFour={imagePreviewFour}
            setImagePreviewFour={setImagePreviewFour}
          />
          <div className="flex justify-end w-[100px] items-center ml-auto mt-3">
            <Button
              onClick={handleSubmit}
              className="bg-emerald-800 hover:bg-emerald-700 w-full mr-1"
              disabled={!images || loading}
            >
              {loading ? <Loading /> : "Create"}
            </Button>
            <Button
              className="w-full"
              onClick={() => setNext(false)}
              disabled={loading}
            >
              Back
            </Button>
          </div>
        </>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6 bg-white rounded-lg shadow-lg w-full max-w-lg mx-auto  overflow-y-auto"
        >
          <p className="text-gray-600 mb-4">Create Product</p>

          {/* Input fields with validation */}
          <div>
            <Input
              name="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors({ ...errors, ["name"]: "" });
              }}
              onBlur={() =>
                setErrors({
                  ...errors,
                  ["name"]: name.length ? "" : "required",
                })
              }
              placeholder="Product name"
              className={`mt-2 p-2 border rounded-md w-full ${
                errors.name ? "border-red-500" : "border-gray-300"
              } ${
                errors.name ? "placeholder-red-500" : "placeholder-gray-400"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>
          <div>
            <Input
              name="type"
              value={type ?? ""}
              onChange={(e) => {
                setType(e.target.value);
              }}
              placeholder="Product type, Category"
              className={`mt-2 p-2 border rounded-md w-full border-gray-300 `}
            />
          </div>
          <div>
            <Input
              name="sizes"
              value={sizes}
              onChange={(e) => {
                setSizes(e.target.value);
                setErrors({ ...errors, ["sizes"]: "" });
              }}
              onBlur={() =>
                setErrors({
                  ...errors,
                  ["sizes"]: sizes.length
                    ? ""
                    : "required, set single comma between every size",
                })
              }
              placeholder="Product Sizes "
              className={`mt-2 p-2 border rounded-md w-full ${
                errors.sizes ? "border-red-500" : "border-gray-300"
              } ${
                errors.sizes ? "placeholder-red-500" : "placeholder-gray-400"
              }`}
            />
            {errors.sizes && (
              <p className="text-red-500 text-sm">{errors.sizes}</p>
            )}
          </div>

          <div>
            <textarea
              name="description"
              value={description}
              aria-multiline
              onChange={(e) => {
                setDescription(e.target.value);
                setErrors({ ...errors, ["description"]: "" });
              }}
              onBlur={() =>
                setErrors({
                  ...errors,
                  ["description"]: description.length ? "" : "required",
                })
              }
              placeholder="Product description"
              className={`mt-2 p-2 border rounded-md w-full outline-none focus:outline-blue-100 ${
                errors.description ? "border-red-500" : "border-gray-300"
              } ${
                errors.description
                  ? "placeholder-red-500"
                  : "placeholder-gray-400"
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          {/* Price and offer fields */}
          <div>
            <Input
              name="price"
              value={price ?? ""}
              onChange={(e) => {
                handlePriceChange(e);
                setErrors({ ...errors, ["price"]: "" });
              }}
              onBlur={() =>
                setErrors({
                  ...errors,
                  ["price"]: price?.length ? "" : "required",
                })
              }
              placeholder="Product price"
              className={`mt-2 p-2 border rounded-md w-full ${
                errors.price ? "border-red-500" : "border-gray-300"
              } ${
                errors.price ? "placeholder-red-500" : "placeholder-gray-400"
              }`}
            />
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price}</p>
            )}
          </div>

          <div>
            <Input
              name="offer"
              value={offer ?? ""}
              onChange={(e) => {
                handlePriceChange(e, true);
              }}
              placeholder="Offer price"
              className={`mt-2 p-2 border rounded-md w-full border-gray-300 `}
            />
          </div>

          {/* Featured checkbox */}
          <div className="flex items-center space-x-2">
            <Label
              htmlFor="isFeatured"
              className="text-sm font-medium text-gray-700"
            >
              Is Featured
            </Label>
            <Checkbox
              name="isFeatured"
              checked={isFeatured}
              onCheckedChange={(checked) => setIsFeatured(checked === true)}
            />
          </div>

          {/* Category select dropdown */}
          <div>
            <Select onValueChange={(value) => setCategory(value)}>
              <SelectTrigger className="text-lg font-semibold max-w-lg text-gray-800 underline">
                <SelectValue placeholder={"Category"} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category: Category) => (
                  <SelectItem
                    key={category.id}
                    value={category.name}
                    className="text-base"
                  >
                    {capitalizeIfAmpersand(category.name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Next button to proceed to image upload */}
          <div className="flex justify-end mt-4">
            <Button
              onClick={() => setNext(true)}
              className="px-6 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700 transition-colors"
              disabled={
                !name ||
                !description ||
                !price?.length ||
                !category.length ||
                !sizes
              }
            >
              Next
            </Button>
          </div>
        </form>
      )}
      {/* Error modal dialog */}
      <DrawerDialog
        content={
          <div className="p-5 flex text-lg items-center">
            <InfoIcon className="text-red-600 mr-2 w-5" />
            <p className="text-red-500">{errMsg}</p>
          </div>
        }
        open={openError}
        setOpen={setOpenError}
      />
    </div>
  );
};

export const UploadImage = ({
  handelUploadImage,
  imagePreviewDef,
  setImagePreviewDef,
  imagePreviewTwo,
  setImagePreviewTwo,
  imagePreviewThree,
  setImagePreviewThree,
  imagePreviewFour,
  setImagePreviewFour,
}: {
  handelUploadImage: (type: string, image: string, file: File) => void;
  imagePreviewDef: string;
  setImagePreviewDef: React.Dispatch<React.SetStateAction<string>>;
  imagePreviewTwo: string;
  setImagePreviewTwo: React.Dispatch<React.SetStateAction<string>>;
  imagePreviewThree: string;
  setImagePreviewThree: React.Dispatch<React.SetStateAction<string>>;
  imagePreviewFour: string;
  setImagePreviewFour: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [errMsg, setErrMsg] = useState<string[]>([]);

  return (
    <>
      <p className="text-base text-slate-800 font-semibold mb-4">
        Upload images for product, <span className="text-sm">max 4 images</span>
      </p>
      {errMsg && (
        <div>
          {errMsg.map((err) => (
            <div className="text-red-600 flex items-center" key={err}>
              <InfoIcon className="mr-1" />
              {err}
            </div>
          ))}
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 w-full">
        {/* Image upload zones */}
        <DragZone
          setErrMsg={setErrMsg}
          imagePreview={imagePreviewDef}
          setImagePreview={setImagePreviewDef}
          handelUploadImage={(type = "", image, file) =>
            handelUploadImage("default", image, file)
          }
          type="Default"
        />
        <DragZone
          setErrMsg={setErrMsg}
          imagePreview={imagePreviewTwo}
          setImagePreview={setImagePreviewTwo}
          handelUploadImage={(type = "", image, file) =>
            handelUploadImage("second", image, file)
          }
          type="Second"
        />
        <DragZone
          setErrMsg={setErrMsg}
          imagePreview={imagePreviewThree}
          setImagePreview={setImagePreviewThree}
          handelUploadImage={(type = "", image, file) =>
            handelUploadImage("three", image, file)
          }
          type="Third"
        />
        <DragZone
          setErrMsg={setErrMsg}
          imagePreview={imagePreviewFour}
          setImagePreview={setImagePreviewFour}
          handelUploadImage={(type = "", image, file) =>
            handelUploadImage("four", image, file)
          }
          type="Four"
        />
      </div>
    </>
  );
};

export default CreateProduct;
