import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faStripe,
} from "@fortawesome/free-brands-svg-icons";
import { Phone, Truck, BadgePercent, ShieldCheck, Zap } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

function Footer() {
  return (
    <>
      {/* Top Section: Newsletter */}
      <div className="bg-blue-900 p-4   xl:px-20 w-full h-[500px] xl:h-72 flex flex-col xl:flex-row justify-between items-center relative">
        {/* Left Side: Text */}
        <div className="text-left max-w-[600px] mb-8 xl:mb-0">
          <p className="text-white mb-1">$20 discount for your first order</p>
          <p className="text-2xl text-white font-bold">
            Join our newsletter and get...
          </p>
          <p className="text-slate-300 max-w-[80%] mt-4">
            Join our email subscription now to get updates on promotions and
            coupons.
          </p>

          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden mt-5">
            <input
              type="email"
              placeholder="Your email address"
              className="px-4 py-3 w-full focus:outline-none"
            />
            <button className="bg-blue-600 text-white px-6 py-3 hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>

        <div className="absolute  bottom-0 right-0">
          <img
            src="/coupon.webp"
            alt="Coupon"
            className="h-52 object-contain"
          />
        </div>
      </div>

      <TopFooter />

      <GroceryList />

      <Copyright />
    </>
  );
}

// Grocery List Component
const GroceryList = async () => {
  const groceryItems = {
    "Fruit & Vegetables": [
      "Fresh Vegetables",
      "Herbs & Seasonings",
      "Fresh Fruits",
      "Cuts & Sprouts",
      "Exotic Fruits & Veggies",
      "Packaged Produce",
      "Party Trays",
    ],
    "Breakfast & Dairy": [
      "Milk & Flavoured Milk",
      "Butter and Margarine",
      "Cheese",
      "Eggs Substitutes",
      "Honey",
      "Marmalades",
      "Sour Cream and Dips",
      "Yogurt",
    ],
    "Meat & Seafood": [
      "Breakfast Sausage",
      "Dinner Sausage",
      "Beef",
      "Chicken",
      "Sliced Deli Meat",
      "Shrimp",
      "Wild Caught Fillets",
      "Crab and Shellfish",
      "Farm Raised Fillets",
    ],
    Beverages: [
      "Water",
      "Sparkling Water",
      "Soda & Pop",
      "Coffee",
      "Milk & Plant-Based Milk",
      "Tea & Kombucha",
      "Drink Boxes & Pouches",
      "Craft Beer",
      "Wine",
    ],
    "Breads & Bakery": [
      "Milk & Flavoured Milk",
      "Butter and Margarine",
      "Cheese",
      "Eggs Substitutes",
      "Honey",
      "Marmalades",
      "Sour Cream and Dips",
      "Yogurt",
    ],
  };

  return (
    <div className="xl:px-20 bg-gray-100 p-4  ">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {Object.entries(groceryItems).map(([category, items]) => (
          <div key={category}>
            <Link
              href={`/product-category/${category}`}
              className="text-base font-semibold mb-4 block"
            >
              {category}
            </Link>
            <Link
              href={`/product-category/${category}`}
              className="space-y-2 block"
            >
              {items.map((item) => (
                <li key={item} className="text-slate-600 text-sm block">
                  {item}
                </li>
              ))}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

// Copyright Component
const Copyright = () => {
  return (
    <div className="bg-white text-slate-800 p-4 xl:px-20">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Contact Information */}
        <div>
          <h2 className="text-base font-bold mb-4">Contact</h2>
          <div className="text-slate-600 flex">
            <div className="mr-1">
              <Phone className="" />
            </div>
            <div className="font-semibold text-slate-800">
              8 800 555-55
              <p className="text-slate-500 text-xs  ml-2">
                Working Hours: 8:00 - 22:00
              </p>
            </div>
          </div>
        </div>

        {/* Mobile App Promotion */}
        <div>
          <h2 className="text-base font-bold mb-4">Get Our Mobile App</h2>
          <p className="text-slate-600 mb-4 text-sm">
            Download our app and get 15% off your first purchase.
          </p>
          <div className="flex space-x-4">
            <button
              className="bg-blue-600 p-2 rounded"
              style={{
                backgroundImage: "url('/google-play.webp')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: "150px",
                height: "35px",
              }}
            ></button>
            <button
              className="bg-blue-600 p-2 rounded"
              style={{
                backgroundImage: "url('/app-store.webp')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: "150px",
                height: "35px",
              }}
            ></button>
          </div>
        </div>

        {/* Social Media Icons */}
        <div>
          <h2 className="text-base font-bold mb-4">Follow Us</h2>
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-2xlshadow-2xl border bg-white rounded-full p-2 block"
            >
              <FontAwesomeIcon
                icon={faFacebook}
                className="text-blue-600 size-5"
              />
            </a>
            <a
              href="#"
              className="text-2xlshadow-2xl border bg-white rounded-full p-2 block"
            >
              <FontAwesomeIcon
                icon={faInstagram}
                className="text-blue-600 size-5"
              />
            </a>
          </div>
        </div>

        {/* Payment Icons */}
        <div>
          <h2 className="text-base font-bold mb-4">We Accept</h2>
          <div className="flex space-x-4">
            <FontAwesomeIcon
              icon={faStripe}
              className="text-blue-600 size-14"
            />
            {/* <FontAwesomeIcon
              icon={faPaypal}
              className="text-blue-600 size-14"
            /> */}
          </div>
        </div>
      </div>

      {/* Copyright Text and Links */}
      <div className="flex flex-col xl:flex-row justify-between items-center mt-8 border-t border-gray-300 pt-8">
        <p className="text-slate-500 text-sm mb-4 xl:mb-0">
          Copyright 2025 © Bacola. All rights reserved. Powered by Ghost.
        </p>
        <div className="flex space-x-4">
          <a href="#" className="text-slate-600 hover:text-slate-800 text-sm">
            Privacy Policy
          </a>
          <a href="#" className="text-slate-600 hover:text-slate-800 text-sm">
            Terms and Conditions
          </a>
          <a href="#" className="text-slate-600 hover:text-slate-800 text-sm">
            Cookies
          </a>
        </div>
      </div>
    </div>
  );
};

const TopFooter = () => {
  return (
    <div
      className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-gray-100 xl:py-10 xl:px-20 "
      // className=" px-4 sm:px-20 py-6 mx-auto  bg-gray-100 border-b rounded-xl shadow-md flex flex-col sm:flex-row justify-between xl:items-center space-y-4 sm:space-y-0"
    >
      {/* Section 1: Everyday Fresh Products */}
      <div className="flex items-center space-x-4 relative">
        <Zap className="w-6 h-6 text-blue-600" /> {/* Lucide icon */}
        <div className="text-base font-medium">Everyday Fresh Products</div>
        <Separator
          orientation="vertical"
          className="hidden md:block h-8 bg-gray-300 absolute right-0"
        />
      </div>

      {/* Separator for larger screens */}

      {/* Section 2: Free Delivery */}
      <div className="flex items-center space-x-4 relative">
        <Truck className="w-5 h-5 text-green-600" /> {/* Lucide icon */}
        <div className="text-base font-medium">
          Free delivery for orders over $70
        </div>
        <Separator
          orientation="vertical"
          className="hidden md:block h-8 bg-gray-300 absolute right-0"
        />
      </div>

      {/* Section 3: Daily Mega Discounts */}
      <div className="flex items-center space-x-4 relative">
        <BadgePercent className="w-5 h-5 text-orange-600" /> {/* Lucide icon */}
        <div className="text-base font-medium">Daily Mega Discounts</div>
        <Separator
          orientation="vertical"
          className="hidden md:block h-8 bg-gray-300 absolute right-0"
        />
      </div>

      {/* Section 4: Best Price */}
      <div className="flex items-center space-x-4">
        <ShieldCheck className="w-5 h-5 text-purple-600" /> {/* Lucide icon */}
        <div className="text-base font-medium">Best price on the market</div>
      </div>
    </div>
  );
};

export default Footer;
