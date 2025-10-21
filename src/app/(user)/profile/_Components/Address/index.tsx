import dynamic from "next/dynamic";
import AddressCard from "@/components/ui/Card/Address";
import SkeletonAddressCard from "@/components/ui/Card/Address/Skeleton";
import { Button, Input, Modal } from "@/components/ui/heroui";
import { Section } from "@/components/ui/Section";
import { useMemo, useEffect, useState } from "react";
import { LuMapPin } from "react-icons/lu";
import {
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { useAddress } from "@/hooks/store/address";
import { useSession } from "next-auth/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addressSchema,
  defaultAddress,
  IAddress,
} from "../../../../../lib/types/address";
import { flattenIdProperties } from "@/lib/utils";

const AddressPage = () => {
  const { data: session } = useSession();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { loading, list, create, remove } = useAddress(session?.user.id);
  const [newAddress, setNewAddress] = useState({
    lat: "",
    lng: "",
    address: "",
  });

  // React Hook Form with Zod validation
  const {
    handleSubmit: handleFormSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    getValues,
    control,
  } = useForm<IAddress>({
    resolver: zodResolver(addressSchema),
    defaultValues: defaultAddress,
  });

  useEffect(() => {
    if (!isOpen) {
      reset(defaultAddress);
    }
  }, [isOpen, reset]);

  useEffect(() => {
    if (newAddress.lat && newAddress.lng && newAddress.address) {
      setValue("latitude", Number(newAddress.lat));
      setValue("longitude", Number(newAddress.lng));
      setValue("full_address", newAddress.address);
    }
  }, [newAddress, setValue]);

  const onSubmit = async (formData: IAddress) => {
    try {
      console.log("Submitting form data:", formData);
      await create(formData);
      reset();
      onOpenChange();
    } catch (error) {
      console.error("Error add Address:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await remove(id);
    } catch (error) {
      console.error("Error delete Address:", error);
    }
  };

  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/ui/Map"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  return (
    <div className="flex flex-col gap-4">
      <Section className="px-4 py-3">
        <div className="flex items-center gap-2 mb-6 text-xl">
          <LuMapPin />
          <h2 className="font-semibold text-xl">Alamat</h2>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {loading ? (
              <SkeletonAddressCard />
            ) : (
              <>
                {!list?.length && (
                  <div className="border-primary space-y-4 border rounded-lg p-4">
                    <p className="text-sm">
                      Tidak ada alamat yang tersimpan, silahkan tambahkan
                    </p>
                  </div>
                )}
                {list?.map((item: IAddress) => (
                  <AddressCard
                    key={item.id}
                    data={item}
                    onUpdate={(data) => {
                      reset(flattenIdProperties(data));
                      onOpen();
                    }}
                    onDelete={handleDelete}
                  />
                ))}
              </>
            )}
          </div>
          <Button
            fullWidth
            color="primary"
            onPress={() => {
              onOpen();
              reset();
            }}
          >
            Add Address
          </Button>
        </div>

        <Modal size="3xl" isOpen={isOpen} onOpenChange={onOpenChange}>
          <form onSubmit={handleFormSubmit(onSubmit)}>
            <ModalContent className="max-h-[80vh]">
              {(onClose) => (
                <>
                  <ModalHeader>Address</ModalHeader>
                  <ModalBody className="overflow-y-auto">
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-2">
                        <Controller
                          name="label"
                          control={control}
                          render={({ field }) => (
                            <Input
                              type="text"
                              label="Label"
                              value={field.value}
                              onChange={field.onChange}
                              errorMessage={errors.label?.message}
                              isInvalid={!!errors.label}
                            />
                          )}
                        />

                        <Controller
                          name="receiver"
                          control={control}
                          render={({ field }) => (
                            <Input
                              type="text"
                              label="Penerima"
                              value={field.value}
                              onChange={field.onChange}
                              errorMessage={errors.receiver?.message}
                              isInvalid={!!errors.receiver}
                            />
                          )}
                        />
                      </div>

                      <Map
                        init={[
                          getValues("latitude") ?? 0,
                          getValues("longitude") ?? 0,
                        ]}
                        onAddressChange={(address) => {
                          setNewAddress(address);
                        }}
                      />

                      <Controller
                        name="full_address"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="text"
                            label="Full Address"
                            value={field.value}
                            onChange={field.onChange}
                            errorMessage={errors.full_address?.message}
                            isInvalid={!!errors.full_address}
                          />
                        )}
                      />

                      <Controller
                        name="address_details"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="text"
                            label="Address Details"
                            value={field.value}
                            onChange={field.onChange}
                            errorMessage={errors.address_details?.message}
                            isInvalid={!!errors.address_details}
                          />
                        )}
                      />
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button onPress={onClose}>Close</Button>
                    <Button
                      type="submit"
                      color="primary"
                      isLoading={isSubmitting}
                    >
                      {getValues().id ? "Update" : "Create"}
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </form>
        </Modal>
      </Section>
    </div>
  );
};

export default AddressPage;
