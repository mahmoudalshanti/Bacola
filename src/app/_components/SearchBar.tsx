"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { searchProducts } from "../dashboard/_actions/actionDashboard";
import { DialogTitle } from "@radix-ui/react-dialog";
import { capitalizeIfAmpersand } from "@/lib/utils";

export default function SearchBar() {
  return (
    <div className="hidden md:block flex-grow max-w-lg">
      <SearchContent />
    </div>
  );
}

export function SearchBarMobile() {
  return (
    <div className="md:hidden w-full px-4 py-2">
      <SearchContent mobile />
    </div>
  );
}

function SearchContent({ mobile = false }: { mobile?: boolean }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim() === "") {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    try {
      const result = await searchProducts(searchQuery);
      setResults(result as Product[]);
      setHasSearched(true);

      if (result && "errMsg" in result)
        if (!result.errMsg) throw new Error(result?.errMsg);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        handleSearch(query);
        setIsDialogOpen(true);
      } else {
        setResults([]);
        setHasSearched(false);
      }
    }, 500); // 500ms debounce delay

    return () => clearTimeout(delayDebounceFn);
  }, [query, handleSearch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) {
      setIsDialogOpen(true);
    }
  };

  return (
    <>
      <div className="relative w-full">
        <Input
          ref={inputRef}
          className={`w-full ${
            mobile ? "bg-background" : "bg-gray-100"
          } h-14  pl-10 pr-8 rounded-md`}
          placeholder="Search for products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Search className="h-6 w-6 text-muted-foreground" />
        </div>
        {query && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={() => {
              setQuery("");
              setResults([]);
              setHasSearched(false);
            }}
          >
            <X className="h-6 w-6 text-muted-foreground" />
          </button>
        )}
      </div>

      {hasSearched && (
        <SearchDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          results={results}
          isLoading={isLoading}
          query={query}
          onSelect={(id) => router.push(`/product/${id}`)}
        />
      )}
    </>
  );
}

function SearchDialog({
  isOpen,
  onOpenChange,
  results,
  isLoading,
  query,
  onSelect,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  results: Product[];
  isLoading: boolean;
  query: string;
  onSelect: (id: string) => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTitle className="sr-only">Search Results</DialogTitle>
      <DialogContent className=" max-w-[340px] sm:max-w-[440px] md:max-w-2xl p-0 overflow-hidden scrollbar-custom-sheet">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium">Search Results</h3>
        </div>

        {isLoading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : results.length === 0 ? (
          <div className="p-8 text-center">
            {query.trim() ? (
              <>
                <Search className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">
                  No products found for "{query}"
                </p>
              </>
            ) : (
              <p className="text-muted-foreground">
                Start typing to search products
              </p>
            )}
          </div>
        ) : (
          <div className="divide-y overflow-y-auto max-h-[60vh] scrollbar-custom-sheet">
            {results.map((product) => (
              <div
                key={product.id}
                className="p-4 hover:bg-accent/50 cursor-pointer transition-colors"
                onClick={() => {
                  onSelect(product.id);
                  onOpenChange(false);
                }}
              >
                <div className="flex gap-4">
                  <div className="relative w-16 h-16 rounded-md overflow-hidden">
                    <img
                      src={
                        product.images[0].image || "/placeholder-product.jpg"
                      }
                      alt={product.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">
                      {capitalizeIfAmpersand(product.name)}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-semibold">
                        ${product.offer ? product.offer : product.price}
                      </span>
                      {product.offer && (
                        <span className="text-xs text-muted-foreground line-through">
                          ${product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
