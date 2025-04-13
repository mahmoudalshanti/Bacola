"use client";

import Input from "@/components/Input";
import { Button } from "@/components/ui/button";
import {
  Info,
  InfoIcon,
  Search,
  Trash,
  UploadCloud,
  View,
  X,
} from "lucide-react";
import {
  KeyboardEvent,
  SetStateAction,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  actionCreatCategory,
  actionDeleteCategory,
  actionDeleteProduct,
  actionSearchProduct,
  actionGetProductsCategory,
} from "../../_actions/actionDashboard";
import Loading from "@/components/Loading";
import { DrawerDialog } from "@/components/Drawer";
import CustomLoading from "@/components/CustomLoading";
import ViewProduct from "./ViewProduct";
import CategoriesCard from "../../_components/cards/Categories";
import ProductsCard from "../../_components/cards/Products";
import { useDropzone } from "react-dropzone";
import { capitalizeIfAmpersand, cn } from "@/lib/utils";

function Category({
  categories,
  productsCount,
}: {
  categories: Category[];
  productsCount: number;
}) {
  const [category, setCategory] = useState<string>("");
  const [loadingAdd, setLoadingAdd] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("");
  const [openError, setOpenError] = useState<boolean>(false);
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [openCategory, setOpenCategory] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingViewCategory, setLoadingViewCategory] =
    useState<boolean>(false);
  const [viewProductCategory, setViewProductCategory] =
    useState<boolean>(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState<string | null>(
    null
  );

  const [imagePreview, setImagePreview] = useState<string>("");

  const handleAddCategory = async () => {
    try {
      setLoadingAdd(true);
      setErrMsg("");
      const data = await actionCreatCategory(category, imagePreview);

      if (data && "errMsg" in data) {
        if (data.errMsg) throw new Error(data.errMsg);
        else {
          setOpenCategory(false);
          setCategory("");
          setImagePreview("");
        }
      } else {
        setOpenCategory(false);
        setCategory("");
        setImagePreview("");
      }
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : "Something went wrong!");
      setOpenError(true);
    } finally {
      setLoadingAdd(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") setOpenCategory(true);
  };

  const handleSearch = useCallback(async () => {
    try {
      setLoadingSearch(true);
      setErrMsg("");
      const foundProducts: Product[] | {}[] = (await actionSearchProduct(
        search
      )) as Product[] | {}[];
      setProducts(foundProducts as Product[]);
      setOpenSearch(true);

      if ("errMsg" in foundProducts) {
        if (
          typeof foundProducts === "object" &&
          "errMsg" in foundProducts &&
          typeof foundProducts.errMsg === "string" &&
          foundProducts.errMsg
        ) {
          throw new Error(foundProducts.errMsg);
        }
      }
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : "Something went wrong!");
      setOpenError(true);
      console.error("Something went wrong", err);
    } finally {
      setLoadingSearch(false);
    }
  }, [search]);

  const handleKeyDownSearch = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") handleSearch();
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      setLoadingDelete(true);
      setErrMsg("");
      const data = await actionDeleteCategory(id);

      if (data && "errMsg" in data) {
        if (data.errMsg) throw new Error(data.errMsg);
      } else {
        setOpenConfirmDelete(null);
      }
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : "Something went wrong!");
      setOpenError(true);
      console.error("Something went wrong", err);
    } finally {
      setLoadingDelete(false);
    }
  };

  const handelViewProductsCategory = async (id: string) => {
    try {
      setLoadingViewCategory(true);
      setErrMsg("");
      const data = await actionGetProductsCategory(id);

      setProducts(
        data.category?.products.map((prod) => ({
          ...prod,
          category: {
            id: data?.category?.id || "",
            name: data.category?.name || "",
          },
          images: prod.images as { type: string; image: string }[],
        })) || []
      );

      if (data && "errMsg" in data) {
        if (data.errMsg) throw new Error(data.errMsg);
      }
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : "Something went wrong!");
      setOpenError(true);
      console.error("Something went wrong", err);
    } finally {
      setLoadingViewCategory(false);
    }
  };
  return (
    <div>
      <DrawerDialog
        open={openSearch}
        setOpen={setOpenSearch}
        content={
          <div className=" p-5 h-96 overflow-y-scroll">
            {products.length ? (
              products.map((product) => (
                <ViewProductSearch
                  key={product.id}
                  product={product}
                  setOpenSearch={setOpenSearch}
                />
              ))
            ) : (
              <p className="text-slate-700 flex items-center">
                <InfoIcon className="mr-1" /> No products found
              </p>
            )}
          </div>
        }
      />

      <div className="gap-2 md:flex">
        <CategoriesCard categories={categories.length} />
        <ProductsCard products={productsCount} />
      </div>

      <div className="relative mt-5">
        <Input
          className="w-full pr-10"
          placeholder="Search product name, category"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDownSearch}
        />
        <div className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer">
          {loadingSearch ? (
            <CustomLoading props="w-5 h-5 border-t-cyan-950 border-slate-300" />
          ) : (
            <Search className="text-slate-600" onClick={handleSearch} />
          )}
        </div>
      </div>

      <div className="mt-5 md:flex-row flex justify-between flex-col">
        <div className="flex w-full md:w-2/3 items-start mb-4 md:mb-0 mr-5">
          <Input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            onKeyDown={handleKeyDown}
            className="text-sm flex-1 mr-2 w-full"
            placeholder="New Category"
          />
          <Button
            disabled={loadingAdd || !category}
            className="flex items-center ml-2 h-9 bg-emerald-800 hover:bg-emerald-900"
            onClick={() => setOpenCategory(true)}
          >
            Browse
          </Button>
        </div>

        <div className="w-full ">
          <p className="text-sm text-muted-foreground">Categories</p>
          <div className="bg-slate-100 p-5 overflow-y-auto rounded-md">
            {categories.length ? (
              categories.map((category: Category) => (
                <div
                  key={category.id}
                  className="flex justify-between items-center mb-2"
                >
                  <div className="flex">
                    <img
                      src={category.image}
                      alt=""
                      className="h-8 w-8 mr-2 items-center"
                    />
                    <p className="text-slate-800 font-semibold">
                      {capitalizeIfAmpersand(category?.name)}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Trash
                      className="text-red-600 size-5 cursor-pointer"
                      onClick={() => setOpenConfirmDelete(category.id)}
                    />
                    <View
                      className="text-blue-600 size-5 cursor-pointer ml-2"
                      onClick={() => {
                        setViewProductCategory(true);
                        handelViewProductsCategory(category.id);
                      }}
                    />
                  </div>

                  {openConfirmDelete === category.id && (
                    <DrawerDialog
                      content={
                        <div className="p-5">
                          <p className="text-slate-800 font-semibold mb-2">
                            Are you sure you want to delete "{category.name}"?
                            This will also delete associated products.
                          </p>
                          <Button
                            disabled={loadingDelete}
                            className="w-full bg-red-700 hover:bg-red-600"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            {loadingDelete ? <Loading /> : "Delete"}
                          </Button>
                        </div>
                      }
                      open={openConfirmDelete === category.id}
                      setOpen={() => setOpenConfirmDelete(null)}
                    />
                  )}
                </div>
              ))
            ) : (
              <p className="text-slate-800 font-semibold">
                No categories found
              </p>
            )}
          </div>
        </div>
      </div>
      {!errMsg && !loadingViewCategory && (
        <DrawerDialog
          open={viewProductCategory}
          setOpen={setViewProductCategory}
          content={
            <div className="p-5 overflow-y-scroll h-96">
              {products.length ? (
                products.map((product) => (
                  <ViewProductSearch
                    key={product.id}
                    product={product}
                    setOpenSearch={setViewProductCategory}
                  />
                ))
              ) : (
                <p className="text-slate-700 flex items-center">
                  <InfoIcon className="mr-1" /> No products found
                </p>
              )}
            </div>
          }
        />
      )}

      <DrawerDialog
        content={<div className="p-5 text-red-500 ">{errMsg}</div>}
        open={openError}
        setOpen={setOpenError}
      />

      <DrawerDialog
        content={
          <AddCategory
            category={category}
            setCategory={setCategory}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            handleAddCategory={handleAddCategory}
            loading={loadingAdd}
          />
        }
        open={openCategory}
        setOpen={setOpenCategory}
      />
    </div>
  );
}

const AddCategory = ({
  category,
  setCategory,
  imagePreview,
  setImagePreview,
  handleAddCategory,
  loading,
}: {
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  setImagePreview: React.Dispatch<React.SetStateAction<string>>;
  imagePreview: string;
  handleAddCategory: () => Promise<void>;
  loading: boolean;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string[]>([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setErrMsg([]);
      const file = acceptedFiles[0];

      // Immediately create and set the preview
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    },
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxSize: 5 * 1024 * 1000, // 5MB
    multiple: false,
    onDropRejected: (fileRejections) => {
      setErrMsg(fileRejections[0].errors.map((error) => error.message));
      setOpen(true);
    },
  });

  const removeImage = () => {
    setImagePreview("");
  };

  return (
    <div className="space-y-6">
      {/* Category Name Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Category Name
        </label>
        <Input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Enter category name"
          className="w-full"
        />
      </div>

      {/* Drag and Drop Zone */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Category Image
        </label>
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400",
            imagePreview && "p-0 border-0"
          )}
        >
          {imagePreview ? (
            <div className="relative group">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center space-y-2">
                <UploadCloud className="h-10 w-10 text-gray-400" />
                {isDragActive ? (
                  <p className="text-sm text-gray-600">Drop the image here</p>
                ) : (
                  <>
                    <p className="text-sm text-gray-600">
                      Drag & drop an image here, or click to select
                    </p>
                    <p className="text-xs text-gray-500">
                      Supports: JPG, PNG, WEBP (Max 5MB)
                    </p>
                  </>
                )}
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2"
                  size="sm"
                >
                  Select Image
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      <Button
        disabled={!imagePreview || !category || loading}
        onClick={handleAddCategory}
        className="w-full cursor-pointer"
      >
        {loading ? "Adding..." : "Add Category"}
      </Button>

      {/* Error Dialog */}
      <DrawerDialog
        content={
          <div className="p-5 flex items-start">
            <Info className="text-red-600 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-red-600">Upload Error</h3>
              <ul className="mt-1 text-sm text-red-500 list-disc pl-5 space-y-1">
                {errMsg.map((msg, i) => (
                  <li key={i}>{msg}</li>
                ))}
              </ul>
            </div>
          </div>
        }
        open={open}
        setOpen={setOpen}
      />
    </div>
  );
};

export const ViewProductSearch = ({
  product,
  setOpenSearch,
}: {
  product: Product;
  setOpenSearch: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const [errMsg, setErrMsg] = useState<string>("");
  const [openError, setOpenError] = useState<boolean>(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [openView, setOpenView] = useState<boolean>(false);

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const data = await actionDeleteProduct(id);
      setOpenSearch(false);

      if (data && "errMsg" in data) {
        if (data.errMsg) throw new Error(data.errMsg);
      }
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : "Something went wrong!");
      setOpenError(true);
      console.error("Something went error!", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-between mt-4 mb-1 ">
      <div className="flex items-center justify-between w-full p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-md overflow-hidden border border-gray-100">
            <img
              className="w-full h-full object-cover"
              src={product?.images?.[0]?.image}
              alt={product.name}
            />
          </div>
          <div className="flex flex-col">
            <p className="text-gray-800 font-medium">{product.name}</p>
            <p className="text-slate-500 text-sm">{product?.category?.name}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors shadow-sm hover:shadow-md"
            onClick={() => {
              setViewProduct(product);
              setOpenView(true);
            }}
          >
            <View className="w-5 h-5" />
          </Button>
          <Button
            disabled={loading}
            className="w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            onClick={() => setOpenConfirmDelete(true)}
          >
            {loading ? (
              <CustomLoading props="w-5 h-5 border-t-white border-slate-300" />
            ) : (
              <Trash className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      <DrawerDialog
        content={
          <div className="p-5 text-red-500">
            <InfoIcon className="mr-2" />
            {errMsg}
          </div>
        }
        open={openError}
        setOpen={setOpenError}
      />

      <DrawerDialog
        content={
          <div className="p-5">
            <p className="text-slate-800 font-semibold mb-2">
              Are you sure you want to delete "{product.name}"?
            </p>
            <Button
              disabled={loading}
              className="w-full bg-red-700 hover:bg-red-600"
              onClick={() => handleDelete(product.id)}
            >
              {loading ? <Loading /> : "Delete"}
            </Button>
          </div>
        }
        open={openConfirmDelete}
        setOpen={setOpenConfirmDelete}
      />

      <DrawerDialog
        content={
          viewProduct && (
            <ViewProduct
              product={viewProduct}
              setOpenView={setOpenView}
              setViewProduct={setViewProduct}
            />
          )
        }
        open={openView}
        setOpen={setOpenView}
      />
    </div>
  );
};

export default Category;
