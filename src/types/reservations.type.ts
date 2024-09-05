export interface Seat {
  id: string;
  row: string;
  position: string;
  column: number;
  reservedForGuests: boolean;
}

export interface Reservation {
  id: string;
  name: string;
  phone: number;
  seats: Seat[];
  email: string;
  bookedAt: Date;
  paymentSlip: string;
  status: string;
}
