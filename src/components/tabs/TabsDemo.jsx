import React, { useState, useRef } from "react";
import { Tabs } from "./Tabs";
import WeatherContext from "../weather/WeatherContext";
import NetworkData from "../networking/net";

export function TabsDemo() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);



  const tabs = [
    {
      title: "Weather/geolocation",
      value: "product",
      content: (
        <div className="w-full relative h-full rounded-2xl p-3 text-xl md:text-4xl font-bold text-dark bg-gray-200">
          <WeatherContext />
        </div>
      ),
    },
    {
<<<<<<< HEAD
      title: "NetworkData",
=======
      title: "News/Network",
      value: "services",
      content: (
        <div className="w-full relative h-full rounded-2xl p-3 text-xl md:text-4xl font-bold text-dark bg-gray-200">
          <NewsContext />
        </div>
      ),
    },
    {
      title: "Stock",
      value: "playground",
      content: (
        <div className="w-full relative h-full rounded-2xl p-3 text-xl md:text-4xl font-bold text-dark bg-gray-200">
          <StockContext />
        </div>
      ),
    },
    {
      title: "Github",
>>>>>>> 453c03fa9883aa3b651e7e8b5b60fff9184af268
      value: "new",
      content: (
        <div className="w-full relative h-full rounded-2xl p-3 text-xl md:text-4xl font-bold text-dark bg-gray-200 overflow-auto">
          <NetworkData />
        </div>
      ),
    }
  ];

  return (
    <div className="h-[100%] [perspective:1000px] relative p-1 flex flex-col w-full overflow-hidden">
      

      {/* Tabs Section */}
      <Tabs tabs={tabs} />
    </div>
  );
}



