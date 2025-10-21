"use client";
import { Tabs, Tab } from "@heroui/react";
import Schedule from "./_Components/Schedule";
import Stats from "./_Components/Stats";
import Warehouse from "./_Components/Warehouse";

const page = () => {
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
        <Tab key="schedule" title="Schedule">
          <Schedule />
        </Tab>
        <Tab key="stats" title="Statistic">
          <Stats />
        </Tab>
        <Tab key="warehouse" title="Warehouse">
          <Warehouse />
        </Tab>
      </Tabs>
    </div>
  );
};

export default page;
