import { SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Input from "@/components/Input";
import DragZone from "./DragZone";
import { actionUpdateProduct } from "../../_actions/actionDashboard";
import Loading from "@/components/Loading";
import { DrawerDialog } from "@/components/Drawer";
import StarRating from "@/components/RatingStars";

const Content = ({
  product,
  setViewProduct,
  setOpenView,
}: {
  product: Product;
  setViewProduct: React.Dispatch<SetStateAction<Product | null>>;
  setOpenView: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const [name, setName] = useState(product.name);
  const [category, setCategory] = useState(product.category.name);
  const [sizes, setSizes] = useState(product.sizes);
  const [price, setPrice] = useState(product.price);
  const [offer, setOffer] = useState(product.offer);
  const [description, setDescription] = useState(product.description);
  const [isFeatured, setIsFeatured] = useState(product.isFeatured);
  const [errMsg, setErrMsg] = useState<string[]>([]);
  const [openError, setOpenError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [images, setImages] = useState<
    { type: string; image: string; file: File }[] | null
  >(null);

  const [imagePreviewDef, setImagePreviewDef] = useState<string>(
    product.images?.[0]?.image || ""
  );
  const [imagePreviewTwo, setImagePreviewTwo] = useState<string>(
    product.images?.[1]?.image || ""
  );
  const [imagePreviewThree, setImagePreviewThree] = useState<string>(
    product.images?.[2]?.image || ""
  );
  const [imagePreviewFour, setImagePreviewFour] = useState<string>(
    product.images?.[3]?.image || ""
  );

  const handelUploadImage = (type: string, image: string, file: File): void => {
    setImages([...(images || []), { type: type, image: image, file: file }]);
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Validate input fields
      if (!name) throw new Error("Name are required");
      if (!description) throw new Error("Description are required");
      if (!category) throw new Error("Category are required");
      if (!price.toString()) throw new Error("Price are required");
      if (!offer?.toString()) throw new Error("Offer are required");
      if (!sizes[0]) throw new Error("Sizes are required");

      // Prepare updated images data
      const updatedImages = [
        { type: "default", image: imagePreviewDef },
        { type: "second", image: imagePreviewTwo },
        { type: "third", image: imagePreviewThree },
        { type: "four", image: imagePreviewFour },
      ];

      // Send the update request
      const data = await actionUpdateProduct({
        id: product.id,
        name: name.toLowerCase() === product.name ? null : name,
        description:
          description.toLowerCase() === product.description
            ? null
            : description,
        images: updatedImages,
        price: Number(price) === product.price ? null : Number(price),
        isFeatured: isFeatured,
        offer: Number(offer) === product.offer ? null : Number(offer),
        sizes: sizes,
        category:
          category.toLowerCase() == product.category.name ? null : category,
      });

      if (data && "errMsg" in data && data.errMsg) {
        throw new Error(data.errMsg);
      } else {
        // Close the view and reset the product
        setViewProduct(null);
        setOpenView(false);
      }
    } catch (err) {
      console.error("Something went wrong", err);
      setErrMsg([err instanceof Error ? err.message : "Something went wrong!"]);
      setOpenError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(openError, errMsg, "SSsSSSS");
  }, [openError]);
  return (
    <>
      {errMsg.length ? (
        <DrawerDialog
          open={openError}
          setOpen={setOpenError}
          content={errMsg.map((message) => (
            <p key={message} className="text-red-700">
              {message}
            </p>
          ))}
        />
      ) : (
        ""
      )}
      <div className="p-5 md:p-0 overflow-y-scroll h-[500px] md:h-full  ">
        <p className="text-gray-600 mb-4">View Product</p>

        {/* Image upload zones */}
        <div className="grid grid-cols-2 md:grid-cols-4 justify-center lg:grid-cols-4 gap-2 w-full mb-3">
          <DragZone
            handelUploadImage={(type = "", image, file) =>
              handelUploadImage("default", image, file)
            }
            imagePreview={imagePreviewDef}
            setErrMsg={setErrMsg}
            setImagePreview={setImagePreviewDef}
            type="Default"
            updateComponent={true}
          />
          <DragZone
            handelUploadImage={(type = "", image, file) =>
              handelUploadImage("second", image, file)
            }
            imagePreview={imagePreviewTwo}
            setErrMsg={setErrMsg}
            setImagePreview={setImagePreviewTwo}
            type="Second"
            updateComponent={true}
          />
          <DragZone
            handelUploadImage={(type = "", image, file) =>
              handelUploadImage("third", image, file)
            }
            imagePreview={imagePreviewThree}
            setErrMsg={setErrMsg}
            setImagePreview={setImagePreviewThree}
            type="Third"
            updateComponent={true}
          />
          <DragZone
            handelUploadImage={(type = "", image, file) =>
              handelUploadImage("four", image, file)
            }
            imagePreview={imagePreviewFour}
            setErrMsg={setErrMsg}
            setImagePreview={setImagePreviewFour}
            type="Four"
            updateComponent={true}
          />
        </div>

        <div className="flex justify-between">
          <p className="text-gray-600 mb-2">Id:</p>
          <p className="text-slate-500 mb-2 font-semibold">{product.id}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-600 mb-2">Name:</p>
          <Input
            className="h-[36px] border-none outline-none ring-white text-slate-800"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex justify-between">
          <p className="text-gray-600 mb-2">Category:</p>
          <Input
            className="h-[36px] border-none outline-none ring-white text-slate-800"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div className="flex justify-between">
          <p className="text-gray-600 mb-2">Sizes:</p>
          <Input
            className="h-[36px] border-none outline-none ring-white text-slate-800"
            value={sizes.toString()}
            onChange={(e) => setSizes([e.target.value])}
          />
        </div>

        <div className="flex justify-between">
          <p className="text-gray-600 mb-2">Price:</p>
          <Input
            className="h-[36px] border-none outline-none ring-white text-slate-800"
            value={price}
            onChange={(e) => setPrice(+e.target.value)}
          />
        </div>
        <div className="flex justify-between">
          <p className="text-gray-600 mb-2">Offer:</p>
          <Input
            className="h-[36px] border-none outline-none ring-white text-slate-800"
            value={offer?.toString() && +offer}
            onChange={(e) => setOffer(+e.target.value)}
          />
        </div>
        <div className="flex justify-between">
          <p className="text-gray-600 mb-2">Featured:</p>
          <Checkbox
            checked={typeof isFeatured === "boolean" && isFeatured}
            onCheckedChange={(checked) => setIsFeatured(!!checked)}
          />
        </div>

        {/* Date display */}
        <div className="flex justify-between">
          <p className="text-gray-600 mb-2">Created At:</p>
          {product.createdAt
            ? new Date(product.createdAt).toLocaleDateString()
            : "N/A"}
        </div>
        <div className="flex justify-between">
          <p className="text-gray-600 mb-2">Last Update:</p>
          {product.updatedAt
            ? new Date(product.updatedAt).toLocaleDateString()
            : "N/A"}
        </div>

        <div className="flex justify-between">
          <p className="text-gray-600 mb-2">Rate:</p>
          <div className="text-slate-500 mb-2 flex">
            {<StarRating rate={product?.rate} />}
          </div>
        </div>

        <div className="flex justify-between flex-col">
          <p className="text-gray-600">Description:</p>
          <div>
            <input
              type="text"
              className="h-[36px] border-none outline-none ring-white text-slate-800"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <Button
          className="bg-blue-800 hover:bg-blue-700 w-full mt-4"
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading ? <Loading /> : "Update"}
        </Button>
      </div>
    </>
  );
};

export default Content;
