import { useState } from 'react';
import type { Application } from '@/services/ApplicationManagement/application';
import { getApplications } from '@/services/ApplicationManagement/application';

export default function useApplicationModel() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await getApplications();
      setApplications(res?.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return {
    applications,
    loading,
    fetchApplications,
  };
}
