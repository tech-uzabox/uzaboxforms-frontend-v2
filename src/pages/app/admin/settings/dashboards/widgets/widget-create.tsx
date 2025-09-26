import { useParams } from "react-router-dom";
import { CreateOrEditWidget } from "@/components/widget-builder/create-or-edit-widget";

export default function CreateWidgetPage() {
    const params = useParams();
    const dashboardId = params.dashboardId as string;

  return <CreateOrEditWidget dashboardId={dashboardId} mode="create" />
}
