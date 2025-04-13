import React from "react";
import AppBar from "./_components/AppBar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShoppingBag, Home } from "lucide-react";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 to-white">
      <AppBar />

      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Text content */}
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-cyan-800">404</h1>

            <p className="text-lg text-gray-600">
              We couldn't find the delicious food. Maybe will put in our bacala!
            </p>
          </div>

          {/* Action buttons with food-themed icons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button
              asChild
              size="lg"
              className="gap-2 bg-cyan-600 hover:bg-cyan-700"
            >
              <Link href="/">
                <Home className="h-5 w-5" />
                Back to Home
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="gap-2 border-cyan-600 text-cyan-700 hover:bg-amber-50"
            >
              <Link href="/product-category">
                <ShoppingBag className="h-5 w-5" />
                Browse Categories
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Simple food-themed footer */}
      <footer className="py-6 border-t text-center text-sm text-gray-500 bg-white">
        <p>© {new Date().getFullYear()} Bacola. Satisfy your cravings.</p>
      </footer>
    </div>
  );
}

export default NotFound;
