'use client';
import { useEffect, useState } from 'react';
import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { Reservation } from '@/types/reservations.type';
import { db } from '@/app/utils/firebase';
import Image from 'next/image';
import generateAndSaveQRCode from '@/app/utils/genarateQRCode';

const ReservationDetailsPage: React.FC = () => {
  const params = useParams();
  const reservationId = params?.reservationId;
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [stat, setStat] = useState('');

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const docRef = doc(db, 'bookings', reservationId as string);
        const docSnap = await getDoc(docRef);

        generateAndSaveQRCode(reservationId as string);


        if (docSnap.exists()) {
          setReservation({ id: docSnap.id, ...docSnap.data() } as Reservation);
        } else {
          console.log('No such order!');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (reservationId) {
      fetchReservation();
    }
  }, [reservationId]);

  const handleOrderSubmission = async (ref: string, qr: string) => {
    try {
      const response = await fetch('/api/ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userEmail: reservation?.email, // Replace with the user's email
          qrcode: qr,
          name: reservation?.name,
          ref: ref,
          seats: reservation?.seats
        })
      });
      if (response.ok) {
        console.log('Email sent successfully');
      } else {
        console.error('Failed to send email');
      }

    } catch (error) {
      console.error('Error submitting order:', error);
    }
  };

  const handleChangeStatus = async (
    newStatus: 'pending' | 'processing' | 'completed' | 'canceled'
  ) => {
    if (!reservation) return;

    try {

      const docRef = doc(db, 'bookings', reservation.id);
      if (newStatus === 'canceled') {
        // Delete the reservation if status is 'canceled'
        await deleteDoc(docRef);
        alert("Reservation canceled and deleted.");
        setReservation(null); // Reset the reservation after deletion
      } else {
        // Update the status for other states

        await updateDoc(docRef, { status: newStatus });
        setStat(newStatus);
        setReservation({ ...reservation, status: newStatus });

        if (newStatus === 'completed') {
          await handleOrderSubmission(reservation.id, reservation.qrCodeURL);
        }
      }

    } catch (error) {
      console.error('Error updating reservation status:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!reservation) {
    return <p>Reservation not found.</p>;
  }

  // Extract the file extension from the Firebase storage URL
  const getFileExtension = (url: string) => {
    const fileName = url.split("?")[0]; // Remove query params
    const extension = fileName.split(".").pop(); // Get the extension
    return extension?.toLowerCase();
  };

  const isImage = (url: string) => {
    const ext = getFileExtension(url);
    return ext === "jpeg" || ext === "jpg" || ext === "png";
  };

  const isPDF = (url: string) => {
    const ext = getFileExtension(url);
    return ext === "pdf";
  };

  return (
    <div className="container mx-auto mt-20 gap-10 grid grid-cols-2 px-4 text-slate-400">
      <div className="">
        {reservation.paymentSlip && (
          <div className='my-10'>
            <h3 className="text-xl font-bold my-10">Payment Slip</h3>
            {isImage(reservation.paymentSlip) && (
              <img
                src={reservation.paymentSlip}
                alt="Payment Slip"
                className="w-full max-w-md mx-auto border border-gray-300 rounded"
              />
            )}

            {isPDF(reservation.paymentSlip) && (
              <iframe
                src={reservation.paymentSlip}
                className="w-full h-screen border border-gray-300 rounded"
                title="Payment Slip PDF"
              />
            )}
          </div>
        )}


      </div>
      <div className='mt-10'>
        <div>Current Status : {reservation.status}</div>

        <h2 className="mb-2 text-xl font-bold">Change Reservation Status</h2>
        <div className="flex space-x-4">
          {['pending', 'processing', 'completed', 'canceled'].map(
            (status) => (
              <button
                key={status}
                onClick={() =>
                  handleChangeStatus(
                    status as
                    | 'pending'
                    | 'processing'
                    | 'completed'
                    | 'canceled'
                  )
                }
                className={`rounded px-4 py-2 text-white ${reservation.status === status ? 'bg-slate-600' : 'bg-slate-800 hover:bg-slate-700'}`}
                disabled={reservation.status === status || stat === 'completed'}
              >
                {status}
              </button>
            )
          )}
        </div>
        <div className='mt-10'>
          <div className='my-4'>
            QR Code
          </div>
          <Image src={reservation.qrCodeURL} alt={''} height={200} width={200} />
        </div>
      </div>
    </div>
  );
};

export default ReservationDetailsPage;
