"use client";

import { Button } from "@/components/ui/button";
import { Expand, Heart } from "lucide-react";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  actionAddToCart,
  actionDecrementQu,
  actionDeleteFromCart,
  actionIncrementQu,
} from "../cart/_actions/actionCart";
import {
  ToastAddCartSuccess,
  ToastAddWishlistSuccess,
  ToastFaild,
} from "@/components/Toasts";
import { capitalizeIfAmpersand } from "@/lib/utils";
import {
  actionAddToWishlist,
  actionDeleteFromWishlist,
} from "../wishlist/_actions/actionWishlist";
import NotUserDialog from "./NotUserDialog";
import Loading from "@/components/Loading";
import { DrawerDialog } from "@/components/Drawer";
import ProductDetails from "../product/_components/Product";
import { useProduct, UserProduct } from "../_context/ProductsProvider";
import StarRating from "@/components/RatingStars";
import { useUser } from "../_context/UserProvider";

export default function ProductCard({
  product,
  isHovered,
  setIsHovered,
  setLoading,
  loading,
  gridSort = 3, // Default to 3 columns
}: {
  product: UserProduct;
  isHovered: string;
  setIsHovered: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  gridSort?: 1 | 2 | 3;
}) {
  const isHoveredCard = isHovered === product.id;
  const [open, setOpen] = useState<boolean>(false);
  const [isHoverdHeart, setIsHoveredHeart] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(product.quantity || 1);
  const { updateInCart, updateQuantity, updateInWishlist } = useProduct();
  const [openSignin, setOpenSignin] = useState<boolean>(false);
  const { user } = useUser();
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
          updateQuantity(productId, currentQuantity);
          const data = await actionIncrementQu(productId, currentQuantity);
          ToastAddCartSuccess(
            `${currentQuantity}x ${capitalizeIfAmpersand(product.name)}`
          );
          if (data && "errMsg" in data)
            if (data.errMsg) throw new Error(data?.errMsg);
        }
      } catch (err) {
        console.error("Something went wrong!", err);
        ToastFaild("Something went wrong!");
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  // Debounced decrement handler
  const handleDecrement = useCallback(
    debounce(async (productId: string, currentQuantity: number) => {
      try {
        if (user?.id) {
          if (currentQuantity > -1) {
            setLoading(true);

            if (currentQuantity === 0) {
              setQuantity(0); // Set to 0 temporarily for UI
              updateQuantity(productId, 0);
              updateInCart(productId, false);
              const data = await actionDeleteFromCart(productId);
              setQuantity(1); // Reset to 1 after deletion
              ToastAddCartSuccess(
                `Remove from Cart ${capitalizeIfAmpersand(product.name)}`
              );

              if (data && "errMsg" in data)
                if (!data.errMsg) throw new Error(data?.errMsg);
            } else {
              updateQuantity(productId, currentQuantity);
              const data = await actionDecrementQu(productId, currentQuantity);
              ToastAddCartSuccess(
                `Add to Cart ${currentQuantity}x ${capitalizeIfAmpersand(
                  product.name
                )}`
              );

              if (data && "errMsg" in data)
                if (data.errMsg) throw new Error(data?.errMsg);
            }
          }
        }
      } catch (err) {
        console.error("Something went Error!", err);
        ToastFaild("Something went wrong!");
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  const handleIncrementClick = (productId: string) => {
    setQuantity((prev) => {
      const newQuantity = prev + 1;
      handleIncrement(productId, newQuantity);
      return newQuantity;
    });
  };

  const handleDecrementClick = (productId: string) => {
    setQuantity((prev) => {
      if (prev > 0) {
        const newQuantity = prev - 1;
        handleDecrement(productId, newQuantity);
        return newQuantity;
      }
      return prev;
    });
  };

  // Update your useEffect to sync with product.quantity on load
  useEffect(() => {
    setQuantity(product.quantity || 1);
  }, [product.quantity]);

  const handelAddtoCart = async () => {
    try {
      if (user?.id) {
        setLoading(true);
        setQuantity(1); // Reset quantity to 1
        const data = await actionAddToCart(product.id);
        updateQuantity(product.id, 1);
        updateInCart(product.id, true);
        ToastAddCartSuccess(`1x ${capitalizeIfAmpersand(product.name)}`);

        if (data && "errMsg" in data)
          if (data.errMsg) throw new Error(data?.errMsg);
      } else {
        setOpenSignin(true);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong!";
      ToastFaild(message);
    } finally {
      setLoading(false);
    }
  };

  const handelAddToWishlist = async () => {
    try {
      if (user?.id) {
        if (!product.inWishlist) {
          setLoading(true);
          updateInWishlist(product.id, true);
          const data = await actionAddToWishlist(product.id);
          ToastAddWishlistSuccess(
            `Add to Wishlist ${capitalizeIfAmpersand(product.name)}`
          );
          if (data && "errMsg" in data)
            if (!data.errMsg) throw new Error(data?.errMsg);
        }
        if (product.inWishlist) {
          setLoading(true);
          updateInWishlist(product.id, false);
          const data = await actionDeleteFromWishlist(product.id);
          ToastAddWishlistSuccess(
            `Remove from Wishlist ${capitalizeIfAmpersand(product.name)}`
          );

          if (data && "errMsg" in data)
            if (data.errMsg) throw new Error(data?.errMsg);
        }
      } else {
        setOpenSignin(true);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong!";
      ToastFaild(message);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic styles based on gridSort
  const cardStyles = useMemo(() => {
    switch (gridSort) {
      case 1:
        return "flex flex-row h-[200px]"; // Single column: image on left, content on right
      case 2:
        return "flex flex-col h-[450px]"; // Two columns: stacked layout
      case 3:
        return "flex flex-col h-[470px]"; // Three columns: compact stacked layout
      default:
        return "flex flex-col h-[300px]"; // Default to compact layout
    }
  }, [gridSort]);

  const imageStyles = useMemo(() => {
    switch (gridSort) {
      case 1:
        return " w-[350px] h-[200px] object-contain"; // Single column: half width, full height
      case 2:
        return "w-full h-[280px] object-contain"; // Two columns: full width, medium height
      case 3:
        return "w-full h-[250px] object-contain"; // Three columns: full width, smaller height
      default:
        return "w-full h-[150px] object-contain"; // Default to smaller height
    }
  }, [gridSort]);

  const contentStyles = useMemo(() => {
    switch (gridSort) {
      case 1:
        return "w-1/2 p-4"; // Single column: half width, padding
      case 2:
        return "p-4"; // Two columns: full width, padding
      case 3:
        return "p-4"; // Three columns: full width, padding
      default:
        return "p-4"; // Default to full width, padding
    }
  }, [gridSort]);

  return (
    <motion.div
      className={`relative ${cardStyles} `}
      onMouseEnter={() => setIsHovered(product.id)}
      onMouseLeave={() => setIsHovered("")}
    >
      <NotUserDialog open={openSignin} setOpen={setOpenSignin} />
      <Card
        className={`rounded-none cursor-pointer ${
          gridSort === 1 ? "border-none shadow-none w-full" : "border-[0.2px]"
        } transition hover:border-slate-400 overflow-hidden hover:shadow-lg hover:shadow-slate-200 flex flex-col h-full`}
      >
        {/* Icons for xl and above (show on hover) */}
        <div className="hidden xl:block">
          {isHoveredCard && (
            <motion.div
              className="absolute right-2 top-10 z-30"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 10 }}
            >
              <div
                onClick={() => setOpen(true)}
                className="
                     mb-1bg-white rounded-full  p-2  transition-all duration-200  ease-in-out    
                      lg:hover:bg-slate-50 
                      lg:hover:shadow-sm lg:hover:-translate-y-0.5
                  "
              >
                <Expand
                  className="
                  text-slate-500 
               lg:size-6 
               lg:group-hover:text-slate-600
             active:text-slate-700
  "
                />
              </div>
              <div
                onClick={() => handelAddToWishlist()}
                onMouseEnter={() => setIsHoveredHeart(true)}
                onMouseLeave={() => setIsHoveredHeart(false)}
                className={`bg-white rounded-full ${
                  product.inWishlist ? " hover:bg-slate-500" : ""
                } w-10 h-10 flex items-center  justify-center  p-2  hover:text-cyan-700`}
              >
                <Heart
                  className={`
                  size-8 
               transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                ${
                  product.inWishlist
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
            </motion.div>
          )}
        </div>

        {/* Icons for smaller screens (always visible) */}
        <div className="xl:hidden absolute right-2 top-10 z-30">
          <div
            onClick={() => setOpen(true)}
            className="mb-1 bg-white rounded-full p-2"
          >
            <Expand className="text-slate-500" />
          </div>
          <div
            onClick={() => handelAddToWishlist()}
            onMouseEnter={() => setIsHoveredHeart(true)}
            onMouseLeave={() => setIsHoveredHeart(false)}
            className={`rounded-full ${
              product.inWishlist
                ? "hover:bg-transparent hover:bg-slate-500"
                : ""
            } w-10 h-10 flex items-center justify-center  p-2 hover:bg-transparent hover:text-cyan-700`}
          >
            <Heart
              className={`
                size-8
              ${
                product.inWishlist
                  ? "fill-slate-600 text-slate-600"
                  : "text-slate-400"
              }
               active:scale-95 transition-transform duration-100
                  `}
            />
          </div>
        </div>

        <CardContent
          className={`p-0 ${
            gridSort === 1 ? "flex-row" : "flex-col"
          } relative flex flex-grow`}
        >
          {/* Responsive Image */}
          {product.offer ? (
            <p className="absolute bg-cyan-500 text-white rounded-sm left-3 top-5 text-xs p-1 px-2">
              {Math.round(
                ((product?.price - product?.offer) / product.price) * 100
              )}
              %
            </p>
          ) : (
            ""
          )}

          <img
            src={product.images[0].image}
            alt={product.name}
            className={`${imageStyles}`}
            loading="lazy"
          />

          {/* Product Details */}
          <div className={`${contentStyles} flex-grow`}>
            <p className="text-slate-900 font-semibold text-sm md:text-base mb-2">
              {capitalizeIfAmpersand(product.name)}
            </p>

            <div className="flex">
              <StarRating rate={product?.rate} size={4} />
            </div>
            <div className="flex items-center mt-0">
              <p
                className={`${
                  product.offer
                    ? "text-gray-400 text-base font-semibold"
                    : "text-pink-700 font-bold text-base md:text-lg"
                } mr-2 relative ${product.offer && "line-through"} mt-2`}
              >
                ${product.price}
              </p>
              {product.offer !== 0 && (
                <p className="text-pink-700 font-bold text-base md:text-lg mt-2">
                  ${product.offer}
                </p>
              )}
            </div>
            {gridSort === 1 && (
              <div className="w-[full] md:w-[60%] lg:w-[80%] mt-5">
                <AddToCartButton
                  product={product}
                  isHoveredCard={isHoveredCard}
                  handleDecrementClick={handleDecrementClick}
                  handleIncrementClick={handleIncrementClick}
                  handelAddtoCart={handelAddtoCart}
                  loading={loading}
                />
              </div>
            )}
          </div>

          {/* Add to Cart Button for xl screens */}
          {gridSort !== 1 && (
            <>
              <div className="block xl:hidden absolute bottom-4 left-4 right-4">
                <AddToCartButton
                  product={product}
                  isHoveredCard={isHoveredCard}
                  handleDecrementClick={handleDecrementClick}
                  handleIncrementClick={handleIncrementClick}
                  handelAddtoCart={handelAddtoCart}
                  loading={loading}
                />
              </div>

              <motion.div
                className="absolute bottom-4 left-4 right-4 opacity-0 hidden xl:block"
                animate={
                  isHoveredCard ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <AddToCartButton
                  product={product}
                  isHoveredCard={isHoveredCard}
                  handleDecrementClick={handleDecrementClick}
                  handleIncrementClick={handleIncrementClick}
                  handelAddtoCart={handelAddtoCart}
                  loading={loading}
                />
              </motion.div>
            </>
          )}
        </CardContent>
      </Card>
      <DrawerDialog
        fullWidth={true}
        content={
          <div className="overflow-y-scroll md:overflow-y-auto scrollbar-custom-sheet h-[500px] md:h-[550px]">
            <ProductDetails product={product} hidden={true} />
          </div>
        }
        open={open}
        setOpen={setOpen}
      />
    </motion.div>
  );
}

const AddToCartButton = ({
  product,
  handleDecrementClick,
  handleIncrementClick,
  handelAddtoCart,
  loading,
}: {
  product: UserProduct;
  isHoveredCard: boolean;
  handleDecrementClick: (id: string) => void;
  handleIncrementClick: (id: string) => void;
  handelAddtoCart: () => void;
  loading: boolean;
}) => {
  const [localQuantity, setLocalQuantity] = useState(product.quantity || 1);

  // Sync with product.quantity changes
  useEffect(() => {
    setLocalQuantity(product.quantity || 1);
  }, [product.quantity]);

  // Optimistic UI updates
  const handleIncrement = () => {
    const newQuantity = localQuantity + 1;
    setLocalQuantity(newQuantity);
    handleIncrementClick(product.id);
  };

  const handleDecrement = () => {
    if (localQuantity > 0) {
      const newQuantity = localQuantity - 1;
      setLocalQuantity(newQuantity);
      handleDecrementClick(product.id);
    }
  };

  return (
    <>
      {product.inCart ? (
        <div className="flex relative items-center justify-center gap-2 border border-slate-200 rounded-full h-[35px]">
          <Button
            onClick={handleDecrement}
            className="w-8 p-0 absolute left-[-2px] text-slate-800 rounded-l-full h-[35px] bg-gray-200 text-xl font-semibold hover:bg-gray-200"
          >
            -
          </Button>
          <span className="text-slate-800 text-base">{localQuantity}</span>
          <Button
            onClick={handleIncrement}
            className="w-8 p-0 absolute right-[-2px] text-slate-800 rounded-r-full h-[35px] bg-yellow-400 text-xl font-semibold hover:bg-yellow-400"
          >
            +
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => handelAddtoCart()}
          variant="outline"
          disabled={loading}
          className="w-full border border-blue-900 bg-transparent h-[35px] bg-blue-900 text-white rounded-full transition-colors"
        >
          {loading ? <Loading /> : "Add to cart"}
        </Button>
      )}
    </>
  );
};
