"use client";

import TableTitle from "@/components/ui/Table/Title";
import { Input, Pagination, Select } from "@/components/ui/heroui";
import { Section } from "@/components/ui/Section";
import { presetPagination } from "../../../../lib/types/pagination";
import { SelectItem } from "@heroui/react";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/navigation";
import usePagination, { createPaginationStore } from "@/stores/usePagination";
import { useTransaction } from "@/stores/useTransaction";
import SkeletonOrderCard from "@/components/ui/Card/Order/Skeleton";
import OrderCard from "@/components/ui/Card/Order/index";

import { extendedTransactionStatus } from "@/stores/useTransaction";

const OrderPage = () => {
  const router = useRouter();
  const [loadPage, setLoadPage] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<Set<string>>(
    new Set([
      "pending",
      "waiting",
      "dp",
      "paid",
      "sending",
      "returning",
      "settlement",
    ])
  );
  const { loading, list, getAll } = useTransaction();
  const {
    search,
    setSearch,
    page,
    setPage,
    totalData,
    setList,
    filteredList,
    filter,
    setPageSize,
    pageSize,
  } = usePagination();
  const [debouncedSearch] = useDebounce(search, 500);

  useEffect(() => {
    setLoadPage(false);
    getAll();
    setList(list);
  }, []);

  useEffect(() => {
    let filtered = list;

    if (selectedStatus.size > 0) {
      filtered = filtered.filter((item) =>
        selectedStatus.has(item.status?.toLowerCase())
      );
    }

    if (debouncedSearch) {
      filtered = filtered.filter((item) =>
        item.catalog?.name
          ?.toLowerCase()
          .includes(debouncedSearch.toLowerCase())
      );
    }

    setList(filtered);
  }, [debouncedSearch, list, selectedStatus]);

  return (
    <Section className="px-4 py-3 space-y-4">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
        <TableTitle title="Order" description="List of All Orders" />
        <div className="flex flex-row items-center gap-2">
          <Select
            selectionMode="multiple"
            variant="bordered"
            className="w-60"
            aria-label="Sort by Status"
            placeholder="Sort by Status"
            selectedKeys={selectedStatus}
            onSelectionChange={(keys) => {
              setSelectedStatus(keys as Set<string>);
            }}
            disallowEmptySelection
            items={extendedTransactionStatus}
          >
            {(item: any) => (
              <SelectItem key={item.value}>{item.label}</SelectItem>
            )}
          </Select>

          <Input
            type="text"
            placeholder="Search"
            startContent={<FaSearch className="text-primary" />}
            value={search}
            onValueChange={(e) => setSearch(e)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-row justify-between items-center">
          <p className="text-xs">
            Total&nbsp;<span className="font-semibold">{totalData}</span>
            &nbsp;Orders
          </p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {loading || loadPage
            ? Array.from({ length: pageSize }).map((_, idx) => (
                <SkeletonOrderCard key={idx} />
              ))
            : filteredList
                .slice((page - 1) * pageSize, page * pageSize)
                .map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => router.push(`/admin/order/${item.id}`)}
                    className="cursor-pointer"
                  >
                    <OrderCard key={idx} item={item} />
                  </div>
                ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Pagination
          loop
          showControls
          initialPage={1}
          page={page}
          total={Math.ceil(totalData / pageSize)}
          onChange={setPage}
        />
      </div>
    </Section>
  );
};

export default OrderPage;
