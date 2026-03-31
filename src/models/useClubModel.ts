import { useState } from 'react';
import type { Club } from '@/services/ClubManagement/club';
import { getClubs } from '@/services/ClubManagement/club';

export default function useClubModel() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchClubs = async () => {
    setLoading(true);
    try {
      const res = await getClubs();
      setClubs(res?.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return {
    clubs,
    loading,
    fetchClubs,
  };
}
