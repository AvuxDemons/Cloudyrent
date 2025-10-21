import { Section } from "@/components/ui/Section";
import React, { useEffect, useState } from "react";
import { FaHistory } from "react-icons/fa";
import CardHistory from "@/components/ui/Card/History";
import UserOrderCard from "@/components/ui/Card/Order/UserOrderCard";
import { useTransaction } from "@/stores/useTransaction";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SkeletonHistory from "@/components/ui/Card/Order/SkeletonHistory";

const HistoryPage = () => {
  const { list, getByUser, loading } = useTransaction();
  const { data: session } = useSession();
  const router = useRouter();
  const [loadPage, setLoadPage] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      getByUser(session?.user?.id);
    }
  }, [session?.user?.id, getByUser]);

  useEffect(() => {
    setLoadPage(false);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <Section className="px-4 py-3">
        <div className="flex items-center gap-2 mb-6 text-xl">
          <FaHistory />
          <h2 className="font-semibold text-xl">History</h2>
        </div>
        <div className="space-y-4">
          {loading || loadPage
            ? Array.from({ length: 4 }).map((_, idx) => (
                <SkeletonHistory key={idx} />
              ))
            : list
                .filter((order) => order.status === "done")
                .slice()
                .reverse()
                .map((order, idx) => (
                  <div
                    key={idx}
                    onClick={() => router.push(`/order/${order.id}`)}
                    className="cursor-pointer"
                  >
                    <UserOrderCard item={order} />
                  </div>
                ))}
        </div>
      </Section>
    </div>
  );
};

export default HistoryPage;
