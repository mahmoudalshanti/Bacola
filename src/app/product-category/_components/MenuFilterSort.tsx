"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import React, { SetStateAction } from "react";

export default function MenuFilterSort({
  setSelectedSort,
  selectedSort,
}: {
  setSelectedSort: React.Dispatch<SetStateAction<SortOption>>;
  selectedSort: SortOption;
}) {
  const handleSortChange = (sort: SortOption) => {
    setSelectedSort(sort);
  };

  const getLabel = (sort: SortOption) => {
    switch (sort) {
      case "latest":
        return "Sort by latest";
      case "popularity":
        return "Sort by popularity";
      case "rating":
        return "Sort by average rating";
      case "priceLow":
        return "Sort by price: low to high";
      case "priceHigh":
        return "Sort by price: high to low";
      case "topOffer":
        return "Sort by top offers";
      default:
        return "Sort by latest";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <p className="cursor-pointer text-sm flex text-slate-900 font-semibold items-center group">
          {getLabel(selectedSort)}
          <ChevronDown className="size-4 ml-1 transition-transform group-hover:rotate-180" />
        </p>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 cursor-pointer border border-slate-200 shadow-md rounded-md py-1">
        <DropdownMenuItem
          onSelect={() => handleSortChange("latest")}
          className={`
            cursor-pointer transition-colors px-4 py-2 
            hover:bg-transparent hover:text-cyan-700 
            ${selectedSort === "latest" ? "font-semibold text-cyan-700" : ""}
          `}
        >
          Sort by latest
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => handleSortChange("popularity")}
          className={`
            cursor-pointer transition-colors px-4 py-2 
            hover:bg-transparent hover:text-cyan-700 
            ${
              selectedSort === "popularity" ? "font-semibold text-cyan-700" : ""
            }
          `}
        >
          Sort by popularity
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => handleSortChange("rating")}
          className={`
            cursor-pointer transition-colors px-4 py-2 
            hover:bg-transparent hover:text-cyan-700 
            ${selectedSort === "rating" ? "font-semibold text-cyan-700" : ""}
          `}
        >
          Sort by average rating
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => handleSortChange("priceLow")}
          className={`
            cursor-pointer transition-colors px-4 py-2 
            hover:bg-transparent hover:text-cyan-700 
            ${selectedSort === "priceLow" ? "font-semibold text-cyan-700" : ""}
          `}
        >
          Sort by price: low to high
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => handleSortChange("priceHigh")}
          className={`
            cursor-pointer transition-colors px-4 py-2 
            hover:bg-transparent hover:text-cyan-700 
            ${selectedSort === "priceHigh" ? "font-semibold text-cyan-700" : ""}
          `}
        >
          Sort by price: high to low
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={() => handleSortChange("topOffer")}
          className={`
            cursor-pointer transition-colors px-4 py-2 
            hover:bg-transparent hover:text-cyan-700 
            ${selectedSort === "topOffer" ? "font-semibold text-cyan-700" : ""}
          `}
        >
          Sort by price: top offers
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
