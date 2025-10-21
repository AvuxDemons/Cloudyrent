"use client";

import { Button, Input, Modal, Skeleton } from "@/components/ui/heroui";
import { InputLabel } from "@/components/ui/Input";
import { Section } from "@/components/ui/Section";
import { fetchInstagram } from "@/lib/fetch";
import { validateFileSize } from "@/lib/utils";
import { useUser } from "@/stores/useUser";
import {
  Avatar,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress,
  useDisclosure,
} from "@heroui/react";
import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { FaEyeSlash, FaInstagram, FaLink, FaTrash } from "react-icons/fa6";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { FaSearch } from "react-icons/fa";
import { LuImagePlus, LuImageUp, LuImageOff } from "react-icons/lu";
import Image from "next/image";
import { toast } from "react-toastify";

const ProfilPage = () => {
  const { data: session } = useSession();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loadPage, setLoadPage] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { loading, model, setModel, create, getById } = useUser();
  const [uploadingIdentity, setUploadingIdentity] = useState(false);
  const [uploadingSelfie, setUploadingSelfie] = useState(false);
  const [uploadingRentProof, setUploadingRentProof] = useState(false);

  const [instagramInput, setInstagramInput] = useState("");
  const [instagramData, setInstagramData] = useState<any>();

  // Fungsi upload satuan (KTP/selfie)
  const uploadSingleImage = async (file: File, type: "ktp" | "selfie") => {
    if (!validateFileSize(file, 2)) return;
    if (type === "ktp") setUploadingIdentity(true);
    if (type === "selfie") setUploadingSelfie(true);
    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("type", "profile");
      formData.append("id", model?.id || "");

      const response = await fetch("/api/tools/image", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Image upload failed");
      }

      if (data.success) {
        if (type === "ktp") {
          setModel({ identity_pict: data.results[0].url });
          toast.success("KTP/ID card uploaded successfully");
        }
        if (type === "selfie") {
          setModel({ selfie_pict: data.results[0].url });
          toast.success("Selfie uploaded successfully");
        }
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Image upload failed"
      );
    } finally {
      if (type === "ktp") setUploadingIdentity(false);
      if (type === "selfie") setUploadingSelfie(false);
    }
  };

  // Fungsi upload multi-file (rent proof)
  const uploadRentProofImages = async (files: File[]) => {
    setUploadingRentProof(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      formData.append("type", "profile");
      formData.append("id", model?.id || "");
      const response = await fetch("/api/tools/image", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Image upload failed");
      }

      if (data.success) {
        setModel({
          rent_proof: [
            ...(model.rent_proof || []),
            ...data.results.map((r: any) => r.url),
          ],
        });
        toast.success(
          `${files.length} rent proof images uploaded successfully`
        );
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Image upload failed"
      );
    } finally {
      setUploadingRentProof(false);
    }
  };

  const fetchInstagramData = useCallback(async (username: string) => {
    const data = await fetchInstagram(username, setInstagramData);
    setInstagramData(data);
  }, []);

  useEffect(() => {
    setLoadPage(false);
  }, []);

  useEffect(() => {
    setModel(session?.user);
    if (model?.instagram) fetchInstagramData(model?.instagram);
  }, [session?.user?.id, model?.id]);

  // Handler file input untuk KTP/selfie
  const handleFileChange = async (file: File, type: "ktp" | "selfie") => {
    await uploadSingleImage(file, type);
  };

  // Handler file input untuk rent proof (multi)
  const handleRentProofChange = async (files: File[]) => {
    await uploadRentProofImages(files);
  };

  const handleSave = async () => {
    try {
      setIsEditing(false);
      create();
      if (session?.user?.id) {
        getById(session.user.id.toString());
      }
    } catch (error) {}
  };

  return (
    <Section className="flex flex-col gap-4 px-4 py-3 md:px-8 md:py-6">
      <div className="flex flex-col items-center py-8">
        <div className="relative w-32 h-32">
          <Image
            src={model?.image || "/placeholder.jpeg"}
            alt={model?.name || "User"}
            className="rounded-full object-cover"
            fill
          />
        </div>
      </div>

      <div className="flex flex-col gap-7 md:gap-8">
        <div className="flex flex-col gap-3 md:gap-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-1 md:gap-2">
            <InputLabel label="Full Name" desc="Your Full Name" />
            <div className="w-full flex md:justify-end">
              {loadPage || !session?.user.id ? (
                <Skeleton className="w-full md:w-1/2 h-5" />
              ) : isEditing ? (
                <Input
                  name="full_name"
                  value={model?.full_name || ""}
                  onValueChange={(value) =>
                    setModel({
                      full_name: value,
                    })
                  }
                />
              ) : (
                <p className="font-medium leading-none">
                  {model?.full_name || "-"}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-1 md:gap-2">
            <InputLabel
              label="No Handphone / Whatsapp"
              desc="Your phone number"
            />
            <div className="w-full flex md:justify-end">
              {loadPage || !session?.user.id ? (
                <Skeleton className="w-full md:w-1/2 h-5" />
              ) : isEditing ? (
                <Input
                  name="whatsapp"
                  value={model?.phone_whatsapp || ""}
                  onValueChange={(value) => {
                    const formatted = value
                      .replace(/^0/, "62")
                      .replace(/\D/g, "");
                    setModel({
                      phone_whatsapp: formatted,
                    });
                  }}
                />
              ) : (
                <p className="font-medium leading-none">
                  {model?.phone_whatsapp || "-"}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-1 md:gap-2">
            <InputLabel
              label="Emergency Contact"
              desc="Your Emergency Contact ( Parent / Brother - Sister / Family / Friends )"
            />
            <div className="w-full flex md:justify-end">
              {loadPage || !session?.user.id ? (
                <Skeleton className="w-full md:w-1/2 h-5" />
              ) : isEditing ? (
                <Input
                  name="whatsapp"
                  value={model?.emergency_contact || ""}
                  onValueChange={(value) => {
                    const formatted = value
                      .replace(/^0/, "62") // Replace leading 0 with 62
                      .replace(/\D/g, ""); // Remove all non-digits
                    setModel({
                      emergency_contact: formatted,
                    });
                  }}
                />
              ) : (
                <p className="font-medium leading-none">
                  {model?.emergency_contact || "-"}
                </p>
              )}
            </div>
          </div>
        </div>

        {(!session?.user.identity_pict ||
          !session?.user.selfie_pict ||
          !session?.user.rent_proof) && (
          <div className="flex flex-col gap-2">
            <InputLabel label="Dokumen" desc="Dokumen Pendukung" />
            <div className="flex flex-col gap-4 p-4 border-1 border-primary rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 md:gap-2">
                  <InputLabel label="KTP / Kartu Pelajar" />
                  <div className="w-full flex justify-center">
                    {session?.user.identity_pict ? (
                      <div className="relative flex justify-center items-center gap-2 h-[240px] w-full rounded-lg bg-default-200 hover:bg-primary/10 transition">
                        <RiVerifiedBadgeFill />
                        <p>Already Uploaded</p>
                      </div>
                    ) : (
                      <div className="relative flex justify-center items-center h-[240px] w-full rounded-lg bg-default-200 hover:bg-primary/10 transition border-dashed border-2 border-primary">
                        {model?.identity_pict ? (
                          <Image
                            src={model?.identity_pict}
                            alt="identity pict"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <>
                            <div className="absolute flex flex-col justify-center items-center gap-2 w-full h-full top-0 left-0 z-10 pointer-events-none">
                              {uploadingIdentity && isEditing ? (
                                <div className="flex flex-col justify-center items-center gap-2 w-1/2">
                                  <LuImageUp
                                    className="text-primary"
                                    size={43}
                                  />
                                  <Progress
                                    color="primary"
                                    radius="sm"
                                    size="sm"
                                    isIndeterminate
                                  />
                                </div>
                              ) : isEditing ? (
                                <LuImageUp className="text-primary" size={43} />
                              ) : (
                                <>
                                  <LuImageOff
                                    className="text-primary"
                                    size={43}
                                  />
                                  <p className="text-center text-primary mt-2">
                                    Dokumen belum diupload
                                  </p>
                                </>
                              )}
                            </div>
                            <input
                              type="file"
                              name="images"
                              accept="image/*"
                              disabled={uploadingIdentity || !isEditing}
                              onChange={(e) =>
                                e.target.files?.[0] &&
                                handleFileChange(e.target.files[0], "ktp")
                              }
                              className={`h-full w-full opacity-0 cursor-pointer ${
                                isEditing
                                  ? "cursor-not-allowed"
                                  : uploadingIdentity
                                  ? "cursor-not-allowed"
                                  : ""
                              }`}
                            />
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1 md:gap-2">
                  <InputLabel label="Selfie Dengan KTP / Kartu Pelajar" />
                  <div className="w-full flex justify-center">
                    {session?.user.selfie_pict ? (
                      <div className="relative flex justify-center items-center gap-2 h-[240px] w-full rounded-lg bg-default-200 hover:bg-primary/10 transition">
                        <RiVerifiedBadgeFill />
                        <p>Already Uploaded</p>
                      </div>
                    ) : (
                      <div className="relative flex justify-center items-center h-[240px] w-full rounded-lg bg-default-200 hover:bg-primary/10 transition border-dashed border-2 border-primary">
                        {model?.selfie_pict ? (
                          <Image
                            src={model?.selfie_pict}
                            alt="identity pict"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <>
                            <div className="absolute flex flex-col justify-center items-center gap-2 w-full h-full top-0 left-0 z-10 pointer-events-none">
                              {uploadingSelfie && isEditing ? (
                                <div className="flex flex-col justify-center items-center gap-2 w-1/2">
                                  <LuImageUp
                                    className="text-primary"
                                    size={43}
                                  />
                                  <Progress
                                    color="primary"
                                    radius="sm"
                                    size="sm"
                                    isIndeterminate
                                  />
                                </div>
                              ) : isEditing ? (
                                <LuImageUp className="text-primary" size={43} />
                              ) : (
                                <>
                                  <LuImageOff
                                    className="text-primary"
                                    size={43}
                                  />
                                  <p className="text-center text-primary mt-2">
                                    Dokumen belum diupload
                                  </p>
                                </>
                              )}
                            </div>
                            <input
                              type="file"
                              name="images"
                              accept="image/*"
                              disabled={uploadingSelfie || !isEditing}
                              onChange={(e) =>
                                e.target.files?.[0] &&
                                handleFileChange(e.target.files[0], "selfie")
                              }
                              className={`h-full w-full opacity-0 cursor-pointer ${
                                isEditing
                                  ? "cursor-not-allowed"
                                  : uploadingSelfie
                                  ? "cursor-not-allowed"
                                  : ""
                              }`}
                            />
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <div className="flex flex-col gap-1 md:gap-2">
                  <InputLabel
                    label="Bukti Pernah Menyewa"
                    desc="Screenshoot Chat Pengembalian Kostum 2x Tempat Sewa Lain"
                    showDesc
                  />
                  <div className="w-full flex justify-center">
                    {model?.rent_proof?.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2 w-full">
                        {model.rent_proof.map((proof, index) => (
                          <div
                            key={index}
                            className="relative h-[240px] w-full rounded-lg overflow-hidden"
                          >
                            <Image
                              src={proof}
                              alt={`Rent proof ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                            {isEditing && (
                              <Button
                                isIconOnly
                                size="sm"
                                variant="faded"
                                onPress={() => {
                                  const updatedProofs = model.rent_proof.filter(
                                    (_, i) => i !== index
                                  );
                                  setModel({ rent_proof: updatedProofs });
                                }}
                                className="absolute top-1 right-1"
                              >
                                <FaTrash className="text-danger" />
                              </Button>
                            )}
                          </div>
                        ))}
                        {isEditing && model.rent_proof.length < 2 && (
                          <div className="relative flex justify-center items-center h-[240px] w-full rounded-lg bg-default-200 hover:bg-primary/10 transition border-dashed border-2 border-primary">
                            <div className="absolute flex flex-col justify-center items-center gap-2 w-full h-full">
                              <LuImagePlus className="text-primary" size={43} />
                              <p className="text-xs text-center">
                                {model.rent_proof.length === 1
                                  ? "Upload 1 gambar lagi"
                                  : "Tambah Gambar"}
                              </p>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              disabled={uploadingRentProof || !isEditing}
                              onChange={(e) => {
                                if (e.target.files) {
                                  handleRentProofChange(
                                    Array.from(e.target.files)
                                  );
                                }
                              }}
                              className={`h-full w-full opacity-0 cursor-pointer ${
                                isEditing
                                  ? "cursor-not-allowed"
                                  : uploadingRentProof
                                  ? "cursor-not-allowed"
                                  : ""
                              }`}
                            />
                          </div>
                        )}
                        {!isEditing && model.rent_proof.length < 2 && (
                          <div className="col-span-2 flex flex-col items-center justify-center py-4">
                            <LuImageOff
                              className="text-primary mb-2"
                              size={43}
                            />
                            <p className="text-center text-primary text-sm">
                              Dokumen bukti sewa kurang{" "}
                              {2 - model.rent_proof.length} lagi
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="relative flex justify-center items-center h-[240px] w-full rounded-lg bg-default-200 hover:bg-primary/10 transition border-dashed border-2 border-primary">
                        {isEditing ? (
                          <>
                            <div className="absolute flex flex-col justify-center items-center gap-2 w-full h-full">
                              <LuImagePlus className="text-primary" size={43} />
                              <p className="text-xs text-center">
                                Upload Bukti Screenshot (2 gambar)
                              </p>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              disabled={uploadingRentProof || !isEditing}
                              onChange={(e) => {
                                if (e.target.files) {
                                  handleRentProofChange(
                                    Array.from(e.target.files)
                                  );
                                }
                              }}
                              className={`h-full w-full opacity-0 cursor-pointer ${
                                isEditing
                                  ? "cursor-not-allowed"
                                  : uploadingRentProof
                                  ? "cursor-not-allowed"
                                  : ""
                              }`}
                            />
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center w-full">
                            <LuImageOff
                              className="text-primary mb-2"
                              size={43}
                            />
                            <p className="text-center text-primary mt-2">
                              Dokumen belum diupload
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <InputLabel label="Social Media" desc="Your Social Media" />
          <div className="flex flex-col gap-4 p-4 border-1 border-primary rounded-lg">
            <div className="flex flex-col md:flex-row justify-between items-center gap-1 md:gap-2">
              <InputLabel label="Instagram" />
              <div className="w-full flex justify-end">
                {!model?.instagram ? (
                  <Button
                    startContent={<FaLink />}
                    onPress={onOpen}
                    className="font-medium"
                  >
                    Connect
                  </Button>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end w-full md:w-auto">
                      <p className="font-medium leading-none">
                        {instagramData?.username || "-"}
                      </p>
                      <div className="flex items-center gap-2">
                        <p>
                          <span className="font-semibold text-primary text-xs">
                            {instagramData?.media_count || 0}
                          </span>
                          &nbsp;
                          <span className="text-[0.6rem]">Post</span>
                        </p>
                        <p>
                          <span className="font-semibold text-primary text-xs">
                            {instagramData?.following_count || 0}
                          </span>
                          &nbsp;
                          <span className="text-[0.6rem]">Following</span>
                        </p>
                        <p>
                          <span className="font-semibold text-primary text-xs">
                            {instagramData?.follower_count || 0}
                          </span>
                          &nbsp;
                          <span className="text-[0.6rem]">Followers</span>
                        </p>
                      </div>
                    </div>
                    <Avatar
                      src={
                        instagramData?.profile_pic_url || "/placeholder.jpeg"
                      }
                      alt="user"
                      className="w-full h-12 md:size-14"
                    />
                  </div>
                )}
                <Modal size="xl" isOpen={isOpen} onOpenChange={onOpenChange}>
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader>Instagram</ModalHeader>
                        <ModalBody>
                          <div className="flex flex-col gap-4">
                            <div className="flex items-end gap-2">
                              <Input
                                isClearable
                                name="ig"
                                label="Username"
                                color="primary"
                                startContent={<FaInstagram />}
                                onValueChange={setInstagramInput}
                                onClear={() => setInstagramInput("")}
                              />

                              <Button
                                color="primary"
                                onPress={() =>
                                  fetchInstagramData(instagramInput)
                                }
                              >
                                <FaSearch />
                              </Button>
                            </div>
                            {instagramInput && instagramData && (
                              <div className="relative border-primary border-1 rounded-lg overflow-hidden">
                                {instagramData?.isPrivate && (
                                  <div className="absolute w-full h-full bg-default-900/90 z-10 flex items-center justify-center gap-2">
                                    <FaEyeSlash
                                      className="text-primary"
                                      size={25}
                                    />
                                    <p className="text-background">Private</p>
                                  </div>
                                )}
                                <div className="flex justify-between items-center px-4 py-3">
                                  <div className="flex items-center gap-4">
                                    <Avatar
                                      src={
                                        instagramData?.profile_pic_url ||
                                        model?.identity_pict ||
                                        "/placeholder.jpeg"
                                      }
                                      alt="user"
                                    />
                                    <div className="flex flex-col w-full md:w-auto">
                                      <p className="font-medium leading-none">
                                        {instagramData?.username || "Username"}
                                      </p>
                                      {instagramData && (
                                        <div className="flex items-center gap-2">
                                          <p>
                                            <span className="font-semibold text-primary text-xs">
                                              {instagramData?.media_count || 0}
                                            </span>
                                            &nbsp;
                                            <span className="text-[0.6rem]">
                                              Post
                                            </span>
                                          </p>
                                          <p>
                                            <span className="font-semibold text-primary text-xs">
                                              {instagramData?.following_count ||
                                                0}
                                            </span>
                                            &nbsp;
                                            <span className="text-[0.6rem]">
                                              Following
                                            </span>
                                          </p>
                                          <p>
                                            <span className="font-semibold text-primary text-xs">
                                              {instagramData?.follower_count ||
                                                0}
                                            </span>
                                            &nbsp;
                                            <span className="text-[0.6rem]">
                                              Followers
                                            </span>
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <Button
                                    type="submit"
                                    color="primary"
                                    onPress={() => {
                                      setModel({
                                        instagram: instagramData.id,
                                      });
                                      // create();
                                      onClose();
                                    }}
                                  >
                                    Bind
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </ModalBody>
                        <ModalFooter>
                          <Button onPress={onClose}>Close</Button>
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-1 md:gap-2">
              <InputLabel label="Tiktok" />
              <div className="w-full flex justify-end">
                {isEditing ? (
                  <Input
                    name="tiktok"
                    value={model?.tiktok || ""}
                    onValueChange={(value) =>
                      setModel({
                        tiktok: value,
                      })
                    }
                  />
                ) : (
                  <p className="font-medium leading-none">
                    {model?.tiktok || "-"}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-1 md:gap-2">
              <InputLabel label="Twitter" />
              <div className="w-full flex justify-end">
                {isEditing ? (
                  <Input
                    name="twitter"
                    value={model?.twitter || ""}
                    onValueChange={(value) =>
                      setModel({
                        twitter: value,
                      })
                    }
                  />
                ) : (
                  <p className="font-medium leading-none">
                    {model?.twitter || "-"}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-1 md:gap-2">
              <InputLabel label="Facebook" />
              <div className="w-full flex justify-end">
                {isEditing ? (
                  <Input
                    name="facebook"
                    value={model?.facebook || ""}
                    onValueChange={(value) =>
                      setModel({
                        facebook: value,
                      })
                    }
                  />
                ) : (
                  <p className="font-medium leading-none">
                    {model?.facebook || "-"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditing ? (
        <div className="flex gap-4 justify-end">
          <Button onClick={() => setIsEditing(false)}>Cancel</Button>
          <Button color="primary" onClick={handleSave}>
            Save
          </Button>
        </div>
      ) : (
        <Button
          color="primary"
          onClick={() => setIsEditing(true)}
          className="w-full"
        >
          Edit Profile
        </Button>
      )}
    </Section>
  );
};

export default ProfilPage;
