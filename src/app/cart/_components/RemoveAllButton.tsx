"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { actionRemoveAllInCart } from "../_actions/actionCart";

function RemoveAllButton() {
  const [loading, setLoading] = useState<boolean>(false);
  const handelRemoveAllInCart = async () => {
    try {
      setLoading(true);
      const data = await actionRemoveAllInCart();

      if (data?.errMsg) {
        throw new Error(data?.errMsg);
      }
    } catch (err) {
      console.error("Something went wrong!", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {loading && (
        <div className="absolute bg-gray-200 cursor-wait z-40 bg-opacity-30 w-full h-full left-0 top-0"></div>
      )}

      <Button
        onClick={() => handelRemoveAllInCart()}
        className="px-4 py-3  w-full md:w-fit text-sm  bg-blue-900 text-white rounded-r-lg hover:bg-blue-900"
      >
        Remove All
      </Button>
    </>
  );
}

export default RemoveAllButton;
