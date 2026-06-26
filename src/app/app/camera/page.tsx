import { Camera } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import CameraPractice from "@/components/camera/CameraPractice";
import { requireOnboardedUser } from "@/server/session";

export default async function CameraPage() {
  const user = await requireOnboardedUser();
  return (
    <div>
      <PageHeader
        icon={Camera}
        title="Câmera"
        subtitle="Pratique acordes vendo suas mãos com a forma de referência sobreposta. Tudo roda no seu aparelho."
      />
      <CameraPractice lefty={user.handedness === "LEFT"} />
    </div>
  );
}
