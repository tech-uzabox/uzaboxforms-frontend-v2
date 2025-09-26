import { useParams } from 'react-router-dom';
import { CreateOrEditWidget } from '@/components/widget-builder/create-or-edit-widget';

export default function EditWidgetPage() {
  const params = useParams();
  const dashboardId = params.dashboardId as string;
  const widgetId = params.widgetId as string;
  return <CreateOrEditWidget dashboardId={dashboardId} widgetId={widgetId} mode="edit" />;
}