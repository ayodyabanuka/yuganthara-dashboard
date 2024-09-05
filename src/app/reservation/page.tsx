'use client';
import useReservation from '@/hooks/useReservation';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { ClipLoader } from 'react-spinners';

const Reservation = () => {
  const { reservations, loading } = useReservation();
  const pendingReservations = reservations.filter((reservation) => reservation.status === 'pending');
  const processingReservations = reservations.filter(
    (reservation) => reservation.status === 'processing'
  );
  const completedReservations = reservations.filter((reservation) => reservation.status === 'completed');

  const [selectedTab, setSelectedTab] = useState('pending');

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center text-slate-400">
        <ClipLoader color="#ffffff" size={20} />
      </div>
    );
  }
  return (
    <>
      <Head>
        <title>Reservations</title>
      </Head>
      <main className="flex h-full w-full flex-col justify-center p-10 pt-24 text-slate-400">
        <div className="flex h-fit w-full justify-between">
          <div className="text-3xl font-bold">Reservation List</div>
        </div>
        <div className="h-full overflow-x-auto pt-5">
          <div className="flex justify-end py-5">
            <div className="flex w-fit gap-4 rounded-xl bg-slate-800 px-10 py-4">
              <button
                onClick={() => setSelectedTab('pending')}
                className={`rounded-lg px-4 py-2 ${selectedTab === 'pending' ? 'bg-slate-900' : 'bg-slate-600 '}`}
              >
                Pending
              </button>
              <button
                onClick={() => setSelectedTab('processing')}
                className={`rounded-lg px-4 py-2 ${selectedTab === 'processing' ? 'bg-slate-900' : 'bg-slate-600 '}`}
              >
                Processing
              </button>
              <button
                onClick={() => setSelectedTab('completed')}
                className={`rounded-lg px-4 py-2 ${selectedTab === 'completed' ? 'bg-slate-900' : 'bg-slate-600 '}`}
              >
                Completed
              </button>
            </div>
          </div>
          <table className="min-w-full rounded-lg bg-slate-800 p-4">
            <thead>
              <tr>
                <th className="border-b border-slate-700 px-4 py-2 ">
                  Name
                </th>
                <th className="border-b border-slate-700 px-4 py-2 ">
                  Email
                </th>
                <th className="border-b border-slate-700 px-4 py-2 ">
                  Seats Count
                </th>
                <th className="border-b border-slate-700 px-4 py-2 ">
                  Date
                </th>
                <th className="border-b border-slate-700 px-4 py-2 ">
                  Status
                </th>
              </tr>
            </thead>
            {selectedTab === 'pending' ? (
              <tbody>
                {pendingReservations.map((reservation) => (
                  <tr key={reservation.id}>

                    <td className="border-b border-slate-700 px-4 py-2 text-center">
                      {reservation.name}
                    </td>
                    <td className="border-b border-slate-700 px-4 py-2 text-center">
                      {reservation.email}
                    </td>
                    <td className="border-b border-slate-700 px-4 py-2  text-center">
                      {reservation.seats.length}
                    </td>
                    <td className="border-b border-slate-700 px-4 py-2  text-center">
                      {new Date(Number(reservation.bookedAt)).toString()}
                    </td>

                    <td className="border-b border-slate-700 px-4 py-2  text-center">
                      <Link href={`/reservation/${reservation.id}`}>{reservation.status}</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : selectedTab === 'processing' ? (
              <tbody>
                {processingReservations.map((reservation) => (
                  <tr key={reservation.id}>

                    <td className="border-b border-slate-700 px-4 py-2 text-center">
                      {reservation.name}
                    </td>
                    <td className="border-b border-slate-700 px-4 py-2 text-center">
                      {reservation.email}
                    </td>
                    <td className="border-b border-slate-700 px-4 py-2  text-center">
                      {reservation.seats.length}
                    </td>
                    <td className="border-b border-slate-700 px-4 py-2  text-center">
                      {reservation.bookedAt.toString()}
                    </td>

                    <td className="border-b border-slate-700 px-4 py-2  text-center">
                      <Link href={`/reservation/${reservation.id}`}>{reservation.status}</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) :
              <tbody>
                {completedReservations.map((reservation) => (
                  <tr key={reservation.id}>

                    <td className="border-b border-slate-700 px-4 py-2 text-center">
                      {reservation.name}
                    </td>
                    <td className="border-b border-slate-700 px-4 py-2 text-center">
                      {reservation.email}
                    </td>
                    <td className="border-b border-slate-700 px-4 py-2  text-center">
                      {reservation.seats.length}
                    </td>
                    <td className="border-b border-slate-700 px-4 py-2  text-center">
                      {reservation.bookedAt.toString()}
                    </td>

                    <td className="border-b border-slate-700 px-4 py-2  text-center">
                      <Link href={`/reservation/${reservation.id}`}>{reservation.status}</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            }
          </table>
        </div>
      </main>
    </>
  );
};

export default Reservation;
