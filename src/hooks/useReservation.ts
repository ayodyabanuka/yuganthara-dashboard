import { db } from '@/app/utils/firebase';
import { Reservation } from '@/types/reservations.type';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const useReservation = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, 'bookings'));
    const ReservationData: Reservation[] = [];
    querySnapshot.forEach((doc) => {
      ReservationData.push({ id: doc.id, ...doc.data() } as Reservation);
    });
    setReservations(ReservationData);
    setLoading(false);
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return { reservations, loading };
};

export default useReservation;
