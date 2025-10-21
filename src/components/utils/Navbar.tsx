import { useState } from "react";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  Input,
  Image,
} from "@heroui/react";
import { Button } from "../ui/heroui";
import { UserDropdown } from "./User";
import { useSession } from "../providers/SessionProvider";
import { IoClose } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import Theme from "@/components/utils/Theme";
import EngageSpotNotification from "@/components/ui/Notification";

const Navbar: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { user } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const isHideSearch = () => {
    const listRoutes = ["/catalog"];
    return listRoutes.some((route) => pathname.includes(route));
  };

  const onSearch = (formData: FormData) => {
    const search = formData.get("search");
    if (search) {
      setIsSearchOpen(false);
      router.push(`/catalog?q=${search}`);
    }
  };

  return (
    <form action={onSearch}>
      {isSearchOpen && (
        <div className="fixed top-2 left-3 right-3 z-50 flex items-center gap-2 py-1 rounded-xl">
          <Input
            autoFocus
            isClearable
            placeholder="Cari Costummu...."
            variant="faded"
            radius="sm"
            type="search"
            name="search"
            startContent={<FaSearch size={16} className="text-primary" />}
          />
          <Button
            isIconOnly
            variant="ghost"
            aria-label="Close search"
            startContent={<IoClose size={20} />}
            onPress={() => setIsSearchOpen(false)}
          />
        </div>
      )}

      <HeroUINavbar
        isBordered
        className="border-b-default-300"
        classNames={{ wrapper: "content-wrapper" }}
      >
        {!isSearchOpen && (
          <>
            <NavbarContent justify="start">
              <NavbarBrand>
                <Image
                  src="/logo.jpeg"
                  alt="logo"
                  width={45}
                  height={45}
                  onClick={() => router.push("/")}
                />
              </NavbarBrand>
            </NavbarContent>
            <NavbarContent
              as="div"
              className="items-center gap-1 md:gap-2"
              justify="end"
            >
              {!isHideSearch() && (
                <>
                  <div className="hidden sm:block">
                    <Input
                      placeholder="Cari Kostum..."
                      startContent={
                        <FaSearch size={16} className="text-primary" />
                      }
                      type="search"
                      variant="flat"
                      radius="sm"
                      name="search"
                    />
                  </div>
                  <div className="sm:hidden">
                    <Button
                      variant="light"
                      isIconOnly
                      startContent={
                        <FaSearch size={16} className="text-primary" />
                      }
                      onPress={() => setIsSearchOpen(true)}
                      aria-label="Search Button Mobile"
                    />
                  </div>
                </>
              )}
              {user ? (
                <>
                  <EngageSpotNotification />
                  <UserDropdown />
                </>
              ) : (
                <>
                  <Theme />
                  <Button
                    color="primary"
                    aria-label="Login"
                    onPress={() => router.push("/auth/login")}
                  >
                    Login
                  </Button>
                </>
              )}
            </NavbarContent>
          </>
        )}
      </HeroUINavbar>
    </form>
  );
};

export default Navbar;
