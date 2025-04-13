"use client";

import React from "react";

const CustomerComment = () => {
  const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${"jesica"}`;

  return (
    <div className="">
      {/* Customer Comment */}
      <div className="bg-yellow-50 p-6 rounded-lg shadow-md">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">
          CUSTOMER COMMENT
        </h3>
        <h2 className="text-lg font-bold text-gray-900">
          The Best Marketplace
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut.
        </p>
        <div className="flex items-center mt-4">
          <img
            src={girlProfilePic}
            alt="Customer"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">Tina Mcdonnell</p>
            <p className="text-xs text-gray-500">Sales Manager</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerComment;
