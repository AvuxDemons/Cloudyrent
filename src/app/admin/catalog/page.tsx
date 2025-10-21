"use client";
import { Tabs, Tab } from "@heroui/react";
import CatalogPage from "./_Components/Catalog";
import DiscountPage from "./_Components/Discount";

const Page = () => {
  return (
    <div className="flex flex-col gap-4">
      <Tabs
        classNames={{
          tabList: "rounded-[8px]",
          cursor: "rounded-[8px]",
          tabContent:
            "group-data-[selected=true]:text-white text-default-600 font-medium",
          panel: "px-0",
        }}
        color="primary"
        aria-label="Options"
      >
        <Tab key="single" title="Single">
          <CatalogPage catalogType="single" />
        </Tab>
        <Tab key="bundle" title="Bundle">
          <CatalogPage catalogType="bundle" />
        </Tab>
        <Tab key="Discount" title="Discount">
          {/* <DiscountPage /> */}
        </Tab>
      </Tabs>
    </div>
  );
};

export default Page;
