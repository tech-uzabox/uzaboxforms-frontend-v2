import { useEffect } from 'react';
import { useRouteMeta } from '@/hooks';

export const RouteMetaHandler: React.FC = () => {
  const routeMeta = useRouteMeta();

  useEffect(() => {
    if (routeMeta?.title) {
      document.title = routeMeta.title;
    }

    // Update meta description if provided
    if (routeMeta?.description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', routeMeta.description);
    }
  }, [routeMeta]);

  return null;
};
