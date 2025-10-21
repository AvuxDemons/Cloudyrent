import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  User,
} from "@heroui/react";
import { FaHeart, FaInstagram, FaUser } from "react-icons/fa6";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { FaPhoneAlt, FaSignOutAlt } from "react-icons/fa";
import { useSession } from "../providers/SessionProvider";
import { useTheme } from "next-themes";
import { MdWbSunny } from "react-icons/md";
import { BsMoonStarsFill } from "react-icons/bs";
import { IoBagHandle } from "react-icons/io5";
import { metadataConfig } from "@/app/config";
import { useEffect } from "react";
import { Skeleton } from "../ui/heroui";
import { supabaseClient } from "@/lib/supabase/client";
import { useUserProfile } from "../providers/UserProfileProvider";

export const UserDropdown = ({
  fullWidth = false,
}: {
  fullWidth?: boolean;
}) => {
  const { theme, setTheme } = useTheme();
  const { user } = useSession();
  const {
    userProfile,
    loading: profileLoading,
    instagramData,
    loadingInstagram,
    refetch,
  } = useUserProfile();

  useEffect(() => {
    console.log(instagramData);
  }, [user]);

  const changeTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <Dropdown showArrow radius="sm" closeOnSelect={false}>
      <DropdownTrigger className="flex items-center justify-center">
        <div
          className={`flex justify-start items-center cursor-pointer hover:opacity-75 ${
            fullWidth && "w-full"
          }`}
        >
          {fullWidth ? (
            instagramData ? (
              <User
                name={
                  !profileLoading ? (
                    userProfile?.full_name || user?.user_metadata?.name
                  ) : (
                    <Skeleton className="h-4 w-24" />
                  )
                }
                description={
                  !profileLoading ? (
                    instagramData?.username ? (
                      <div className="flex items-center gap-1">
                        <FaInstagram />
                        <p className="text-xs">{instagramData.username}</p>
                      </div>
                    ) : (
                      user?.user_metadata?.email
                    )
                  ) : (
                    <Skeleton className="h-4 w-24" />
                  )
                }
                avatarProps={{
                  src: instagramData
                    ? instagramData.profile_pic_url
                    : user?.user_metadata?.image || "",
                  alt: "user",
                  className: "ml-2 sm:ml-0",
                }}
                classNames={{
                  wrapper: "gap-0",
                  description: "text-xs",
                }}
              />
            ) : (
              <User
                name={
                  !profileLoading ? (
                    userProfile?.full_name || user?.user_metadata?.name
                  ) : (
                    <Skeleton className="h-4 w-24" />
                  )
                }
                description={
                  !profileLoading ? (
                    instagramData?.username ? (
                      <div className="flex items-center gap-1">
                        <FaInstagram />
                        <p className="text-xs">{instagramData.username}</p>
                      </div>
                    ) : (
                      user?.user_metadata?.email
                    )
                  ) : (
                    <Skeleton className="h-4 w-24" />
                  )
                }
                avatarProps={{
                  src: user?.user_metadata?.image || "",
                  alt: "user",
                  className: "ml-2 sm:ml-0",
                }}
                classNames={{
                  wrapper: "gap-0",
                  description: "text-xs",
                }}
              />
            )
          ) : instagramData ? (
            <Avatar src={instagramData?.profile_pic_url} alt="user" />
          ) : (
            <Avatar src={user?.user_metadata?.image} alt="user" />
          )}
        </div>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="User menu"
        className="px-3"
        color="primary"
        variant="flat"
        disabledKeys={["user"]}
      >
        {
          <DropdownSection
            aria-label="User"
            showDivider
            classNames={{ divider: "bg-default-200 h-[1px]" }}
          >
            <DropdownItem
              isReadOnly
              key="user"
              className="h-14 gap-2 opacity-100"
              classNames={{ base: "px-0" }}
            >
              <User
                name={
                  !profileLoading ? (
                    userProfile?.full_name || user?.user_metadata?.name
                  ) : (
                    <Skeleton className="h-4 w-24" />
                  )
                }
                description={
                  !profileLoading ? (
                    instagramData?.username ? (
                      <div className="flex items-center gap-1">
                        <FaInstagram />
                        <p className="text-xs">{instagramData.username}</p>
                      </div>
                    ) : (
                      user?.user_metadata?.email
                    )
                  ) : (
                    <Skeleton className="h-4 w-24" />
                  )
                }
                avatarProps={{
                  src: instagramData
                    ? instagramData.profile_pic_url
                    : user?.user_metadata?.image || "",
                  alt: "user",
                  className: "ml-2 sm:ml-0",
                }}
              />
            </DropdownItem>
            <DropdownItem
              key="profile"
              startContent={<FaUser />}
              href="/profile"
            >
              Profile
            </DropdownItem>
            <DropdownItem
              hidden={!userProfile?.is_admin}
              key="wishlist"
              startContent={<FaHeart />}
              href="/wishlist"
            >
              Wishlist
            </DropdownItem>
            <DropdownItem
              hidden={!userProfile?.is_admin}
              key="pesanan_saya"
              startContent={<IoBagHandle />}
              href="/order"
            >
              Pesanan Saya
            </DropdownItem>
            <DropdownItem
              hidden={userProfile?.is_admin}
              key="admin"
              startContent={<TbLayoutDashboardFilled />}
              href="/admin"
            >
              Admin Panel
            </DropdownItem>
          </DropdownSection>
        }
        <DropdownSection
          aria-label="General"
          showDivider
          classNames={{ divider: "bg-default-200 h-[2px]" }}
        >
          <DropdownItem
            onPress={() => changeTheme()}
            key="theme"
            endContent={
              theme === "light" ? (
                <MdWbSunny className="text-primary" size={18} />
              ) : (
                <BsMoonStarsFill className="text-primary" size={18} />
              )
            }
          >
            Tema
          </DropdownItem>
        </DropdownSection>
        <DropdownSection aria-label="Support">
          <DropdownItem
            hidden={!userProfile?.is_admin}
            key="help_and_feedback"
            startContent={<FaPhoneAlt />}
            href={`https://wa.me/${metadataConfig.contact.whatsapp}`}
          >
            Help & Feedback
          </DropdownItem>
          {user && (
            <DropdownItem
              key="logout"
              startContent={<FaSignOutAlt />}
              onPress={() => {
                const supabase = supabaseClient();
                supabase.auth.signOut();
              }}
            >
              Log Out
            </DropdownItem>
          )}
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
};
