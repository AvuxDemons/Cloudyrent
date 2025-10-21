"use client";

import { Button } from "@/components/ui/heroui";
import { useRouter } from "next/navigation";
import { FaAnglesLeft } from "react-icons/fa6";
import Image from "next/image";

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center h-screen text-center">
      <div className="relative w-full h-full">
        <Image
          src="/404-bg.jpg"
          alt="bg"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
        <div className="absolute w-full h-full bg-default-100/85"></div>
      </div>
      <div className="absolute top-[25%] sm:top-[30%]">
        <div className="relative flex flex-col w-full h-full">
          <div className="relative">
            <div className="absolute top-[50%] translate-y-[-62%] sm:translate-y-[-61%] left-[50%] translate-x-[-50%]">
              <div className="relative w-[240px] h-[140px] sm:w-[360px] sm:h-[198px] z-10">
                <Image
                  src="/404.png"
                  alt="404"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
            <p className="text-[8rem] sm:text-[12rem] font-bold tracking-widest">
              404
            </p>
          </div>
          <div className="absolute flex flex-col items-center w-full bottom-[20%] translate-y-[100%]">
            <h1 className="text-xl sm:text-3xl font-bold tracking-wide">
              Oops! Page Not Found
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
              Sorry, Yae Miko got lost and couldn&apos;t find this page.
            </p>
            <div className="pt-4">
              <Button
                variant="shadow"
                color="primary"
                startContent={<FaAnglesLeft className="animate-pulse" />}
                className="px-8 py-2 font-semibold tracking-wide uppercase text-white"
                onPress={() => router.back()}
              >
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
