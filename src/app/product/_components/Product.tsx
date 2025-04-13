"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Minus, Plus, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import { capitalizeIfAmpersand } from "@/lib/utils";

import ProductCard from "@/app/_components/ProductCard";
import {
  actionAddToCart,
  actionDecrementQu,
  actionIncrementQu,
} from "@/app/cart/_actions/actionCart";
import {
  ToastAddCartSuccess,
  ToastAddWishlistSuccess,
  ToastFaild,
} from "@/components/Toasts";
import Loading from "@/components/Loading";
import NotUserDialog from "@/app/_components/NotUserDialog";
import {
  actionAddToWishlist,
  actionDeleteFromWishlist,
} from "@/app/wishlist/_actions/actionWishlist";
import {
  actionAddRating,
  actionGetRelatedProducts,
} from "@/app/dashboard/_actions/actionDashboard";
import { Textarea } from "@/components/ui/textarea";
import { useProduct, UserProduct } from "@/app/_context/ProductsProvider";
import StarRating from "@/components/RatingStars";
import PageLoading from "@/components/PageLoading";
import { useUser } from "@/app/_context/UserProvider";
import Link from "next/link";

const ProductDetails = ({
  product,
  hidden,
  rates,
}: {
  product: UserProduct;
  hidden?: boolean;
  rates?: Rates;
}) => {
  const [previewImage, setPreviewImage] = useState<string>(
    product?.images[0]?.image
  );
  const [selectedThumbnail, setSelectedThumbnail] = useState<string>(
    product?.images[0]?.image
  );
  const { user } = useUser();
  const [quantity, setQuantity] = useState<number>(product?.quantity || 1); // Local quantity state
  const [loading, setLoading] = useState<boolean>(false); // Loading state for API calls
  const { updateQuantity, updateInCart, updateInWishlist } = useProduct();
  const [inWishlist, setInWishlist] = useState<boolean>(product.inWishlist);
  const [loadingInWishlist, setLoadingInWishlist] = useState<boolean>(false);
  const [openSignin, setOpenSignin] = useState<boolean>(false);
  const [isHoverdHeart, setIsHoveredHeart] = useState<boolean>(false);

  // Debounce function to delay API calls
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Debounced increment handler
  const handleIncrement = useCallback(
    debounce(async (productId: string, currentQuantity: number) => {
      try {
        if (user?.id) {
          setLoading(true);
          updateQuantity(productId, currentQuantity + 1);
          const data = await actionIncrementQu(productId, currentQuantity + 1);
          ToastAddCartSuccess(
            `${currentQuantity + 1}x ${capitalizeIfAmpersand(product.name)}`
          );
          if ("errMsg" in data) {
            if (data.errMsg) throw new Error(data.errMsg);
          }
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Something went wrong!";
        ToastFaild("Something went Error!");
        console.error("Something went Error!", err);
      } finally {
        setLoading(false);
      }
    }, 500), // 500ms delay
    []
  );

  // Debounced decrement handler
  const handleDecrement = useCallback(
    debounce(async (productId: string, currentQuantity: number) => {
      try {
        if (user?.id) {
          if (currentQuantity > 1) {
            setLoading(true);
            updateQuantity(productId, currentQuantity - 1);
            const data = await actionDecrementQu(
              productId,
              currentQuantity - 1
            );
            ToastAddCartSuccess(
              `${currentQuantity - 1}x ${capitalizeIfAmpersand(product.name)}`
            );

            if ("errMsg" in data) {
              if (data.errMsg) throw new Error(data.errMsg);
            }
          }
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Something went wrong!";
        ToastFaild("Something went wrong!");
        console.error("Something went Error!", err);
      } finally {
        setLoading(false);
      }
    }, 500), // 500ms delay
    []
  );

  // Handle increment with real-time updates
  const handleIncrementClick = () => {
    setQuantity((prev) => prev + 1); // Update local state immediately
    handleIncrement(product.id, quantity); // Debounced API call
  };

  // Handle decrement with real-time updates
  const handleDecrementClick = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1); // Update local state immediately
      handleDecrement(product.id, quantity); // Debounced API call
    }
  };

  const handelAddtoCart = async () => {
    try {
      if (user?.id) {
        setLoading(true);
        const data = await actionAddToCart(product?.id);
        updateInCart(product.id, true);
        ToastAddCartSuccess(`1x ${capitalizeIfAmpersand(product.name)}`);
        if (data && "errMsg" in data) {
          if (data.errMsg) throw new Error(data.errMsg);
        }
      } else {
        setOpenSignin(true);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong!";
      ToastFaild("Something went Error!");
      console.error("Something went Error!", err);
    } finally {
      setLoading(false);
    }
  };

  const handelAddToWishlist = async () => {
    try {
      if (user?.id) {
        if (!inWishlist) {
          setLoadingInWishlist(true);
          setInWishlist(true);
          updateInWishlist(product.id, true);
          const data = await actionAddToWishlist(product.id);
          ToastAddWishlistSuccess(
            `Add to Wishlist ${capitalizeIfAmpersand(product.name)}`
          );

          if (data && "errMsg" in data) {
            if (data.errMsg) throw new Error(data.errMsg);
          }
        }
        if (inWishlist) {
          setLoadingInWishlist(true);
          setInWishlist(false);
          updateInWishlist(product.id, false);
          const data = await actionDeleteFromWishlist(product.id);
          ToastAddWishlistSuccess(
            `Remove from Wishlist ${capitalizeIfAmpersand(product.name)}`
          );

          if (data && "errMsg" in data) {
            if (data.errMsg) throw new Error(data.errMsg);
          }
        }
      } else {
        setOpenSignin(true);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong!";
      ToastFaild("Something went wrong!");
      console.error("Something went Error!", err);
    } finally {
      setLoadingInWishlist(false);
    }
  };

  return (
    <div>
      <NotUserDialog open={openSignin} setOpen={setOpenSignin} />
      <div className="bg-white relative rounded-sm mx-auto px-4">
        <div className="p-5 flex justify-between">
          <div>
            <p className="text-base mb-3 md:mb-0 font-bold text-slate-700 md:text-2xl mr-3">
              {capitalizeIfAmpersand(product?.name ? product?.name : "")}
            </p>
            <div className="flex items-center gap-1">
              <div>
                <StarRating rate={product?.rate} />
              </div>{" "}
              <p className="text-slate-600">
                {rates?.rates?.length ?? product?._count?.ratings
                  ? `(${rates?.rates?.length ?? product?._count?.ratings})`
                  : null}{" "}
              </p>
            </div>
          </div>
          <div
            onClick={handelAddToWishlist}
            className="border w-10 h-10 relative flex justify-center items-center border-gray-300 rounded-full p-2 hover:border-gray-400 transition-colors cursor-pointer"
          >
            {loadingInWishlist && (
              <div className="absolute rounded-full bg-gray-200 cursor-wait z-40 bg-opacity-30 w-full h-full left-0 top-0"></div>
            )}
            <div
              onMouseEnter={() => setIsHoveredHeart(true)}
              onMouseLeave={() => setIsHoveredHeart(false)}
              className={`bg-white rounded-full ${
                inWishlist ? " hover:bg-slate-500" : ""
              } w-10 h-10 flex items-center  justify-center  p-2  hover:text-cyan-700`}
            >
              <Heart
                className={`
                          size-8 
                       transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                        ${
                          inWishlist
                            ? `fill-slate-500 text-slate-500 
                   hover:fill-white hover:text-white
                   active:scale-95`
                            : `text-gray-400 
                   hover:fill-slate-500 hover:text-slate-500 
                   active:scale-95`
                        }
                       ${isHoverdHeart ? "scale-110" : ""}
                         drop-shadow-sm
                            hover:drop-shadow-md
                          `}
              />
            </div>
          </div>
        </div>

        <div className="py-6 grid md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div>
            {/* Main Preview Image */}
            <img
              src={previewImage}
              alt="Product Image"
              width={400}
              height={400}
              className="rounded-lg w-full h-auto object-cover"
            />

            {/* Thumbnails */}
            <div className="flex gap-2 mt-4 justify-center">
              {product?.images?.map(
                (image: { type: string; image: string }, index: number) => (
                  <div
                    key={image?.image}
                    className={`border p-1 cursor-pointer rounded-lg ${
                      selectedThumbnail === image?.image
                        ? "border-blue-500 border-2"
                        : "border-gray-300"
                    }`}
                    onClick={() => {
                      setPreviewImage(image?.image);
                      setSelectedThumbnail(image?.image);
                    }}
                  >
                    <img
                      src={image?.image}
                      alt={`Thumbnail ${index + 1}`}
                      width={60}
                      height={60}
                      className="rounded-md"
                    />
                  </div>
                )
              )}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-center">
              {product?.offer !== 0 && (
                <p className="text-emerald-600 text-2xl font-bold my-2">
                  ${product?.offer}
                </p>
              )}
              <p
                className={`${
                  product?.offer
                    ? "text-gray-500 line-through text-sm bg-gray-100 rounded-full p-1 ml-2"
                    : "text-emerald-600 text-2xl font-bold my-2"
                }`}
              >
                ${product?.price}
              </p>
            </div>

            <p className="text-gray-600 mt-3">
              Vivamus adipiscing nisl ut dolor dignissim semper. Nulla luctus
              malesuada tincidunt.
            </p>

            {/* Product Variants */}
            {product?.inCart ? (
              <Card className="p-4 mt-4 relative">
                {loading && (
                  <div className="absolute bg-gray-200 cursor-wait z-40 bg-opacity-30 w-full h-full left-0 top-0"></div>
                )}
                <div className="flex justify-between items-center py-2 border-b last:border-none">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleDecrementClick}
                      disabled={quantity <= 1 || loading}
                      className="border rounded-full p-1 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                      <Minus size={16} />
                    </button>
                    <span>{quantity}</span>
                    <button
                      onClick={handleIncrementClick}
                      disabled={loading}
                      className="border rounded-full p-1 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-wait"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <p className="text-gray-400">
                    Total:{" "}
                    <span className="text-gray-500 font-semibold">
                      $
                      {((product?.offer || product?.price) * quantity).toFixed(
                        2
                      )}
                    </span>
                  </p>
                </div>
              </Card>
            ) : (
              <Button
                className="mt-4 w-full bg-blue-600 hover:bg-blue-600 text-white"
                onClick={() => handelAddtoCart()}
                disabled={loading || product?.inCart}
              >
                {loading ? <Loading /> : "Add to cart"}
              </Button>
            )}
            <p className="text-gray-400 text-sm mt-5">
              Category:{" "}
              <span className="text-gray-500 font-semibold text-sm">
                {capitalizeIfAmpersand(
                  product?.category?.name ? product?.category?.name : ""
                )}
              </span>
            </p>
          </div>
        </div>
      </div>
      {!hidden ? (
        <>
          <ProductInfo
            product={product}
            rates={rates || { rates: [], ratedUser: false }}
          />
          <p className="text-gray-800 font-bold mt-12">RELATED PRODUCTS</p>
          <RelatedProducts
            category={product?.category?.name}
            id={product?.id}
          />
        </>
      ) : (
        <>
          <Link
            href={`/product/${product?.id}`}
            className="text-gray-500 hover:text-gray-400  px-5 underline text-sm cursor-pointer"
          >
            Show more
          </Link>
        </>
      )}
    </div>
  );
};

const ProductInfo = ({
  product,
  existingRatings = [],
  rates,
}: {
  product: UserProduct;
  existingRatings?: Rating[];
  rates: Rates;
}) => {
  const [descriptionOpen, setDescriptionOpen] = useState<boolean>(true);
  const [userRating, setUserRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const { user } = useUser();
  const [openSignin, setOpenSignin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleStarClick = (rating: number) => {
    setUserRating(rating);
  };

  const handleStarHover = (rating: number) => {
    setHoveredRating(rating);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const renderStars = (rating: number, isInteractive = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`text-white size-5 ${
            i <= (isInteractive ? hoveredRating || userRating : rating)
              ? "fill-yellow-400"
              : "fill-gray-300"
          } ${isInteractive ? "cursor-pointer hover:fill-yellow-400" : ""}`}
          onClick={isInteractive ? () => handleStarClick(i) : undefined}
          onMouseEnter={isInteractive ? () => handleStarHover(i) : undefined}
          onMouseLeave={isInteractive ? handleStarLeave : undefined}
        />
      );
    }
    return stars;
  };

  const handleSubmit = async () => {
    try {
      if (user?.id) {
        setLoading(true);
        const data = await actionAddRating(userRating, comment, product.id);
        setUserRating(0);
        setComment("");

        if (data && "errMsg" in data) {
          if (data.errMsg) throw new Error(data.errMsg);
        }
      } else {
        setOpenSignin(true);
      }
    } catch (err) {
      console.error("Something went Error!", err);
      ToastFaild("Something went Error!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-md mx-auto px-4 mt-12 py-5 ">
      <NotUserDialog open={openSignin} setOpen={setOpenSignin} />
      <div className="flex border-b border-gray-200">
        <p
          className={`font-semibold text-sm py-2 px-4 cursor-pointer ${
            descriptionOpen
              ? "text-gray-800 border-b-2 border-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setDescriptionOpen(true)}
        >
          DESCRIPTION
        </p>
        <p
          className={`font-semibold text-sm py-2 px-4 cursor-pointer ${
            !descriptionOpen
              ? "text-gray-800 border-b-2 border-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setDescriptionOpen(false)}
        >
          REVIEWS ({rates?.rates?.length || 0})
        </p>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {descriptionOpen ? (
          <motion.div
            key="description"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-5 px-4"
          >
            <p className="text-slate-800">
              {product?.description || "No description available."}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="rates"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-5 px-4"
          >
            {/* User Rating Input */}
            <div>
              <p className="font-medium mb-3">
                {rates.rates.length || 0} REVIEW
                {existingRatings.length === 1 ? "S" : ""} FOR{" "}
                {product?.name?.toUpperCase() || "PRODUCT"}
              </p>

              {rates?.rates?.map((rate: Rating) => (
                <div
                  key={rate.id}
                  className="flex justify-start items-start mb-4"
                >
                  <div className="bg-gray-300 flex justify-center mr-2 p-1 items-center rounded-full w-fit h-fit">
                    <User className="text-white fill-white size-14" />
                  </div>

                  <div>
                    <div className="flex mb-2">
                      {<StarRating rate={rate.rating} size={4} />}
                    </div>
                    <p className="font-semibold">
                      {capitalizeIfAmpersand(rate?.user?.fName)}
                    </p>
                    <p>
                      {rate.comment.charAt(0).toUpperCase() +
                        rate.comment.slice(1).toLowerCase()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {user?.id
              ? !rates.ratedUser && (
                  <div className="mt-8">
                    <p className="font-semibold">Add a review</p>
                    <Separator className="my-3" />
                    <div className="flex items-center mb-3">
                      {renderStars(0, true)}
                    </div>
                    <Textarea
                      className="mt-2 outline-none  bg-gray-100 p-2 rounded-md w-full"
                      placeholder="Your comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <Button
                      className={`mt-4 cursor-pointer  ${
                        loading ? "cursor-not-allowed" : "cursor-pointer"
                      }`}
                      onClick={handleSubmit}
                      disabled={!comment.length || !userRating || loading}
                    >
                      {loading ? "Submitting..." : "Submit"}
                    </Button>
                  </div>
                )
              : ""}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const RelatedProducts = ({
  category,
  id,
}: {
  category: string;
  id: string;
}) => {
  const [isHovered, setIsHovered] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingPage, setLoadingPage] = useState<boolean>(false);
  const { products, setProducts } = useProduct();

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        setLoadingPage(true);
        const products = await actionGetRelatedProducts(category, id);
        setProducts(products as unknown as UserProduct[]);

        if ("errMsg" in products) {
          if (products.errMsg) throw new Error(products.errMsg);
        }
      } catch (err) {
        console.error("Something went Error!", err);
      } finally {
        setLoadingPage(false);
      }
    };
    fetchRelated();
  }, []);

  return (
    <>
      <div className="bg-white rounded-sm mx-auto px-4 mt-1 py-5 relative">
        {loading && (
          <div className="absolute bg-gray-200 cursor-wait z-40 bg-opacity-30 w-full h-full left-0 top-0"></div>
        )}

        {loadingPage ? (
          <PageLoading />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products?.length ? (
              products?.map((product: UserProduct) => (
                <ProductCard
                  key={product.id}
                  isHovered={isHovered}
                  setIsHovered={setIsHovered}
                  product={product}
                  loading={loading}
                  setLoading={setLoading}
                />
              ))
            ) : (
              <p>No products found</p>
            )}
          </div>
        )}
      </div>
    </>
  );
};
export default ProductDetails;
