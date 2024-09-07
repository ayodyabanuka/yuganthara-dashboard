"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import { db } from "../utils/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const ScanPage = () => {
       const [scanner, setScanner] = useState<BrowserMultiFormatReader | null>(null);
       const [isScanning, setIsScanning] = useState(false); // Track scanning state
       const videoRef = useRef<HTMLVideoElement>(null);

       useEffect(() => {
              if (!scanner) {
                     const codeReader = new BrowserMultiFormatReader();
                     setScanner(codeReader);
              }

              return () => {
                     if (scanner) {
                            scanner.reset(); // Clean up on component unmount
                     }
              };
       }, [scanner]);

       const startScanning = () => {
              if (!videoRef.current || !scanner) return;

              setIsScanning(true); // Set scanning state to active

              scanner
                     .decodeFromVideoDevice(null, videoRef.current, async (result, error) => {
                            if (result) {
                                   const qrData = result.getText();

                                   // Check the Firestore database for the booking status
                                   const bookingDocRef = doc(db, "bookings", qrData);
                                   const bookingDoc = await getDoc(bookingDocRef);

                                   if (bookingDoc.exists()) {
                                          const bookingData = bookingDoc.data();
                                          console.log(bookingData.visited);


                                          if (bookingData.visited) {
                                                 alert("This booking has already been marked as visited.");
                                          } else {
                                                 // Update the Firestore database to mark it as visited
                                                 try {
                                                        await updateDoc(bookingDocRef, { visited: true });
                                                        alert("Booking status updated to 'visited'.");
                                                 } catch (error) {
                                                        console.error("Error updating document: ", error);
                                                 }
                                          }
                                   } else {
                                          alert("No booking found for this QR code.");
                                   }

                                   stopScanning(); // Stop scanning after successful scan
                            }

                            if (error instanceof NotFoundException) {
                                   console.warn(`QR Code scan error: ${error}`);
                            }
                     })
                     .catch((err) => console.error(`Failed to initialize scanner: ${err}`));
       };

       const stopScanning = () => {
              if (scanner) {
                     scanner.reset(); // Stop the video stream
                     setIsScanning(false); // Set scanning state to inactive
              }
       };

       return (
              <div className="flex flex-col items-center justify-center min-h-screen p-4">
                     <h1 className="text-2xl font-bold mb-4 text-slate-400">QR Code Scanner</h1>

                     <div className="border border-gray-300 rounded-lg">
                            <video ref={videoRef} className="aspect-square" />
                     </div>

                     <button
                            onClick={isScanning ? stopScanning : startScanning}
                            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
                     >
                            {isScanning ? "Stop Scanning" : "Scan"}
                     </button>
              </div>
       );
};

export default ScanPage;
