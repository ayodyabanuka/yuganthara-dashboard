import QRCode from 'qrcode';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { db, storage } from './firebase';

/**
 * Generate a QR code from a given text (e.g., booking ID), save it to Firebase Storage,
 * and then update the booking with the QR code URL in Firestore.
 * @param bookingId - The Firestore document ID for the booking to be updated.
 * @returns A promise that resolves to the QR code download URL.
 */
const generateAndSaveQRCode = async (bookingId: string): Promise<string> => {
  try {
    // Generate the QR code as a base64 data URL
    const qrCodeDataURL = await QRCode.toDataURL(bookingId);

    // Convert the base64 string to a Blob
    const base64Response = await fetch(qrCodeDataURL);
    const qrCodeBlob = await base64Response.blob();

    // Create a reference in Firebase Storage for the QR code image
    const storageRef = ref(storage, `qrcodes/${bookingId}.png`);

    // Upload the Blob to Firebase Storage
    await uploadBytes(storageRef, qrCodeBlob);

    // Get the download URL of the uploaded QR code image
    const qrCodeURL = await getDownloadURL(storageRef);

    // Update the booking document in Firestore with the QR code URL
    const bookingRef = doc(db, 'bookings', bookingId); // Adjust the collection name if needed
    await updateDoc(bookingRef, {
      qrCodeURL: qrCodeURL,
    });

    return qrCodeURL; // Return the QR code URL if needed elsewhere
  } catch (error) {
    console.error('Error generating and saving QR code:', error);
    throw new Error('Failed to generate and save QR code');
  }
};

export default generateAndSaveQRCode;
