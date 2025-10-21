import { Button } from "@/components/ui/heroui";
import { Section } from "@/components/ui/Section";
import { BiSolidMegaphone } from "react-icons/bi";
import TextEditor from "@/components/ui/TextEditor/TextEditor";
import SkeletonAnnouncement from "@/components/ui/Skeleton/AnnouncementAdmin/SkeletonAnnouncement";
import { useEffect, useState } from "react";

const Umum = () => {
  const {
    models: { announcement: modelAnnouncement, terms: modelTerms },
    setModel,
    update,
    loading,
  } = useSettings();

  const [loadPage, setLoadPage] = useState(true);

  useEffect(() => {
    setLoadPage(false);
  }, []);

  const loadingAnnouncement = loading["announcement"] || false;
  const loadingTerms = loading["terms"] || false;

  return (
    <div className="grid grid-wrap grid-cols-1 md:grid-cols-2 gap-4">
      <Section className="px-4 py-3 flex flex-col gap-2">
        {loading?.announcement || loadPage ? (
          <SkeletonAnnouncement />
        ) : (
          <>
            <div className="flex items-center gap-2 p-2 text-white bg-primary rounded-lg">
              <BiSolidMegaphone />
              <p className="font-medium text-sm">Pengumuman</p>
            </div>
            <div className="flex flex-col gap-2">
              <TextEditor
                value={modelAnnouncement.value ?? ""}
                onValueChange={(e) => {
                  setModel({ value: e }, "announcement");
                }}
              />
              <div className="flex justify-between">
                <Button
                  color={modelAnnouncement?.visible ? "danger" : "primary"}
                  onPress={() => {
                    setModel(
                      { visible: !modelAnnouncement?.visible },
                      "announcement"
                    );
                    update("announcement");
                  }}
                >
                  {modelAnnouncement?.visible ? "Nonaktifkan" : "Aktifkan"}
                </Button>
                <Button
                  color="primary"
                  onPress={() => update("announcement")}
                  isLoading={loadingAnnouncement}
                >
                  Simpan
                </Button>
              </div>
            </div>
          </>
        )}
      </Section>

      <Section className="px-4 py-3 flex flex-col gap-2">
        {loading?.terms || loadPage ? (
          <SkeletonAnnouncement />
        ) : (
          <>
            <div className="flex items-center gap-2 p-2 text-white bg-primary rounded-lg">
              <BiSolidMegaphone />
              <p className="font-medium text-sm">Syarat dan Ketentuan</p>
            </div>
            <div className="flex flex-col gap-2">
              <TextEditor
                value={modelTerms.value ?? ""}
                onValueChange={(e) => {
                  setModel({ value: e }, "terms");
                }}
              />
              <div className="flex justify-between">
                <Button
                  color={modelTerms?.visible ? "danger" : "primary"}
                  onPress={() => {
                    setModel({ visible: !modelTerms?.visible }, "terms");
                    update("terms");
                  }}
                >
                  {modelTerms?.visible ? "Nonaktifkan" : "Aktifkan"}
                </Button>
                <Button
                  color="primary"
                  onPress={() => update("terms")}
                  isLoading={loadingTerms}
                >
                  Simpan
                </Button>
              </div>
            </div>
          </>
        )}
      </Section>
    </div>
  );
};

export default Umum;
