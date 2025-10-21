"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import {
  costumeGender,
  costumeSize,
  costumeStatus,
} from "@/lib/constant/catalog";
import { useCatalogById, useAllCatalogs } from "@/hooks/react-query/catalog";
import { useAllSeries } from "@/hooks/react-query/series";
import { useAllBrands } from "@/hooks/react-query/brand";
import { useAllCharacters } from "@/hooks/react-query/character";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  catalogSchema,
  ICatalog,
  createDefaultCatalog,
} from "../../../../../../../lib/types/catalog";
import {
  Input,
  Button,
  NumberInput,
  Select,
  Autocomplete,
  Chip,
  Modal,
} from "@/components/ui/heroui";
import { Section } from "@/components/ui/Section";
import { InputLabel } from "@/components/ui/Input";
import {
  AutocompleteItem,
  Checkbox,
  Divider,
  Progress,
  SelectItem,
} from "@heroui/react";
import Image from "next/image";
import { MdDiscount, MdOutlinePersonPin } from "react-icons/md";
import { FaPen, FaPlus, FaTrash } from "react-icons/fa6";
import TextEditor from "@/components/ui/TextEditor";
import { LuImagePlus, LuImageUp } from "react-icons/lu";
import {
  flattenIdProperties,
  validateFileSize,
  validateImageType,
} from "@/lib/utils";
import { toast } from "react-toastify";
import { CatalogCard } from "@/components/ui/Card/Catalog";
import {
  createOrUpdate,
  deleteCatalog,
  getCatalogWithBundleItems,
} from "../../../../../../../lib/actions/catalog";
import { Categories } from "@/lib/constant/series";

interface CatalogFormProps {
  mode: "create" | "edit";
  catalogId?: string;
  catalogType?: "single" | "bundle";
}

const CatalogForm = ({
  mode,
  catalogId,
  catalogType = "single",
}: CatalogFormProps) => {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCatalogIndex, setSelectedCatalogIndex] = useState<
    number | null
  >(null);
  const [bundleCatalogs, setBundleCatalogs] = useState<string[]>([]);

  // Use React Query hooks
  const { data: catalogs = [], isLoading: catalogsLoading } = useAllCatalogs();
  const { data: seriesList = [], isLoading: seriesLoading } = useAllSeries();
  const { data: brandList = [], isLoading: brandLoading } = useAllBrands();
  const { data: characterList = [], isLoading: characterLoading } =
    useAllCharacters();

  const { data: catalogData, isLoading: catalogLoading } = useCatalogById(
    mode === "edit" ? catalogId : undefined
  );

  useEffect(() => {
    console.log(catalogData);
  }, [catalogData]);

  // React Hook Form with Zod validation
  const {
    handleSubmit: handleFormSubmit,
    formState: { errors, isSubmitting },
    control,
    setValue,
    getValues,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(catalogSchema),
    defaultValues: createDefaultCatalog(),
  });

  // Type-safe error access for discriminated union - only show errors after submission attempt
  const getFieldError = (fieldName: string) => {
    if (!isSubmitting) return null;
    const error = (errors as any)[fieldName];
    return error?.message;
  };

  const getArrayFieldError = (fieldName: string, index: number) => {
    if (!isSubmitting) return null;
    const error = (errors as any)[fieldName]?.[index];
    return error?.message;
  };

  const isBundle = watch("catalog_type") === "bundle";
  const bundleCatalogValues = watch("bundle_catalog");

  // Sync bundle catalogs with form state
  useEffect(() => {
    const currentCatalogs = getValues("bundle_catalog") || [];
    setBundleCatalogs(currentCatalogs);
  }, [bundleCatalogValues]);

  // Set catalog type based on prop when creating new catalog
  useEffect(() => {
    if (mode === "create") {
      setValue("catalog_type", catalogType === "bundle" ? "bundle" : "costume");
    }
  }, [mode, catalogType, setValue]);

  // Populate form with catalog data when in edit mode
  useEffect(() => {
    if (mode === "edit" && catalogData && !catalogLoading) {
      // Handle the actual data structure from API which has brand and character objects
      const catalogDataAny = catalogData as any;
      const formData = {
        ...catalogDataAny,
        id: catalogDataAny.id,
        brand_id: catalogDataAny.brand
          ? { id: catalogDataAny.brand.id }
          : { id: "" },
        character_id: catalogDataAny.character
          ? { id: catalogDataAny.character.id }
          : { id: "" },
      };
      console.log("Catalog data:", formData);
      reset(formData);
      setImages(catalogDataAny.images || []);
      setBundleCatalogs(catalogDataAny.bundle_catalog || []);
    }
  }, [catalogData, catalogLoading, mode, reset]);

  const handleImageUpload = async (file: File, id?: string) => {
    if (!validateImageType(file)) return;
    if (!validateFileSize(file, 2)) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("type", "catalog");
      formData.append("id", id || getValues()?.id || "");

      const uploadResponse = await fetch("/api/tools/image", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadData.error || "Image upload failed");
      }

      if (uploadData.success) {
        return uploadData.results[0].url;
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Image upload failed"
      );
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleImageDelete = async (url: string) => {
    try {
      const publicId = url.split("/").pop()?.split(".")[0];
      if (!publicId) return;

      const response = await fetch("/api/tools/image", {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publicId,
          type: "catalog",
          id: getValues()?.id || "",
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete image: ${response.statusText}`);
      } else {
        const newImages = images.filter((img) => img !== url);
        setImages(newImages);
        // Update the form field to pass validation
        setValue("images", newImages);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          console.error("Image deletion timed out");
        } else {
          console.error("Error deleting image:", error.message);
        }
      } else {
        console.error("Unknown error occurred during image deletion");
      }
    }
  };

  // Helper function to filter out blob URLs and keep only actual uploaded URLs
  const filterBlobUrls = (urls: string[]): string[] => {
    return urls.filter((url) => !url.startsWith("blob:"));
  };

  const onSubmit = async (formData: any) => {
    try {
      console.log("Submitting form data:", formData);

      // Filter out blob URLs from the images array before saving
      const filteredImages = filterBlobUrls(formData.images || []);
      const dataToSubmit = {
        ...formData,
        images: filteredImages,
      };

      // First, create/update the catalog in Supabase
      const result = (await createOrUpdate(dataToSubmit)) as any;

      console.log("Catalog created/updated:", result);

      // Upload selected files for both create and edit modes
      if (selectedFiles.length > 0) {
        console.log("Uploading images for catalog...");

        const uploadedImageUrls: string[] = [];

        // Upload each selected file with the catalog ID
        for (const file of selectedFiles) {
          try {
            const imageUrl = await handleImageUpload(file, result.id);
            if (imageUrl) {
              uploadedImageUrls.push(imageUrl);
            }
          } catch (error) {
            console.error("Failed to upload image:", error);
            toast.error("Failed to upload some images");
          }
        }

        // Update the catalog with the uploaded image URLs
        if (uploadedImageUrls.length > 0) {
          const updatedImages = [...filteredImages, ...uploadedImageUrls];
          const updatedCatalog = await createOrUpdate({
            ...dataToSubmit,
            id: result.id,
            images: updatedImages,
          });

          console.log("Catalog updated with images:", updatedCatalog);
        }
      }

      if (mode === "edit") {
        router.push("/admin/catalog");
      } else {
        // For create mode, redirect to edit page with the new ID
        router.push(`/admin/catalog/${result.id}`);
      }
    } catch (error) {
      console.error(
        `Error ${mode === "create" ? "creating" : "updating"} Catalog:`,
        error
      );
      toast.error(
        `Failed to ${mode === "create" ? "create" : "update"} catalog`
      );
    }
  };

  const handleDelete = async () => {
    try {
      // TODO: Implement delete using server actions
      // await remove(getValues()?.id || "");
    } catch (error) {
      console.error("Error delete Catalog:", error);
    }
  };

  if (catalogLoading || (mode === "edit" && catalogLoading)) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleFormSubmit(onSubmit)} className="flex flex-col">
      <Section className="px-4 py-3 flex flex-col gap-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
            <div className="w-full md:w-[30%]">
              <InputLabel label="Name" desc="Catalog Name / Model" />
            </div>
            <div className="w-full md:w-[70%]">
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    variant="bordered"
                    value={field.value}
                    isInvalid={!!errors.name}
                    errorMessage={errors.name?.message}
                    onValueChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
            <div className="w-full md:w-[30%]">
              <InputLabel label="Price" desc="Rent price" />
            </div>
            <div className="w-full md:w-[70%]">
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <NumberInput
                    hideStepper
                    variant="bordered"
                    value={field.value}
                    isInvalid={!!errors.price}
                    errorMessage={errors.price?.message}
                    onValueChange={(value) => field.onChange(Number(value))}
                    startContent={<span className="text-gray-500">Rp</span>}
                    endContent={
                      <span className="text-gray-500 text-xs w-[100px]">
                        / 3 Day
                      </span>
                    }
                  />
                )}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-1 md:gap-2">
            <div className="w-full md:w-[30%]">
              <InputLabel label="Status" desc="Catalog Status / Availability" />
            </div>
            <div className="w-full md:w-[70%] flex flex-col gap-2">
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    selectedKeys={field.value ? [field.value] : []}
                    isInvalid={!!errors.status}
                    errorMessage={errors.status?.message}
                    onChange={(e) => field.onChange(e.target.value)}
                  >
                    {costumeStatus.map((item) => (
                      <SelectItem key={item.key}>{item.label}</SelectItem>
                    ))}
                  </Select>
                )}
              />

              <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
                <InputLabel
                  label="Weekday"
                  desc="Allow rent in weekday / weekend only"
                />
                <div className="px-8">
                  <Controller
                    name="is_weekday"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        isSelected={field.value}
                        onValueChange={field.onChange}
                      >
                        Yes
                      </Checkbox>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {isBundle ? (
            <div className="flex justify-end gap-1 md:gap-2">
              <div className="hidden md:w-[30%]"></div>
              <div className="w-full md:w-[70%] flex flex-col gap-2">
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {bundleCatalogs.map((catalogId: string, index: number) => (
                      <div key={index} className="flex flex-col gap-1">
                        <div className="flex justify-center items-center">
                          <p className="text-primary text-sm font-semibold uppercase">
                            Catalog {index + 1}
                          </p>
                        </div>
                        <Controller
                          name={`bundle_catalog.${index}`}
                          control={control}
                          render={({ field }) => (
                            <div className="flex flex-col gap-2 w-full">
                              {field.value ? (
                                <div className="flex flex-col gap-2">
                                  <CatalogCard
                                    catalog={catalogs.find(
                                      (c: any) => c.id === field.value
                                    )}
                                  />
                                  <Button
                                    fullWidth
                                    startContent={<FaPen />}
                                    onPress={() => {
                                      setSelectedCatalogIndex(index);
                                      onOpenChange();
                                    }}
                                  >
                                    Ubah
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  fullWidth
                                  color="primary"
                                  variant="bordered"
                                  onPress={() => {
                                    setSelectedCatalogIndex(index);
                                    onOpenChange();
                                  }}
                                >
                                  Select Catalog
                                </Button>
                              )}
                              {getArrayFieldError("bundle_catalog", index) && (
                                <p className="text-danger text-sm">
                                  {getArrayFieldError("bundle_catalog", index)}
                                </p>
                              )}
                            </div>
                          )}
                        />
                        {index > 1 && (
                          <Button
                            fullWidth
                            color="primary"
                            startContent={<FaTrash />}
                            onPress={() => {
                              const updatedCatalogs = bundleCatalogs.filter(
                                (_: string, i: number) => i !== index
                              );
                              setValue("bundle_catalog", updatedCatalogs);
                              setBundleCatalogs(updatedCatalogs);
                            }}
                          >
                            Hapus
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      fullWidth
                      color="primary"
                      startContent={<FaPlus />}
                      onPress={() => {
                        const currentCatalogs =
                          getValues("bundle_catalog") || [];
                        // Use a temporary state to force re-render
                        const newCatalogs = [...currentCatalogs, ""];
                        setValue("bundle_catalog", newCatalogs, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                        setBundleCatalogs(newCatalogs);
                      }}
                    >
                      Add Catalog
                    </Button>
                  </div>
                  {getFieldError("bundle_catalog") && (
                    <p className="text-danger text-sm">
                      {getFieldError("bundle_catalog")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
                <div className="w-full md:w-[30%]">
                  <InputLabel
                    label="Brand / Maker"
                    desc="Catalog Brand / Maker"
                  />
                </div>
                <div className="w-full md:w-[70%]">
                  <Controller
                    name="brand_id.id"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        variant="bordered"
                        color="primary"
                        selectedKey={field.value}
                        isInvalid={!!getFieldError("brand")}
                        errorMessage={getFieldError("brand")}
                        onSelectionChange={field.onChange}
                      >
                        {brandList?.map((brand: any) => (
                          <AutocompleteItem key={brand.id}>
                            {brand.name}
                          </AutocompleteItem>
                        ))}
                      </Autocomplete>
                    )}
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-1 md:gap-2">
                <div className="w-full md:w-[30%]">
                  <InputLabel label="Character" desc="Costume Character" />
                </div>
                <div className="w-full md:w-[70%]">
                  <div className="flex flex-col gap-2">
                    <Controller
                      name="character_id.id"
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          variant="bordered"
                          color="primary"
                          selectedKey={field.value}
                          isInvalid={!!getFieldError("character")}
                          errorMessage={getFieldError("character")}
                          onSelectionChange={field.onChange}
                        >
                          {characterList?.map((char: any) => (
                            <AutocompleteItem key={char.id}>
                              {char.name}
                            </AutocompleteItem>
                          ))}
                        </Autocomplete>
                      )}
                    />

                    {getValues("character_id.id") && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <InputLabel label="Series" />
                          <Autocomplete
                            isReadOnly
                            variant="bordered"
                            color="primary"
                            selectedKey={
                              characterList?.find(
                                (char: any) =>
                                  char.id === getValues("character_id.id")
                              )?.series_id || ""
                            }
                          >
                            {seriesList?.map((series: any) => (
                              <AutocompleteItem key={series.id}>
                                {series.name}
                              </AutocompleteItem>
                            ))}
                          </Autocomplete>
                        </div>
                        <div className="flex flex-col gap-1">
                          <InputLabel label="Category" />
                          <Autocomplete
                            isReadOnly
                            variant="bordered"
                            color="primary"
                            selectedKey={
                              (
                                characterList?.find(
                                  (char: any) =>
                                    char.id === getValues("character_id.id")
                                ) as any
                              )?.series?.category || ""
                            }
                          >
                            {Categories?.map((category: any) => (
                              <AutocompleteItem key={category.key}>
                                {category.label}
                              </AutocompleteItem>
                            ))}
                          </Autocomplete>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
                <div className="w-full md:w-[30%]">
                  <InputLabel label="Size" desc="Costume Size" />
                </div>
                <div className="w-full md:w-[70%] flex flex-col">
                  <div className="flex flex-row items-center gap-4">
                    <Controller
                      name="size"
                      control={control}
                      render={({ field }) => (
                        <Select
                          selectedKeys={field.value ? [field.value] : []}
                          isInvalid={!!getFieldError("size")}
                          errorMessage={getFieldError("size")}
                          onChange={(e) => field.onChange(e.target.value)}
                        >
                          {costumeSize?.map((size) => (
                            <SelectItem key={size.key}>{size.label}</SelectItem>
                          ))}
                        </Select>
                      )}
                    />
                    <Divider className="w-[10px] h-[2px] bg-primary" />
                    <Controller
                      name="max_size"
                      control={control}
                      render={({ field }) => (
                        <Select
                          selectedKeys={field.value ? [field.value] : []}
                          onChange={(e) => field.onChange(e.target.value)}
                        >
                          {costumeSize?.map((size) => (
                            <SelectItem key={size.key}>{size.label}</SelectItem>
                          ))}
                        </Select>
                      )}
                    />
                  </div>
                  {getFieldError("size") && (
                    <p className="text-danger text-xs">
                      {getFieldError("size")}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
                <div className="w-full md:w-[30%]">
                  <InputLabel label="Gender" desc="Costume Gender" />
                </div>
                <div className="w-full md:w-[70%]">
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <Select
                        variant="bordered"
                        selectedKeys={field.value ? [field.value] : []}
                        isInvalid={!!getFieldError("gender")}
                        errorMessage={getFieldError("gender")}
                        onChange={(e) => field.onChange(e.target.value)}
                      >
                        {costumeGender?.map((gender) => (
                          <SelectItem key={gender.key}>
                            {gender.label}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-start gap-1 md:gap-2">
                <div className="w-full md:w-[30%]">
                  <InputLabel label="Package" desc="Package Dimention" />
                </div>
                <div className="w-full md:w-[70%]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <InputLabel label="Weight" />
                      <Controller
                        name="weight"
                        control={control}
                        render={({ field }) => (
                          <NumberInput
                            hideStepper
                            variant="bordered"
                            value={field.value}
                            isInvalid={!!errors.weight}
                            errorMessage={errors.weight?.message}
                            endContent={<div className="opacity-50">Kg</div>}
                            onValueChange={(value) => field.onChange(value)}
                          />
                        )}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <InputLabel label="Length" />
                      <Controller
                        name="length"
                        control={control}
                        render={({ field }) => (
                          <NumberInput
                            hideStepper
                            variant="bordered"
                            value={field.value}
                            isInvalid={!!errors.length}
                            errorMessage={errors.length?.message}
                            endContent={<div className="opacity-50">Cm</div>}
                            onValueChange={(value) => field.onChange(value)}
                          />
                        )}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <InputLabel label="Height" />
                      <Controller
                        name="height"
                        control={control}
                        render={({ field }) => (
                          <NumberInput
                            hideStepper
                            variant="bordered"
                            value={field.value}
                            isInvalid={!!errors.height}
                            errorMessage={errors.height?.message}
                            endContent={<div className="opacity-50">Cm</div>}
                            onValueChange={(value) => field.onChange(value)}
                          />
                        )}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <InputLabel label="Width" />
                      <Controller
                        name="width"
                        control={control}
                        render={({ field }) => (
                          <NumberInput
                            hideStepper
                            variant="bordered"
                            value={field.value}
                            isInvalid={!!errors.width}
                            errorMessage={errors.width?.message}
                            endContent={<div className="opacity-50">Cm</div>}
                            onValueChange={(value) => field.onChange(value)}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex flex-col md:flex-row gap-1 md:gap-2">
            <div className="w-full md:w-[30%]">
              <InputLabel label="Description" desc="Description Catalog" />
            </div>
            <div className="w-full md:w-[70%]">
              <div className="flex flex-col gap-1">
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextEditor
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  )}
                />
                {errors.description && (
                  <p className="text-danger text-sm">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-1 md:gap-2">
            <div className="w-full md:w-[30%]">
              <InputLabel
                label="Important Information"
                desc="Important Information of Catalog"
              />
            </div>
            <div className="w-full md:w-[70%]">
              <div className="flex flex-col gap-1">
                <Controller
                  name="important_info"
                  control={control}
                  render={({ field }) => (
                    <TextEditor
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    />
                  )}
                />
                {errors.important_info && (
                  <p className="text-danger text-sm">
                    {errors.important_info.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-1 md:gap-2">
            <div className="w-full md:w-[30%]">
              <InputLabel label="Pictures" desc="Costume Pictures" />
            </div>
            <div className="w-full md:w-[70%]">
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap gap-2">
                  {images?.map((img: string, index: number) => (
                    <div
                      key={index}
                      className="relative aspect-square h-[240px] w-[240px]"
                    >
                      <Image
                        src={img}
                        alt={`Preview ${index}`}
                        fill
                        className="object-cover rounded-md"
                      />
                      <Button
                        isIconOnly
                        size="sm"
                        variant="faded"
                        onPress={() => {
                          handleImageDelete(img);
                        }}
                        className="absolute top-1 right-1"
                      >
                        <FaTrash className="text-primary" />
                      </Button>
                    </div>
                  ))}
                  <div className="relative flex justify-center items-center h-[240px] w-[240px] rounded-lg bg-default-200 hover:bg-primary/10 transition border-dashed border-2 border-primary">
                    <div className="absolute flex flex-col justify-center items-center gap-2 w-full h-full top-0 left-0">
                      {uploading ? (
                        <div className="flex flex-col justify-center items-center gap-2 w-1/2">
                          <LuImageUp className="text-primary" size={43} />
                          <Progress
                            color="primary"
                            radius="sm"
                            size="sm"
                            isIndeterminate
                          />
                        </div>
                      ) : (
                        <LuImagePlus className="text-primary" size={43} />
                      )}
                    </div>
                    <input
                      type="file"
                      name="images"
                      accept="image/*"
                      disabled={uploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (mode === "create") {
                            // For create mode, just add to selectedFiles for preview
                            setSelectedFiles((prev) => [...prev, file]);
                            // Create a preview URL for the image (but don't add to form state)
                            const previewUrl = URL.createObjectURL(file);
                            const newImages = [...images, previewUrl];
                            setImages(newImages);
                            // DO NOT update the form field with blob URLs - only actual uploaded URLs will be added later
                          } else {
                            // For edit mode, upload immediately and update Supabase
                            handleImageUpload(file)
                              .then((imageUrl) => {
                                if (imageUrl) {
                                  const newImages = [...images, imageUrl];
                                  setImages(newImages);
                                  // Update the form field to pass validation
                                  setValue("images", newImages);
                                  // Update Supabase with the new image URLs
                                  const formData = getValues();
                                  createOrUpdate({
                                    ...formData,
                                    images: newImages,
                                  }).catch((error) => {
                                    console.error(
                                      "Failed to update catalog with new image:",
                                      error
                                    );
                                    toast.error(
                                      "Failed to save image to catalog"
                                    );
                                  });
                                }
                              })
                              .catch((error) => {
                                console.error("Failed to upload image:", error);
                              });
                          }
                          e.target.value = "";
                        }
                      }}
                      className={`h-full w-full opacity-0 cursor-pointer ${
                        uploading ? "cursor-not-allowed" : ""
                      }`}
                    />
                  </div>
                </div>
                {errors.images && (
                  <p className="text-danger text-xs">{errors.images.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-3">
          <div>
            <Button color="danger" onPress={handleDelete}>
              Delete
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              onPress={async () => {
                await Promise.allSettled(
                  images.map((img: string) =>
                    handleImageDelete(img).catch((e) =>
                      console.error("Failed to delete image:", e)
                    )
                  )
                );
                if (mode === "edit") {
                  router.push("/admin/catalog");
                } else {
                  setImages([]);
                  reset(createDefaultCatalog());
                }
              }}
            >
              {mode === "edit" ? "Cancel" : "Reset"}
            </Button>
            <Button color="primary" type="submit" isLoading={isSubmitting}>
              Save
            </Button>
          </div>
        </div>
      </Section>

      {/* Catalog Selection Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Select Catalog
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <Input
                    placeholder="Search catalogs..."
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {catalogs
                      .filter((catalog: any) => {
                        // Filter out already selected catalogs (except the current one being edited)
                        const currentCatalogs =
                          getValues("bundle_catalog") || [];
                        const isAlreadySelected = currentCatalogs.includes(
                          catalog.id
                        );
                        const isCurrentEditing =
                          selectedCatalogIndex !== null &&
                          currentCatalogs[selectedCatalogIndex] === catalog.id;

                        // Show catalog if it matches search and either not selected or is the current one being edited
                        const matchesSearch =
                          catalog.name
                            ?.toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                          catalog.character?.name
                            ?.toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                          catalog.brand?.name
                            ?.toLowerCase()
                            .includes(searchQuery.toLowerCase());

                        return (
                          matchesSearch &&
                          (!isAlreadySelected || isCurrentEditing)
                        );
                      })
                      .map((catalog: any) => (
                        <div
                          key={catalog.id}
                          className="flex flex-row items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-default-100 transition-colors"
                          onClick={() => {
                            if (selectedCatalogIndex !== null) {
                              const currentCatalogs =
                                getValues("bundle_catalog") || [];
                              const updatedCatalogs = [...currentCatalogs];
                              updatedCatalogs[selectedCatalogIndex] =
                                catalog.id;
                              setValue("bundle_catalog", updatedCatalogs);
                            }
                            onOpenChange();
                            setSelectedCatalogIndex(null);
                            setSearchQuery("");
                          }}
                        >
                          <div className="relative size-16 md:size-20">
                            <Image
                              src={catalog.images?.[0] || "/fucek.jpg"}
                              alt={catalog.name}
                              fill
                              className="rounded-lg aspect-square object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">
                              {catalog.name}
                            </p>
                            <div className="flex flex-col gap-1 text-xs text-default-600">
                              <p className="flex items-center gap-1">
                                <MdOutlinePersonPin />
                                {catalog.character?.name || "Unknown character"}
                              </p>
                              <p className="flex items-center gap-1">
                                <MdDiscount />
                                {catalog.brand?.name || "Unknown brand"}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              <Chip variant="bordered" size="xss">
                                {catalog.size || "Unknown size"}
                              </Chip>
                              <Chip variant="bordered" size="xss">
                                {catalog.gender || "Unknown"}
                              </Chip>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {catalogs.filter((catalog: any) => {
                    const currentCatalogs = getValues("bundle_catalog") || [];
                    const isAlreadySelected = currentCatalogs.includes(
                      catalog.id
                    );
                    const isCurrentEditing =
                      selectedCatalogIndex !== null &&
                      currentCatalogs[selectedCatalogIndex] === catalog.id;

                    const matchesSearch =
                      catalog.name
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      catalog.character?.name
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      catalog.brand?.name
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase());

                    return (
                      matchesSearch && (!isAlreadySelected || isCurrentEditing)
                    );
                  }).length === 0 && (
                    <div className="text-center py-8 text-default-500">
                      No catalogs found matching your search
                    </div>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </form>
  );
};

export default CatalogForm;
