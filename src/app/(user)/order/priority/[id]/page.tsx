"use client";

import { fromDate } from "@internationalized/date";
import { CatalogCalendar } from "@/components/ui/Calendar";
import { Button, Chip, Input } from "@/components/ui/heroui";
import { Section } from "@/components/ui/Section";
import { useAddress } from "@/stores/useAddress";
import { useTransaction } from "@/stores/useTransaction";
import {
  Accordion,
  AccordionItem,
  cn,
  Radio,
  RadioGroup,
} from "@heroui/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCalendarAlt, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import {
  FaAngleRight,
  FaCalendar,
  FaCalendarPlus,
  FaCalendarXmark,
  FaShirt,
} from "react-icons/fa6";
import {
  MdDiscount,
  MdOutlinePersonalVideo,
  MdOutlinePersonPin,
} from "react-icons/md";
import moment from "moment";
import { toast } from "react-toastify";

const AddressRadio = ({
  children,
  description,
  value = "",
  ...props
}: {
  children: React.ReactNode;
  description: React.ReactNode;
  value?: string;
  [key: string]: any;
}) => {
  return (
    <Radio
      {...props}
      value={value}
      classNames={{
        base: cn(
          "inline-flex max-w-full m-0 bg-content1 hover:bg-content2 items-center justify-between",
          "cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent",
          "data-[selected=true]:border-primary"
        ),
        labelWrapper: "w-full",
        label: "font-semibold text-sm md:text-medium",
      }}
    >
      {children}
    </Radio>
  );
};

const PriorityOrderPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [loadPage, setLoadPage] = useState(true);
  
  const {
    loading: loadingTransaction,
    model,
    setModel: setModelTransaction,
    getById: getByIdTransaction,
    create: createTransaction,
  } = useTransaction();

  const {
    loading: loadingAddress,
    list: listAddress,
    model: modelAddress,
    setModel: setModelAddress,
    setUser: setUserAddress,
    getAll: getAllAddress,
  } = useAddress();

  const [selectedAddress, setSelectedAddress] = useState("");
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });

  useEffect(() => {
    setLoadPage(false);
  }, []);

  useEffect(() => {
    if (id) {
      getByIdTransaction(id.toString());
    }
  }, [id]);

  useEffect(() => {
    if (session?.user?.id) {
      setUserAddress(session?.user?.id as string);
      getAllAddress();
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (listAddress && listAddress.length > 0) {
      const defaultAddress = listAddress[0];
      setSelectedAddress(defaultAddress?.id || "");
      setModelAddress(defaultAddress);
    }
  }, [listAddress]);

  // Validasi bahwa transaksi adalah priority
  useEffect(() => {
    if (!loadingTransaction && !loadPage && model.id) {
      if (model.status !== "priority") {
        router.push(`/order/${model.id}`);
        toast.error("Halaman ini hanya untuk order priority!");
        return;
      }
    }
  }, [model, loadingTransaction, loadPage]);

  const handleSubmitPriority = async () => {
    if (!selectedAddress || !dateRange.start || !dateRange.end) {
      toast.error("Alamat dan tanggal harus diisi");
      return;
    }

    try {
      setModelTransaction({
        id: model.id,
        address: selectedAddress,
        start_rent: dateRange.start,
        end_rent: dateRange.end,
        status: "paid",
      });

      await createTransaction();
      toast.success("Berhasil mengisi data priority, status menjadi paid!");
      router.push(`/order/${model.id}`);
    } catch (error) {
      console.error("Error updating priority order:", error);
      toast.error("Gagal mengupdate order priority");
    }
  };

  if (loadingTransaction || loadPage) {
    return (
      <div className="py-4 flex flex-col gap-4">
        <div>Loading...</div>
      </div>
    );
  }

  if (model.status !== "priority") {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="py-4 flex flex-col gap-4">
      <Section className="px-4 py-3 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm md:text-medium font-medium">
            <FaUser className="text-primary" />
            <p>Penyewa / Penerima</p>
          </div>

          <div>
            <div className="flex flex-col text-xs md:text-sm">
              <p className="font-semibold">
                {session?.user?.full_name || "-"}
              </p>
              <p className="font-medium">
                {session?.user?.phone_whatsapp || "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm md:text-medium font-medium">
            <FaMapMarkerAlt className="text-primary" />
            <p>Pilih Alamat</p>
          </div>

          <Accordion>
            <AccordionItem
              classNames={{ trigger: "py-0" }}
              key="address"
              aria-label="Address"
              indicator={<FaAngleRight className="text-primary" />}
              title={
                <p className="font-semibold text-sm md:text-medium">
                  {modelAddress?.label || "-"}
                </p>
              }
              subtitle={
                <div className="text-[0.6rem] md:text-xs">
                  <p className="font-semibold">
                    {modelAddress?.full_address}
                  </p>
                  <p className="font-medium">
                    {modelAddress?.address_details}
                  </p>
                </div>
              }
            >
              <RadioGroup
                isRequired
                value={selectedAddress}
                onValueChange={(value) => {
                  setSelectedAddress(value);
                  setModelAddress(
                    listAddress?.find(
                      (addr: any) => addr?.id === value
                    )
                  );
                }}
              >
                {listAddress?.map((addr: any) => (
                  <AddressRadio
                    description={
                      <div className="text-[0.6rem] md:text-xs">
                        <p className="font-semibold">
                          {addr?.full_address}
                        </p>
                        <p className="font-medium">
                          {addr?.address_details}
                        </p>
                      </div>
                    }
                    value={addr?.id || ""}
                    key={addr?.id || ""}
                  >
                    {addr?.label}
                  </AddressRadio>
                ))}
              </RadioGroup>
            </AccordionItem>
          </Accordion>
        </div>
      </Section>

      <Section className="px-4 py-3 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm md:text-medium font-medium">
          <FaShirt className="text-primary" />
          <p>Costume</p>
        </div>
        <div className="flex flex-col md:flex-row justify-between gap-2">
          <div className="flex flex-row gap-2 md:gap-4">
            <div className="relative w-[100px] md:w-[150px] aspect-square">
              <Image
                src={model.catalog?.images?.[0] || "/placeholder.jpeg"}
                alt={model.catalog?.name || "-"}
                fill
                className="rounded-lg object-cover"
              />
            </div>
            <div className="flex flex-col justify-between">
              <div className="flex flex-col">
                <p className="text-xs md:text-medium font-medium line-clamp-1">
                  {model.catalog?.name}
                </p>
                <div className="flex flex-col gap-1">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex flex-row items-center gap-1">
                      <MdOutlinePersonalVideo className="text-[0.65rem] md:text-xs" />
                      <p className="text-[0.6rem] md:text-xs line-clamp-1 italic leading-tight pr-1">
                        {model.catalog?.is_bundle &&
                        model.catalog?.bundle_catalog &&
                        model.catalog?.bundle_catalog.length > 0
                          ? (() => {
                              const names = Array.from(
                                new Set(
                                  model.catalog?.bundle_catalog.map(
                                    (catalog: any) =>
                                      catalog?.character?.series?.name
                                  )
                                )
                              ).filter(Boolean);

                              if (names.length === 0)
                                return model.catalog?.character?.series
                                  ?.name;
                              if (names.length === 1) return names[0];
                              if (names.length === 2)
                                return names.join(" & ");
                              return `${names.slice(0, -1).join(", ")} & ${
                                names[names.length - 1]
                              }`;
                            })()
                          : model.catalog?.character?.series?.name ?? "-"}
                      </p>
                    </div>
                    <div className="flex flex-row items-center gap-1">
                      <MdOutlinePersonPin className="text-[0.65rem] md:text-xs" />
                      <p className="text-[0.6rem] md:text-xs line-clamp-1 italic leading-tight pr-1">
                        {model.catalog?.is_bundle &&
                        model.catalog?.bundle_catalog &&
                        model.catalog?.bundle_catalog.length > 0
                          ? (() => {
                              const names = Array.from(
                                new Set(
                                  model.catalog?.bundle_catalog.map(
                                    (catalog: any) =>
                                      catalog?.character?.name
                                  )
                                )
                              ).filter(Boolean);

                              if (names.length === 0)
                                return model.catalog?.character?.name;
                              if (names.length === 1) return names[0];
                              if (names.length === 2)
                                return names.join(" & ");
                              return `${names.slice(0, -1).join(", ")} & ${
                                names[names.length - 1]
                              }`;
                            })()
                          : model.catalog?.character?.name ?? "-"}
                      </p>
                    </div>
                    {!model.catalog?.is_bundle && (
                      <div className="flex flex-row items-center gap-1">
                        <MdDiscount className="text-[0.65rem] md:text-xs" />
                        <p className="text-[0.6rem] md:text-xs line-clamp-1 italic leading-tight pr-1">
                          {model.catalog?.brand?.name ?? "-"}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 capitalize">
                    {model.catalog?.is_bundle && (
                      <Chip variant="bordered" size="xss" bundle="yes">
                        Bundle
                      </Chip>
                    )}
                    {!model.catalog?.is_bundle && (
                      <>
                        <div className="flex flex-row">
                          <Chip variant="bordered" size="xss" type="size">
                            {model.catalog?.size ?? "?"}
                            {model.catalog?.max_size &&
                              ` - ${model.catalog?.max_size}`}
                          </Chip>
                        </div>
                        <Chip
                          variant="bordered"
                          size="xss"
                          gender={
                            (model.catalog?.gender || "unisex") as
                              | "male"
                              | "female"
                              | "unisex"
                          }
                        >
                          {model.catalog?.gender}
                        </Chip>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <p className="flex items-center gap-1 font-semibold text-[0.7rem] md:text-sm leading-none text-primary">
                  Rp{" "}
                  {model.catalog?.price != null
                    ? model.catalog?.price.toLocaleString("id-ID")
                    : "0"}{" "}
                  / 3 hari
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section className="px-4 py-3 flex flex-col gap-2 md:w-full">
        <div className="flex items-center gap-2 text-sm md:text-medium font-medium">
          <FaCalendar className="text-primary" />
          <p>Pilih Tanggal Sewa</p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="mx-auto">
            <div className="flex flex-col items-center mb-2">
              <p className="font-semibold text-sm md:text-base text-primary">Ketersediaan Tanggal</p>
            </div>
            <CatalogCalendar
              isDateUnavailable={(date) => {
                const today = fromDate(new Date(), "Asia/Jakarta");
                const isPast = date.compare(today) < 0;
                return isPast;
              }}
              max={5}
              min={2}
              date={
                dateRange.start && dateRange.end
                  ? {
                      start: fromDate(
                        new Date(dateRange.start),
                        "Asia/Jakarta"
                      ),
                      end: fromDate(
                        new Date(dateRange.end),
                        "Asia/Jakarta"
                      ),
                    }
                  : undefined
              }
              onRangeChange={(range) => {
                if (range && range.start && range.end) {
                  const startDate = range.start.toDate("Asia/Jakarta");
                  const endDate = range.end.toDate("Asia/Jakarta");
                  setDateRange({
                    start: startDate,
                    end: endDate,
                  });
                }
              }}
            />
          </div>
          <div className="flex flex-col gap-1 md:gap-2 w-full">
            <div className="flex flex-row items-center gap-2">
              <div className="flex flex-row justify-between md:items-end text-xs md:text-sm w-full">
                <p className="font-semibold text-default-900">Start</p>
                <p className="font-medium text-default-900">
                  {dateRange.start
                    ? new Date(dateRange.start).toDateString()
                    : "-"}
                </p>
              </div>
              <FaCalendarAlt className="text-primary text-medium md:text-xl" />
            </div>
            <div className="flex flex-row items-center gap-2">
              <div className="flex flex-row justify-between md:items-end text-xs md:text-sm w-full">
                <p className="font-semibold text-default-900">End</p>
                <p className="font-medium text-default-900">
                  {dateRange.end
                    ? new Date(dateRange.end).toDateString()
                    : "-"}
                </p>
              </div>
              <FaCalendarXmark className="text-primary text-medium md:text-xl" />
            </div>
          </div>
        </div>
      </Section>

      <div className="flex justify-end mt-4">
        <Button
          color="primary"
          size="lg"
          className="font-semibold px-8 py-3 rounded-lg"
          onPress={handleSubmitPriority}
        >
          Simpan & Bayar
        </Button>
      </div>
    </div>
  );
};

export default PriorityOrderPage; 