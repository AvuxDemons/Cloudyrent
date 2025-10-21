"use client";

import Image from "next/image";
import { UserCatalogCard } from "@/components/ui/Card/Catalog";
import Other from "@/components/ui/Catalogue/Other";
import SkeletonHome from "@/components/ui/Skeleton/Home/SkeletonHome";
import { SectionTitle } from "@/components/ui/Section";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Alert } from "@heroui/react";
import { useSettings } from "@/stores/useSettings";
import { HiSpeakerphone } from "react-icons/hi";
import { useTransaction } from "@/stores/useTransaction";
import { useCatalog } from "@/hooks/store/catalog";
import { metadataConfig } from "@/app/config";
import { ICatalog } from "../../../lib/types/catalog";

const Page = () => {
  const { data: session } = useSession();
  const {
    models: { announcement },
    getById,
  } = useSettings();

  const [Best, setBestList] = useState<any[]>([]);
  const [Latest, setLatestList] = useState<ICatalog[] | any[]>([]);
  const [ComingSoon, setComingSoonList] = useState<ICatalog[] | any[]>([]);
  const [loadPage, setLoadPage] = useState(true);
  const [isDataReady, setIsDataReady] = useState(false);

  const { loading, list } = useCatalog();
  const { list: transactions, getAll: getAllTransactions } = useTransaction();

  useEffect(() => {
    setLoadPage(false);
    getAllTransactions();
  }, []);

  useEffect(() => {
    if (list.length > 0 && transactions.length > 0 && !loading) {
      setIsDataReady(true);
    }
  }, [list, transactions, loading]);

  useEffect(() => {
    if (list.length === 0) return;

    setLatestList(
      list
        .filter((item) => item.status === "ready")
        .sort((a, b) => {
          const dateA = a.xata?.createdAt
            ? new Date(a.xata?.createdAt).getTime()
            : 0;
          const dateB = b.xata?.createdAt
            ? new Date(b.xata?.createdAt).getTime()
            : 0;
          return dateB - dateA;
        })
        .slice(0, 3)
    );
    setComingSoonList(
      list.filter((item) => item.status === "soon").slice(0, 3)
    );

    if (transactions.length > 0) {
      const catalogTransactionCount = new Map<string, number>();

      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      transactions.forEach((transaction) => {
        if (transaction.catalog?.id) {
          const transactionDate = transaction.xata?.createdAt
            ? new Date(transaction.xata.createdAt)
            : new Date();

          if (transactionDate >= threeMonthsAgo) {
            const currentCount =
              catalogTransactionCount.get(transaction.catalog.id) || 0;
            catalogTransactionCount.set(
              transaction.catalog.id,
              currentCount + 1
            );
          }
        }
      });

      const popularCatalogIds = Array.from(catalogTransactionCount.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([id]) => id);

      const popularItems = popularCatalogIds
        .map((id) => list.find((item) => item.id === id))
        .filter(Boolean);

      if (popularItems.length < 5) {
        const additionalItems = list
          .filter(
            (item) =>
              item.status === "ready" &&
              item.id &&
              !popularCatalogIds.includes(item.id)
          )
          .slice(0, 5 - popularItems.length);
        popularItems.push(...additionalItems);
      }
      setBestList(popularItems);
    } else {
      setBestList(list.filter((item) => item.status === "ready").slice(0, 5));
    }
  }, [list, transactions]);

  useEffect(() => {
    getById("announcement");
  }, []);

  return (
    <div className="flex flex-col gap-6 md:gap-8 py-4">
      {!isDataReady || loadPage ? (
        <SkeletonHome />
      ) : (
        <>
          {announcement.visible && (
            <Alert color="warning" icon={<HiSpeakerphone />} isClosable={true}>
              <div dangerouslySetInnerHTML={{ __html: announcement.value }} />
            </Alert>
          )}
          <div className="relative h-[150px] md:h-[260px] rounded-xl overflow-hidden text-white">
            <div className="absolute right-0 w-full h-full">
              <Image
                src="/welcomer.jpg"
                alt="bg"
                fill
                style={{ objectFit: "cover" }}
                className="object-top"
              />
            </div>
            <div className="absolute right-0 inset-0 pointer-events-none z-[10] h-full w-full bg-gradient-to-t from-black/80 to-transparent md:bg-gradient-to-tr"></div>
            <div className="absolute w-full h-full flex items-end px-4 pt-2 pb-4 md:pl-10 md:pb-8 order-last md:order-first z-[20]">
              <div className="flex flex-col">
                <p className="text-3xl md:text-4xl font-bold line-clamp-1">
                  Hi,{" "}
                  <span className="text-primary">{session?.user?.name}</span>
                </p>
                <p className="flex items-center gap-1.5 text-sm md:text-medium font-semibold">
                  Selamat Datang di{" "}
                  <span className="text-xs font-semibold text-white px-2 py-0.5 bg-primary rounded-full uppercase">
                    {metadataConfig.name}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 md:gap-4">
            <div className="flex items-center justify-between">
              <SectionTitle
                title="katalog Terlaris"
                description="Semua katalog terlaris kami"
              />
              <Other href="/catalog" />
            </div>
            <div className="hidden md:grid grid-cols-5 gap-2 md:gap-4">
              {Best.slice(0, 5).map((item, i) => (
                <UserCatalogCard key={item?.id || i} type="user" item={item} />
              ))}
            </div>
            <div className="grid md:hidden grid-cols-2 gap-2 md:gap-4">
              {Best.slice(0, 4).map((item, i) => (
                <UserCatalogCard key={item?.id || i} type="user" item={item} />
              ))}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            <div className="flex flex-col gap-2 md:gap-4">
              <div className="flex items-center justify-between">
                <SectionTitle
                  title="katalog Terbaru"
                  description="Semua katalog terbaru dari kami"
                />
                <Other href="/catalog" />
              </div>
              <div className="hidden md:grid grid-cols-3 gap-2">
                {Latest.map((item, i) => (
                  <CatalogCard key={i} type="user" item={item} />
                ))}
              </div>
              <div className="grid md:hidden grid-cols-2 gap-2">
                {Latest.slice(0, 2).map((item, i) => (
                  <CatalogCard key={i} type="user" item={item} />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2 md:gap-4">
              <div className="flex items-center justify-between">
                <SectionTitle
                  title="Coming Soon"
                  description="Kostum yang akan datang"
                />
                <Other href="/catalog" />
              </div>
              <div className="hidden md:grid grid-cols-3 gap-2">
                {ComingSoon.map((item, i) => (
                  <UserCatalogCard key={i} type="user" item={item} />
                ))}
              </div>
              <div className="grid md:hidden grid-cols-2 gap-2">
                {ComingSoon.slice(0, 2).map((item, i) => (
                  <UserCatalogCard key={i} type="user" item={item} />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
