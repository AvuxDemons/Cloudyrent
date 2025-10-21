"use client";

import React, { useEffect } from "react";
import { useWishlist } from "@/stores/useWishlist";
import { useSession } from "next-auth/react";
import CatalogCard from "@/components/ui/Card/Catalog";
import { FaClover, FaHeart } from "react-icons/fa6";
import { Button, SelectItem } from "@heroui/react";
import usePagination from "@/stores/usePagination";
import { useDebounce } from "use-debounce";
import { presetPagination } from "../../../lib/types/pagination";
import { Input, Pagination, Select } from "@/components/ui/heroui";
import { Section } from "@/components/ui/Section";
import { FaSearch } from "react-icons/fa";

const WishListPage = () => {
  const { loading, list, getByUser } = useWishlist();
  const { data: session } = useSession();
  const {
    search,
    setSearch,
    page,
    setPage,
    totalData,
    setList,
    filter,
    setPageSize,
    pageSize,
    filteredList,
  } = usePagination();
  const [debouncedSearch] = useDebounce(search, 500);

  useEffect(() => {
    if (session?.user.id) {
      getByUser(session.user.id);
    }
  }, [session?.user.id]);

  useEffect(() => {
    let filtered = list;

    if (debouncedSearch) {
      filter((item) =>
        item.catalog.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    } else {
      filtered = filtered.reverse();
      setList(list);
    }
  }, [debouncedSearch, list]);

  return (
    <div className="flex flex-col gap-4 py-4">
      <Section className="flex flex-col gap-4 px-4 py-3">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row justify-between items-center flex-wrap gap-4">
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <FaHeart className="text-primary" /> Wishlist
            </h1>

            <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
              <Input
                type="text"
                placeholder="Search"
                startContent={<FaSearch />}
                value={search}
                onValueChange={(e) => setSearch(e)}
                className="w-full sm:w-48 md:w-64"
              />
              <div className="flex items-center gap-2">
                <span className="text-xs">Showing</span>
                <Select
                  disallowEmptySelection
                  size="xs"
                  variant="bordered"
                  classNames={{ trigger: "bg-default-50" }}
                  className="w-20"
                  selectedKeys={[pageSize.toString()]}
                  onSelectionChange={(keys) => {
                    const size = Number(Array.from(keys)[0]);
                    setPageSize(size);
                  }}
                  items={presetPagination}
                >
                  {(item: any) => (
                    <SelectItem key={item.key}>{item.label}</SelectItem>
                  )}
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 w-h-full gap-4">
            {loading ? (
              <p className="col-span-full flex justify-center items-center">
                Loading...
              </p>
            ) : filteredList.length === 0 ? (
              <div className="col-span-full flex justify-center items-center">
                <p className="text-center">You Don&apos;t Have Any Cosplan</p>
              </div>
            ) : (
              filteredList
                .slice((page - 1) * pageSize, page * pageSize)
                .map((item, idx) => (
                  <CatalogCard key={idx} type="user" item={item.catalog} />
                ))
            )}
          </div>
          <div className="flex items-center justify-end gap-2">
            <Pagination
              loop
              showControls
              initialPage={1}
              page={page}
              total={Math.ceil(totalData / pageSize)}
              onChange={(newPage) => setPage(newPage)}
            />
          </div>
        </div>
      </Section>
    </div>
  );
};

export default WishListPage;
