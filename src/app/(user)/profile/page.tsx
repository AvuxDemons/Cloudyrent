"use client";

import { Tab, Tabs } from "@heroui/react";
import React from "react";

import HistoryPage from "./_Components/History";
import AccountPage from "./_Components/Account";
import AddressPage from "./_Components/Address";

const ProfilPage = () => {
  return (
    <div className="flex flex-col py-4">
      <Tabs
        classNames={{
          tabList: "rounded-[8px] mb-0 w-full",
          tab: "flex-1 text-center",
          cursor: "rounded-[8px]",
          tabContent:
            "group-data-[selected=true]:text-white text-default-600 font-medium",
          panel: "px-0",
        }}
        color="primary"
        aria-label="Profile Tabs"
      >
        <Tab key="account" title="Account" className="px-0">
          <AccountPage />
        </Tab>
        <Tab key="address" title="Address" className="px-0">
          <AddressPage />
        </Tab>
        <Tab key="history" title="History" className="px-0">
          <HistoryPage />
        </Tab>
      </Tabs>
    </div>
  );
};

export default ProfilPage;
