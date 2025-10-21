"use client";

import Image from "next/image";
import Link from "next/link";
import Theme from "@/components/utils/Theme";
import { Button } from "@/components/ui/heroui";
import { handleGoogleSignIn } from "@/lib/actions/auth";
import { metadataConfig } from "@/app/config";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const loginAssets = [
  {
    src: "https://res.cloudinary.com/dnpa3ylex/image/upload/v1756313412/tsura_suka_soto_ayam_lyo3b2.jpg",
    quote:
      "Cosplay bukan hanya tentang mengenakan kostum, tetapi juga tentang menghidupkan karakter yang kita cintai.",
    author: "Kang Siomay",
    instagram: "tsura_suka_soto_ayam",
  },
  {
    src: "https://res.cloudinary.com/dnpa3ylex/image/upload/v1756313225/no_mercy_just_art_-_plazart.jpg_clorinde_clorindegenshinimpact_clorindecosplay_genshincos_s75xvq.jpg",
    quote:
      "Setiap kostum memiliki cerita, setiap karakter memiliki jiwa. Jadilah bagian dari cerita itu.",
    author: "Kang Pentol",
    instagram: "guumeshii_",
  },
  {
    src: "https://res.cloudinary.com/dnpa3ylex/image/upload/v1756313225/permaisurinya_jinshi_nih_bos_suirei_hmu_pls_ur_so_pretty_jadi_pingin_koleksi_cosplay_maom_ljn9ek.webp",
    quote:
      "Dalam dunia cosplay, kita tidak hanya meniru karakter, kita menjadi karakter itu.",
    author: "Kang Batagor",
    instagram: "karicosu",
  },
  {
    src: "https://res.cloudinary.com/dnpa3ylex/image/upload/v1756313911/Silly-churl_billy-churl_silly-billy_hilichurl._Frilly-churl_willy-churl_frilly-willy_hilic_kw2d8l.webp",
    quote: "Setiap kostum memiliki cerita, setiap karakter memiliki jiwa.",
    author: "Kang Cimol",
    instagram: "teruowo",
  },
  {
    src: "https://res.cloudinary.com/dnpa3ylex/image/upload/v1756314118/Looking_for_my_Cheif_.._-_lensa.wibu_-_chinocosrent_-_yuchan_01_team.makeupbeauty_p0hueg.jpg",
    quote:
      "Setiap kostum memiliki cerita, setiap karakter memiliki jiwa. Jadilah bagian dari cerita itu.",
    author: "Kang Seblak",
    instagram: "janech0ck",
  },
];

const Page = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % loginAssets.length);
    }, 10000); // Change every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const currentAsset = loginAssets[currentIndex];

  // Animation variants for Framer Motion
  const fadeVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const slideVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <>
      <div className="relative h-svh flex flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="absolute right-4 top-4 md:right-8 md:top-8">
          <Theme />
        </div>
        <div className="relative hidden h-full flex-col bg-muted text-white lg:flex">
          <div className="relative h-full">
            <div className="absolute inset-0 bg-gradient-to-bl from-zinc-900/80 via-gray-50/0 to-zinc-900/80 z-[2] h-full"></div>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeVariants}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  fill
                  src={currentAsset.src}
                  alt={currentAsset.instagram}
                  className="absolute inset-0"
                  style={{ objectFit: "cover", transform: "scaleX(-1)" }}
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="absolute flex flex-col justify-between p-10 h-full z-20 ">
            <div className="flex items-center text-lg font-medium">
              <p
                className="font-semibold"
                style={{ textShadow: "0px 2px 2px rgba(0,0,0,0.6)" }}
              >
                {metadataConfig.name}
              </p>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={slideVariants}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <blockquote className="space-y-2">
                  <p
                    className="text-lg"
                    style={{ textShadow: "0px 2px 2px rgba(0,0,0,0.6)" }}
                  >
                    &ldquo;{currentAsset.quote}&rdquo; - {currentAsset.author}
                  </p>
                  <footer className="text-sm">
                    In Frame{" "}
                    <Link
                      target="_blank"
                      className="underline"
                      href={`https://instagram.com/${currentAsset.instagram}`}
                    >
                      @{currentAsset.instagram}
                    </Link>
                  </footer>
                </blockquote>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <div className="p-8">
          <div className="mx-auto flex w-full flex-col justify-center items-center space-y-16 sm:w-[350px]">
            <div className="flex flex-col justify-center items-center space-y-1 text-center">
              <div className="relative mb-8">
                <Image
                  src="/logo.jpeg"
                  alt="Logo"
                  width={200}
                  height={200}
                  className="rounded-3xl"
                />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight capitalize">
                Mulai cari kostum sekarang
              </h1>
              <p className="text-sm text-muted-foreground">
                Masuk untuk menikmati fitur yang lebih lengkap
              </p>
            </div>
            <div className="flex justify-center w-[80%]">
              <Button
                startContent={
                  <Image
                    src="/google.svg"
                    alt="Google"
                    width={20}
                    height={20}
                  />
                }
                fullWidth
                onPress={() => handleGoogleSignIn()}
              >
                Masuk dengan Google
              </Button>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Dengan melanjutkan, anda menyetujui{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Persyaratan
              </Link>{" "}
              dan{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Kebijakan
              </Link>{" "}
              kami.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
