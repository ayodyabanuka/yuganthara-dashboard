"use client"
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './utils/firebase';


const Overview = () => {
  const [reservedSeats, setReservedSeats] = useState<number>(0);
  const [soldTickets, setSoldTickets] = useState<number>(0);
  const [totalEarnings, setTotalEarnings] = useState<number>(0);
  const [totalTickets] = useState<number>(500); // Replace with your actual total number of tickets

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingsRef = collection(db, "bookings");
        const reservedQuery = query(bookingsRef, where("status", "==", "pending"));
        const soldQuery = query(bookingsRef, where("status", "==", "completed"));

        const [reservedSnapshot, soldSnapshot] = await Promise.all([
          getDocs(reservedQuery),
          getDocs(soldQuery),
        ]);

        const reservedSeatsCount = reservedSnapshot.docs.reduce(
          (total, doc) => total + doc.data().seats.length,
          0
        );
        const soldTicketsCount = soldSnapshot.docs.reduce(
          (total, doc) => total + doc.data().seats.length,
          0
        );
        const totalEarningsAmount = soldTicketsCount * 1000; // Assuming each ticket is 1000 LKR

        setReservedSeats(reservedSeatsCount);
        setSoldTickets(soldTicketsCount);
        setTotalEarnings(totalEarningsAmount);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 text-slate-400 min-h-screen">
      <div className="text-4xl font-bold text-center mb-8">Yuganthara Dashboard Overview</div>
      <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center">
          <div className="text-2xl font-semibold mb-4">Available Seats</div>
          <div className="text-5xl font-bold text-green-600">{totalTickets - reservedSeats - soldTickets}</div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center">
          <div className="text-2xl font-semibold mb-4">Reserved Seats</div>
          <div className="text-5xl font-bold text-yellow-600">{reservedSeats}</div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center">
          <div className="text-2xl font-semibold mb-4">Sold Tickets</div>
          <div className="text-5xl font-bold text-red-600">{soldTickets}</div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center">
          <div className="text-2xl font-semibold mb-4">Total Earnings from tickets</div>
          <div className="text-5xl font-bold text-blue-600">LKR {totalEarnings}</div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
