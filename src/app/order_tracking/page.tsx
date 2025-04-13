import NavigationBar from "../_components/NavigationBar";
import getUser from "../_components/getUser";
import { User, ArrowRight, Smile } from "lucide-react";
import Link from "next/link";
import OrdersPage from "./_components/OrdersPage";

export default async function Page() {
  let user = null;
  try {
    user = await getUser();
  } catch (err) {
    console.error("Something went Error!", err);
  }

  return (
    <div className="py-[130px] md:p-0 mb-0 md:mb-32">
      <NavigationBar navigation="order tracking" />

      <div className="mx-auto">
        {user ? (
          <OrdersPage />
        ) : (
          <div className=" rounded-xl p-8 text-center max-w-md  mx-auto">
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="p-4 bg-blue-50 rounded-full">
                <Smile className="h-10 w-10 text-cyan-500" />
              </div>

              <h1 className="text-2xl font-semibold text-gray-800">
                Oops! You're not signed in
              </h1>

              <p className="text-gray-600">
                Join our community to access this page and discover exclusive
                features.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Link
                  href="/sign-up"
                  className="flex-1 flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg text-white bg-cyan-600 hover:bg-cyan-700 transition-colors"
                >
                  Create account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>

                <Link
                  href="/sign-in"
                  className="flex-1 flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg text-cyan-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <User className="mr-2 h-4 w-4" />
                  Sign in
                </Link>
              </div>

              <p className="text-xs text-gray-400 pt-2">
                By continuing, you agree to our Terms and Privacy Policy
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
