import { Clock, Download, ListOrdered } from "lucide-react";
import React from "react";

function AdsBanner() {
  return (
    <div className="mt-0 xl:mt-12 border border-slate-300 rounded-sm">
      <div className="text-sm p-5 border-b  text-slate-700  border-slate-300 flex items-center ">
        <Download className=" text-slate-700 mr-5 " /> Download the Bacola App
        to your Phone.
      </div>
      <div className="text-sm p-5  border-b  text-slate-700  border-slate-300 flex items-center">
        <ListOrdered className=" text-slate-700 mr-5 " /> now so you dont miss
        the opportunities.
      </div>
      <div className="text-sm p-5 text-slate-700 flex items-center ">
        <Clock className=" text-slate-700 mr-5 " /> Your order will arrive at
        your door in 15 minutes.
      </div>
    </div>
  );
}

export default AdsBanner;
