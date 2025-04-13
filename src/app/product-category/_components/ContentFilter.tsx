"use client";

import { Grid2X2, Grid3X3, Menu } from "lucide-react";
import React, { SetStateAction, useState, useEffect } from "react";
import MenuFilterSort from "./MenuFilterSort";
import ResponsiveProductsFiltration from "./ResponsiveProductsFiltration";

function ContentFilter({
  setLoading,
  loading,
  setGridSort,
  setSelectedSort,
  selectedSort,
  pagination,
  gridSort,
  categories,
  category,
  setPagination: setPagingation,
}: {
  setPagination: React.Dispatch<SetStateAction<number>>;
  setLoading: React.Dispatch<SetStateAction<boolean>>;
  setGridSort: React.Dispatch<SetStateAction<3 | 2 | 1>>;
  setSelectedSort: React.Dispatch<SetStateAction<SortOption>>;
  selectedSort: SortOption;
  loading: boolean;
  pagination: number;
  gridSort: 1 | 2 | 3;
  categories: Category[];
  category?: Category | null;
}) {
  const [isMobile, setIsMobile] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); // Hide when width is 640px or less
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="bg-gray-100 p-4 flex justify-between">
      <div className="flex items-center">
        <Menu
          onClick={() => setGridSort(1)}
          className={` ${
            gridSort === 1 ? "font-bold text-slate-900" : ""
          } text-gray-500 size-5 mr-2 cursor-pointer hover:text-slate-800 hidden sm:flex`}
        />
        <Grid2X2
          onClick={() => setGridSort(2)}
          className={` ${
            gridSort === 2 ? "font-bold text-slate-900" : ""
          } text-gray-500 size-5 mr-2 cursor-pointer hover:text-slate-800 hidden sm:flex`}
        />
        <Grid3X3
          onClick={() => setGridSort(3)}
          className={` ${
            gridSort === 3 ? "font-bold text-slate-900" : ""
          } text-gray-500 size-5 mr-2 cursor-pointer hover:text-slate-800 hidden sm:flex`}
        />
        {isMobile && (
          <div>
            <ResponsiveProductsFiltration
              setPagination={setPagingation}
              setLoading={setLoading}
              loading={loading}
              selectedSort={selectedSort}
              pagination={pagination}
              categories={categories}
              category={category}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
          </div>
        )}
      </div>
      <div className="flex items-center">
        <div>
          <MenuFilterSort
            setSelectedSort={setSelectedSort}
            selectedSort={selectedSort}
          />
        </div>
      </div>
    </div>
  );
}

export default ContentFilter;
