import HotProductPage from "./_components/HotProductPage";
import Ads2 from "./_components/Ads2";
import CustomerComment from "./_components/CustomerComment";
import AppBar from "./_components/AppBar";
import BestSeller from "./_components/BestSeller";
import CategoriesFooter from "./_components/CategoriesFooter";
import Footer from "./_components/Footer";
import HealthAds from "./_components/HealthAds";
import Slider from "./_components/Slider";
import FeaturedProducts from "./_components/FeaturedProducts";
import Link from "next/link";
import NewProducts from "./_components/NewProducts";

export default async function Home() {
  return (
    <>
      <AppBar />

      <div className="w-full flex justify-center pt-7 xl:pt-0">
        <div className="px-4 sm:px-6 lg:px-8 xl:px-20 w-full max-w-[2000px] mb-5 pt-24 md:pt-0">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 xl:gap-8">
            <nav className="col-span-12 lg:col-span-3 xl:col-span-3  space-y-12 md:space-y-16 xl:space-y-44 order-1 lg:order-none">
              <div className="hidden lg:block h-[80vh]"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:space-y-36 lg:grid-cols-1 gap-4 sm:gap-6 items-center">
                <div>
                  <BacalNaturalFoods />
                </div>
                <div>
                  <BestBakeryProducts />
                </div>
              </div>

              <FeaturedProducts />
              <CustomerComment />
            </nav>

            <div className="col-span-12 lg:col-span-9 xl:col-span-9 space-y-12 md:space-y-16">
              <Slider />
              <BestSeller />
              <HealthAds />
              <HotProductPage />
              <NewProducts />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <Ads2
                  image="bacola-banner-01.webp"
                  title="Legumes & Cereals"
                  subtitle="Feed your family the best"
                />
                <Ads2
                  image="bacola-banner-02.webp"
                  title="Dairy & Eggs"
                  subtitle="A different kind of grocery store"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center">
        <div className="px-4 sm:px-6 lg:px-8 xl:px-0 max-w-[2000px] w-full">
          <CategoriesFooter />
        </div>
      </div>

      <Footer />
    </>
  );
}
const BacalNaturalFoods = () => {
  return (
    <>
      <div className="col-span-12 md:col-span-3 items-center  relative group">
        <img
          src="banner-box.jpg"
          className="object-cover w-full object-bottom h-[350px] rounded-sm transition-transform duration-300 group-hover:scale-105"
          alt="Banner Box"
        />

        <div className="absolute inset-0 flex flex-col justify-center pl-8 pr-4">
          <div className="max-w-[80%]">
            <p className="text-sm font-medium text-white mb-2">
              Bacal Natural Foods
            </p>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">
              Special Organic{" "}
            </h3>
            <p className="text-gray-600 text-sm mb-5 ">
              Get the best quality natural foods for your healthy diet
            </p>

            <Link
              href="/product-category"
              className="bg-emerald-500 w-fit block hover:bg-emerald-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform group-hover:scale-105"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

const BestBakeryProducts = () => {
  return (
    <>
      <div className="relative group cursor-pointer">
        <img
          src="bacola-banner-04.jpg"
          className="object-cover object-bottom w-full h-[350px] rounded-sm transition-transform duration-300 group-hover:scale-[1.02]"
          alt="Banner Box"
        />

        {/* Text Overlay */}
        <div className="absolute inset-0 flex flex-col justify-center pl-8 pr-4">
          <div className="max-w-[80%]">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Best Bakery Products
            </p>
            <h3 className="text-xl  text-gray-900 mb-1">Freshest Products</h3>
            <p className="text-2xl mb-5 font-bold text-gray-900">every hour.</p>
            <Link
              href="/product-category"
              className="bg-cyan-500  w-fit block hover:bg-cyan-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform group-hover:scale-105"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
