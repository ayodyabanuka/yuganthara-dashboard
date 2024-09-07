// pages/api/sendOrderEmail.ts
import { Seat } from '@/types/reservations.type';
import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests allowed' });
  }
  const { userEmail, qrcode, name, ref, seats } = req.body;

  // Create a transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail', // e.g., 'gmail'
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  // Email content
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Concert Ticket',
    html: `
    <div style="font-family: Arial, sans-serif; background-color: #FFFFFF; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #FFF8A8; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
    
    <div style="text-align: center; padding: 20px;">
      <h1 style="font-size: 30px; font-weight: bold; color: #2a5d8f;">Confirmation of Your <br/> Yuganthara Ticket Purchase</h1>
    </div>

    <div style="padding: 20px; text-align: center;">
      <div style="background-color: #FFFFFF; padding: 20px;">
      <p style="font-size: 13px; font-weight: bold; margin-bottom: 10px;">Hi ${name},</p>
      <p style="font-size: 11px; margin-bottom: 20px; color: #333333;">
        Your booking has been confirmed. 
        <br/> Thank you for purchase, we hope that you enjoy the event!
      </p>
      </div>

      <p style="font-size: 12px; color: #333333;">
        Following are the completed details of your booking
      </p>
      <p style="font-size: 18px; font-weight: bold; color: #333333; margin-bottom: 20px;">Your eTicket Code: <br/> ${ref}</p>

      <div>
      <div style="background-color: #2a5d8f; color: #ffffff; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
        <h3 style="font-size: 18px; margin-bottom: 10px; color: #ffffff;">Details</h3>
        <p style="color: #ffffff;"><strong>Event on:</strong> Sun, 29 Dec 2024, Time: 2:30pm </p>
        <p>
        <strong>Seats:</strong>
          ${seats
            .map(
              (item: Seat) => `
              <strong> ${item.id} </strong>
          `
            )
            .join('')} </p>
      </div>

      <div style="margin: 20px 0;">
        <img src="${qrcode}" alt="QR Code" style="width: 250px; height: 250px;">
      </div>

      <p>You will need this QR code to enter to the event</p>
      </div>
    </div>

    <div style="background-color: #ffffff; padding: 20px; color: #ffffff; text-align: center; font-size: 12px;">
      <p>
        <a href="www.yuganthara.lk" style="color: #121212; text-decoration: none; margin: 0 5px;">WEBSITE</a>
      </p>
      

      <div>
            <a href="https://www.facebook.com/profile.php?id=61565379149314&mibextid=LQQJ4d" style="margin-right: 10px;"><img src="https://img.icons8.com/ios-glyphs/30/000000/facebook.png" alt="Facebook" style="width: 30px;"></a>
            <a href="https://www.instagram.com/yuganthara_ictbus?igsh=aDFwcW1lYWpoaTFl"><img src="https://img.icons8.com/ios-glyphs/30/000000/instagram-new.png" alt="Instagram" style="width: 30px;"></a>
        </div>
      <p style="color:red">Do not share this email.</p>
    </div>
    
  </div>
</div>

    `,
  };

  // Send email
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error sending email', error });
  }
}
