"use client";

import { fromDate, getLocalTimeZone } from "@internationalized/date";
import { CatalogCalendar } from "@/components/ui/Calendar";
import AddonCard from "@/components/ui/Card/AddOn";
import { Button, Chip, Input, Modal } from "@/components/ui/heroui";
import { Section } from "@/components/ui/Section";
import { useAddOn } from "@/stores/useAddOn";
import { useAddress } from "@/hooks/store/address";
import { useCatalog } from "@/hooks/store/catalog";
import { useTransaction } from "@/stores/useTransaction";
import {
  Accordion,
  AccordionItem,
  cn,
  Divider,
  ModalBody,
  ModalContent,
  ModalHeader,
  Radio,
  RadioGroup,
  ScrollShadow,
  useDisclosure,
} from "@heroui/react";
import SkeletonRentUser from "@/components/ui/Skeleton/RentUser/SkeletonRentUser";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import {
  FaAngleRight,
  FaBox,
  FaCalendar,
  FaCalendarPlus,
  FaCalendarXmark,
  FaMinus,
  FaPlus,
  FaShirt,
  FaTrash,
  FaUser,
} from "react-icons/fa6";
import { IoTicket } from "react-icons/io5";
import {
  MdDiscount,
  MdOutlinePersonalVideo,
  MdOutlinePersonPin,
} from "react-icons/md";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import moment from "moment";
import { useTransactionAddon } from "@/stores/useTransaction_addon";
import { useDiscount } from "@/stores/useDiscount";
import { useDiscountUsage } from "@/stores/useDiscountUsage";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { decreaseAddOnStock } from "@/lib/addonStock";
import { useNotification } from "@/stores/useNotification";

interface Addons {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

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

const Page = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const {
    loading: loadingCatalog,
    getById: getByIdCatalog,
    model: modelCatalog,
  } = useCatalog();
  const {
    loading: loadingAddons,
    list: listAddons,
    setModel: setModelAddons,
    create: createAddons,
  } = useAddOn();
  const {
    loading: loadingAddress,
    list: listAddress,
    model: modelAddress,
    setModel: setModelAddress,
    setUser: setUserAddress,
    getAll: getAllAddress,
  } = useAddress();
  const { model, setModel, create, list, getByCatalog } = useTransaction();
  const [loadPage, setLoadPage] = useState(true);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [addonsSelected, setAddonsSelected] = useState<Addons[]>([]);
  const [voucherCode, setVoucherCode] = useState<string>("");
  const {
    create: createTransactionAddons,
    setModel: setModelTransactionAddons,
  } = useTransactionAddon();
  const { applyVoucher } = useDiscount();
  const { create: createDiscountUsage, setModel: setModelDiscountUsage } =
    useDiscountUsage();
  const { sendNotif } = useNotification();

  useEffect(() => {
    setLoadPage(false);
  }, []);

  useEffect(() => {
    if (model.start_rent) {
      setModel({
        ...model,
        end_rent: moment(model.start_rent)
          .add(2 + Number(model.additional_day || 0), "days")
          .toDate(),
      });
    }
  }, [model.additional_day]);

  useEffect(() => {
    if (session?.user.id) {
      setModel({ user: session?.user.id });
      setUserAddress(session?.user.id as string);
      getAllAddress();
    }
  }, [session?.user.id]);

  useEffect(() => {
    if (listAddress) {
      const defaultAddress = listAddress[0] || {};
      setModel({ address: defaultAddress?.id || "" });
      setModelAddress(defaultAddress);
    }
  }, [listAddress]);

  useEffect(() => {
    if (id) {
      getByIdCatalog(id.toString());
      setModel({ catalog: id.toString() });
      getByCatalog(id.toString());
    }
  }, [id]);

  const getSubtotalCostume = () => Number(modelCatalog?.price) || 0;
  const getSubtotalAdditionalDay = () =>
    (Number(model?.additional_day) || 0) * 50000;
  const getSubtotalAddons = () =>
    addonsSelected.reduce(
      (sum, addon) =>
        sum + (Number(addon.price) || 0) * (Number(addon.quantity) || 1),
      0
    );
  const getSubtotalDiscount = () => Number(model?.discount?.amount) || 0;
  const getTotal = () =>
    getSubtotalCostume() +
    getSubtotalAdditionalDay() +
    getSubtotalAddons() -
    getSubtotalDiscount();

  const handleSubmitRent = async () => {
    if (!model.start_rent || !model.end_rent) {
      toast.error("Tanggal mulai dan tanggal selesai tidak boleh kosong");
      return;
    }
    setModel({
      ...model,
      status: "pending",
      final_price: getTotal(),
      total_price: getTotal(),
    });
    try {
      const accept: any = await new Promise((resolve, reject) => {
        const data = create();
        if (data) {
          resolve(data);
        } else {
          reject(new Error("Failed to create data"));
        }
      });
      if (addonsSelected.length > 0) {
        await decreaseAddOnStock(
          addonsSelected.map((addon) => ({
            id: addon.id,
            quantity: addon.quantity,
          }))
        );
      }
      addonsSelected.forEach((addon) => {
        if (addon.quantity > 0) {
          setModelTransactionAddons({
            transaction: accept.id,
            add_on: addon.id,
            qty: addon.quantity,
            price: addon.price,
          });
          createTransactionAddons();
        }
      });

      sendNotif({
        data: {
          status: "pending",
          payload: accept,
        },
      });

      router.push(`/order/${accept.id}`);
    } catch (error) {
      toast.error("Gagal membuat transaksi");
    }
  };

  return (
    <div className="py-4 flex flex-col gap-4">
      {loadPage || loadingCatalog || loadingAddons || loadingAddress ? (
        <SkeletonRentUser type="rent" />
      ) : (
        <>
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
                <p>Alamat</p>
              </div>
              {!(listAddress && listAddress.length > 0) ? (
                <Button
                  isIconOnly
                  onClick={() => router.push("/profile")}
                  aria-label="Tambah Alamat"
                  variant="flat"
                  color="primary"
                >
                  <FaPlus />
                </Button>
              ) : (
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
                      value={model?.address || ""}
                      onValueChange={(value) => {
                        setModel({ address: value });
                        setModelAddress(
                          listAddress?.find(
                            (modelCatalog?: any) => modelCatalog?.id === value
                          )
                        );
                      }}
                    >
                      {listAddress?.map((modelCatalog?: IAddress) => (
                        <AddressRadio
                          description={
                            <div className="text-[0.6rem] md:text-xs">
                              <p className="font-semibold">
                                {modelCatalog?.full_address}
                              </p>
                              <p className="font-medium">
                                {modelCatalog?.address_details}
                              </p>
                            </div>
                          }
                          value={modelCatalog?.id || ""}
                          key={modelCatalog?.id || ""}
                        >
                          {modelCatalog?.label}
                        </AddressRadio>
                      ))}
                    </RadioGroup>
                  </AccordionItem>
                </Accordion>
              )}
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
                    src={modelCatalog?.images[0] || "/placeholder.jpeg"}
                    alt={modelCatalog?.name || "-"}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <div className="flex flex-col">
                    <p className="text-xs md:text-medium font-medium line-clamp-1">
                      {modelCatalog?.name}
                    </p>
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex flex-row items-center gap-1">
                          <MdOutlinePersonalVideo className="text-[0.65rem] md:text-xs" />
                          <p className=" text-[0.6rem] md:text-xs line-clamp-1 italic leading-tight pr-1">
                            {modelCatalog?.is_bundle &&
                            modelCatalog?.bundle_catalog &&
                            modelCatalog?.bundle_catalog.length > 0
                              ? (() => {
                                  const names = Array.from(
                                    new Set(
                                      modelCatalog?.bundle_catalog.map(
                                        (catalog: any) =>
                                          catalog?.character?.series?.name
                                      )
                                    )
                                  ).filter(Boolean);

                                  if (names.length === 0)
                                    return modelCatalog?.character?.series
                                      ?.name;
                                  if (names.length === 1) return names[0];
                                  if (names.length === 2)
                                    return names.join(" & ");
                                  return `${names.slice(0, -1).join(", ")} & ${
                                    names[names.length - 1]
                                  }`;
                                })()
                              : modelCatalog?.character?.series?.name ?? "-"}
                          </p>
                        </div>
                        <div className="flex flex-row items-center gap-1">
                          <MdOutlinePersonPin className="text-[0.65rem] md:text-xs" />
                          <p className=" text-[0.6rem] md:text-xs line-clamp-1 italic leading-tight pr-1">
                            {modelCatalog?.is_bundle &&
                            modelCatalog?.bundle_catalog &&
                            modelCatalog?.bundle_catalog.length > 0
                              ? (() => {
                                  const names = Array.from(
                                    new Set(
                                      modelCatalog?.bundle_catalog.map(
                                        (catalog: any) =>
                                          catalog?.character?.name
                                      )
                                    )
                                  ).filter(Boolean);

                                  if (names.length === 0)
                                    return modelCatalog?.character?.name;
                                  if (names.length === 1) return names[0];
                                  if (names.length === 2)
                                    return names.join(" & ");
                                  return `${names.slice(0, -1).join(", ")} & ${
                                    names[names.length - 1]
                                  }`;
                                })()
                              : modelCatalog?.character?.name ?? "-"}
                          </p>
                        </div>
                        {!modelCatalog?.is_bundle && (
                          <div className="flex flex-row items-center gap-1">
                            <MdDiscount className="text-[0.65rem] md:text-xs" />
                            <p className=" text-[0.6rem] md:text-xs line-clamp-1 italic leading-tight pr-1">
                              {modelCatalog?.brand?.name ?? "-"}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 capitalize">
                        {modelCatalog?.is_bundle && (
                          <Chip variant="bordered" size="xss" bundle="yes">
                            Bundle
                          </Chip>
                        )}
                        {!modelCatalog?.is_bundle && (
                          <>
                            <div className="flex flex-row">
                              <Chip variant="bordered" size="xss" type="size">
                                {modelCatalog?.size ?? "?"}
                                {modelCatalog?.max_size &&
                                  ` - ${modelCatalog?.max_size}`}
                              </Chip>
                            </div>
                            <Chip
                              variant="bordered"
                              size="xss"
                              gender={
                                (modelCatalog?.gender || "unisex") as
                                  | "male"
                                  | "female"
                                  | "unisex"
                              }
                            >
                              {modelCatalog?.gender}
                            </Chip>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="flex items-center gap-1 font-semibold text-[0.7rem] md:text-sm leading-none text-primary">
                      Rp {modelCatalog?.price.toLocaleString("id-ID")} / 3 hari
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          <div className="flex flex-col md:flex-row gap-4">
            <Section className="px-4 py-3 flex flex-col gap-2 md:w-[40%]">
              <div className="flex items-center gap-2 text-sm md:text-medium font-medium">
                <FaCalendar className="text-primary" />
                <p>Tanggal Pemakaian</p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="mx-auto">
                  <div className="flex flex-col items-center mb-2">
                    <p className="font-semibold text-sm md:text-base text-primary">
                      Ketersediaan Tanggal
                    </p>
                  </div>
                  <CatalogCalendar
                    isDateUnavailable={(date) => {
                      const isUnavailable = list.some((transaction) => {
                        if (
                          transaction?.status === "reject" ||
                          transaction?.status === "cancel"
                        )
                          return false;
                        if (!transaction?.start_rent || !transaction?.end_rent)
                          return false;
                        const start = fromDate(
                          new Date(transaction?.start_rent),
                          "Asia/Jakarta"
                        );
                        const end = fromDate(
                          new Date(transaction?.end_rent),
                          "Asia/Jakarta"
                        );
                        return (
                          date.compare(start) >= 0 && date.compare(end) <= 0
                        );
                      });
                      const today = fromDate(new Date(), "Asia/Jakarta");
                      const isPast = date.compare(today) < 0;
                      return isUnavailable || isPast;
                    }}
                    is_weekday={modelCatalog?.is_weekday}
                    max={5}
                    min={2}
                    date={
                      model?.start_rent && model?.end_rent
                        ? {
                            start: fromDate(
                              new Date(model?.start_rent),
                              "Asia/Jakarta"
                            ),
                            end: fromDate(
                              new Date(model?.end_rent),
                              "Asia/Jakarta"
                            ),
                          }
                        : undefined
                    }
                    onRangeChange={(range) => {
                      if (range && range.start && range.end) {
                        const startDate = range.start.toDate("Asia/Jakarta");
                        const endDate = range.end.toDate("Asia/Jakarta");
                        const diffDays =
                          moment(endDate).diff(moment(startDate), "days") + 1;
                        let additional_day = 0;
                        if (diffDays > 3) {
                          additional_day = diffDays - 3;
                        }
                        setModel({
                          ...model,
                          start_rent: startDate,
                          end_rent: endDate,
                          additional_day: additional_day || 0,
                        });
                      }
                    }}
                  />
                  <div className="mt-2 text-xs text-default-600 text-center">
                    <span className="line-through">1</span> = Tanggal dicoret
                    berarti sudah disewa dan tidak tersedia.
                  </div>
                </div>
                <div className="flex flex-col gap-1 md:gap-2 w-full">
                  <div className="flex flex-row items-center gap-2">
                    <div className="flex flex-row justify-between md:items-end text-xs md:text-sm w-full">
                      <p className="font-semibold text-default-900">Start</p>
                      <p className="font-medium text-default-900">
                        {model?.start_rent
                          ? new Date(model.start_rent).toDateString()
                          : "-"}
                      </p>
                    </div>
                    <FaCalendarAlt className="text-primary text-medium md:text-xl" />
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <div className="flex flex-row justify-between md:items-end text-xs md:text-sm w-full">
                      <p className="font-semibold text-default-900">End</p>
                      <p className="font-medium text-default-900">
                        {model?.end_rent
                          ? new Date(model.end_rent).toDateString()
                          : "-"}
                      </p>
                    </div>
                    <FaCalendarXmark className="text-primary text-medium md:text-xl" />
                  </div>
                  <div className="flex flex-row justify-center items-center gap-2">
                    <div className="flex flex-row justify-between items-center text-xs md:text-sm w-full">
                      <p className="font-semibold text-default-900">Tambahan</p>
                      <div className="flex flex-row w-full max-w-[50%]">
                        <Button
                          isIconOnly
                          isDisabled={(model?.additional_day || 0) <= 0}
                          size="sm"
                          className="rounded-r-none"
                          onPress={() => {
                            const value =
                              Number(model?.additional_day || 0) - 1;
                            if (value < 0) return;
                            setModel({
                              additional_day: value,
                            });
                          }}
                        >
                          <FaMinus />
                        </Button>
                        <Input
                          type="number"
                          size="sm"
                          endContent={"Hari"}
                          className="no-spinners"
                          classNames={{
                            inputWrapper: "rounded-none",
                            input: "text-center",
                          }}
                          value={(model?.additional_day || 0).toString()}
                          min={0}
                          max={2}
                          onValueChange={(value) =>
                            setModel({ additional_day: value })
                          }
                        />
                        <Button
                          isDisabled={(model?.additional_day || 0) >= 2}
                          isIconOnly
                          size="sm"
                          className="rounded-l-none"
                          onPress={() => {
                            const value =
                              Number(model?.additional_day || 0) + 1;
                            if (value > 2) return;
                            setModel({
                              additional_day: value,
                            });
                          }}
                        >
                          <FaPlus />
                        </Button>
                      </div>
                    </div>
                    <FaCalendarPlus className="text-primary text-medium md:text-xl" />
                  </div>
                </div>
              </div>
            </Section>

            <Section className="px-4 py-3 flex flex-col gap-2 md:w-[60%]">
              <div className="flex items-center gap-2 text-sm md:text-medium font-medium">
                <FaBox className="text-primary" />
                <p>Addons</p>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {addonsSelected.length > 0 &&
                  addonsSelected.map((item, idx) => (
                    <div className="flex flex-col md:flex-row gap-2" key={idx}>
                      <div className="w-full md:w-[70%]">
                        <AddonCard
                          key={idx}
                          isPressable={false}
                          item={listAddons?.find(
                            (addon) => addon.id === item.id
                          )}
                          hideStock
                        />
                      </div>
                      <div className="flex flex-col justify-between gap-1 md:gap-0 w-full md:w-[30%]">
                        <div className="flex flex-row w-full">
                          <Button
                            isIconOnly
                            isDisabled={item.quantity <= 0}
                            className="rounded-r-none"
                            onPress={() => {
                              setAddonsSelected((prev) => {
                                // Find index of the item
                                const idx = prev.findIndex(
                                  (addon) => addon.id === item.id
                                );
                                if (idx === -1) return prev;
                                const newQuantity = prev[idx].quantity - 1;
                                if (newQuantity <= 0) {
                                  // Remove the item if quantity is 0 or less
                                  return prev.filter(
                                    (addon) => addon.id !== item.id
                                  );
                                }
                                // Update quantity, keep order
                                const updated = [...prev];
                                updated[idx] = {
                                  ...updated[idx],
                                  quantity: newQuantity,
                                };
                                return updated;
                              });
                            }}
                          >
                            <FaMinus />
                          </Button>
                          <Input
                            type="number"
                            className="no-spinners"
                            classNames={{
                              inputWrapper: "rounded-none",
                              input: "text-center",
                            }}
                            value={item.quantity.toString()}
                            min={0}
                            onValueChange={(value) => {
                              const addon = listAddons?.find(
                                (a) => a.id === item.id
                              );
                              if (!addon) return;

                              const numValue = parseInt(value) || 0;
                              if (numValue > addon.stock) return;

                              setAddonsSelected((prev) => {
                                const idx = prev.findIndex(
                                  (addon) => addon.id === item.id
                                );
                                if (idx === -1) return prev;
                                if (numValue <= 0) {
                                  return prev.filter(
                                    (addon) => addon.id !== item.id
                                  );
                                }
                                const updated = [...prev];
                                updated[idx] = {
                                  ...updated[idx],
                                  quantity: numValue,
                                };
                                return updated;
                              });
                            }}
                          />
                          <Button
                            isIconOnly
                            className="rounded-l-none"
                            isDisabled={
                              (listAddons?.find((a) => a.id === item.id)
                                ?.stock || 0) <= item.quantity
                            }
                            onPress={() => {
                              const addon = listAddons?.find(
                                (a) => a.id === item.id
                              );
                              if (!addon) return;

                              setAddonsSelected((prev) => {
                                const idx = prev.findIndex(
                                  (addon) => addon.id === item.id
                                );
                                if (idx === -1) return prev;
                                const newQuantity = prev[idx].quantity + 1;
                                if (newQuantity > addon.stock) return prev;
                                const updated = [...prev];
                                updated[idx] = {
                                  ...updated[idx],
                                  quantity: newQuantity,
                                };
                                return updated;
                              });
                            }}
                          >
                            <FaPlus />
                          </Button>
                        </div>
                        <Button
                          fullWidth
                          size="sm"
                          color="danger"
                          startContent={<FaTrash />}
                          onPress={() => {
                            setAddonsSelected((prev) =>
                              prev.filter((addon) => addon.id !== item.id)
                            );
                          }}
                        >
                          Hapus
                        </Button>
                      </div>
                    </div>
                  ))}
                <div className="flex justify-between items-center gap-2">
                  <div>
                    <p className="text-sm md:text-medium font-medium">
                      Ada Tambahan?
                    </p>
                  </div>
                  <Button onPress={onOpen}>Tambah</Button>
                </div>
              </div>
              <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                  <ModalHeader>Tambahan</ModalHeader>
                  <ModalBody className="max-h-[80vh] overflow-y-auto">
                    <ScrollShadow className="grid grid-cols-1 gap-2">
                      {listAddons
                        ?.filter(
                          (addon) =>
                            !addonsSelected.some(
                              (selected) => selected.id === addon.id
                            )
                        )
                        .map((item, idx) => (
                          <div className="flex gap-2 mb-4" key={idx}>
                            <div className="w-full">
                              {/* Tampilkan stok hanya di modal pemilihan */}
                              <AddonCard
                                key={idx}
                                isPressable={false}
                                item={item}
                              />
                            </div>
                            <Button
                              isIconOnly
                              className="h-full"
                              onPress={() => {
                                setAddonsSelected((prev) => [
                                  ...prev,
                                  {
                                    id: item.id || "",
                                    name: item.name || "",
                                    price: item.price || 0,
                                    quantity: 1,
                                  },
                                ]);
                                onOpenChange();
                              }}
                            >
                              <FaPlus />
                            </Button>
                          </div>
                        ))}
                    </ScrollShadow>
                  </ModalBody>
                </ModalContent>
              </Modal>
            </Section>
          </div>

          <Section className="px-4 py-3 flex flex-col gap-3 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 text-sm md:text-base font-semibold mb-1">
              <IoTicket className="text-primary text-lg" />
              <span>Voucher</span>
            </div>
            <div className="flex flex-row gap-2 items-center">
              {!model?.discount ? (
                <>
                  <Input
                    placeholder="Masukkan kode voucher"
                    value={voucherCode || ""}
                    onValueChange={(value) => setVoucherCode(value)}
                    size="md"
                  />
                  <Button
                    color="primary"
                    className="font-semibold px-4 py-2 rounded-lg"
                    // jangan dihapus asyncnya
                    onPress={async () => {
                      const voucher: any = await applyVoucher(
                        voucherCode || "",
                        model?.user || "",
                        id?.toString() || ""
                      );

                      if (voucher) {
                        setModel({ discount: voucher });
                      }
                    }}
                  >
                    Terapkan
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-1">
                  <div className="flex flex-row items-center gap-2">
                    <p className="text-primary">
                      Voucher {model?.discount?.code} berhasil diterapkan
                    </p>
                    <Button
                      size="sm"
                      color="danger"
                      onPress={() => setModel({ discount: undefined })}
                    >
                      Batalkan
                    </Button>
                  </div>
                  <p>
                    potongan: {getSubtotalDiscount().toLocaleString("id-ID")}
                  </p>
                </div>
              )}
            </div>
          </Section>

          <Section className="px-4 py-3 flex flex-col gap-2 w-full h-fit">
            <div className="flex items-center gap-2 text-sm md:text-medium font-medium">
              <FaCalendar className="text-primary" />
              <p>Rincian Pembayaran</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col text-default-800">
                {getSubtotalCostume() > 0 && (
                  <div className="flex flex-row justify-between text-sm md:text-medium">
                    <p>Subtotal Kostum</p>
                    <p>Rp {getSubtotalCostume().toLocaleString("id-ID")}</p>
                  </div>
                )}

                {Number(model?.additional_day) > 0 && (
                  <div className="flex flex-row justify-between text-sm md:text-medium">
                    <p>
                      Tambahan Hari ({" "}
                      <span className="text-primary">
                        {model?.additional_day}
                      </span>{" "}
                      x Rp 50.000 )
                    </p>
                    <p>
                      Rp {getSubtotalAdditionalDay().toLocaleString("id-ID")}
                    </p>
                  </div>
                )}

                {addonsSelected.length > 0 && (
                  <div className="flex flex-row justify-between text-sm md:text-medium">
                    <p>Subtotal Tambahan</p>
                    <p>Rp {getSubtotalAddons().toLocaleString("id-ID")}</p>
                  </div>
                )}

                <div className="flex flex-row justify-between text-sm md:text-medium">
                  <p>Subtotal Pengiriman</p>
                  <p>Tunggu Konfirmasi Admin</p>
                </div>

                {getSubtotalDiscount() > 0 && (
                  <div className="flex flex-row justify-between text-sm md:text-medium">
                    <p>Voucher Diskon Digunakan</p>
                    <p>Rp -{getSubtotalDiscount().toLocaleString("id-ID")}</p>
                  </div>
                )}

                <Divider className="my-2 bg-default" />

                {getTotal() > 0 && (
                  <div className="flex justify-between text-medium md:text-lg text-foreground">
                    <p>Total</p>
                    <p className="font-semibold text-primary">
                      Rp {getTotal().toLocaleString("id-ID")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Section>
          <div className="flex justify-end mt-4">
            <Button
              color="primary"
              size="lg"
              className="font-semibold px-8 py-3 rounded-lg"
              onPress={() => {
                handleSubmitRent();
                if (model.discount && model.discount.id) {
                  setModelDiscountUsage({
                    discount: model.discount.id,
                    user: model.user,
                  });
                  createDiscountUsage();
                }
                toast.success("Berhasil membuat pesanan");
              }}
            >
              Buat Pesanan
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
