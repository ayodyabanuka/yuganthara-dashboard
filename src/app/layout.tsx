'use client';
import { Inter } from 'next/font/google';
import './globals.css';
import Image from 'next/image';
import Link from 'next/link';
import { FaPeopleRoof, FaQrcode, FaTicket } from 'react-icons/fa6';
import { IoMdAnalytics } from 'react-icons/io';
import { IoLogOut } from 'react-icons/io5';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
const inter = Inter({ subsets: ['latin'] });
import Cookies from 'js-cookie';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const path = usePathname();
  const [user, setUser] = useState('');
  const router = useRouter();
  useEffect(() => {
    const email = Cookies.get('token');
    email ? setUser(email) : setUser('');
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    Cookies.remove('token');
    router.push('/login');
  };
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/logo1.png" type="image/x-icon" />
      </head>
      <body className={`${inter.className} min-h-screen w-full bg-gray-900`}>
        <Provider store={store}>
          <main
            className={`${path === '/login' ? 'hidden' : 'block'} flex min-h-screen w-full`}
          >
            <div className="flex w-60 flex-col items-center gap-5 border-r border-gray-700 bg-gray-900 p-4">
              <div className="flex flex-col items-center pb-5 text-white">
                <Image
                  src={'/logo1.png'}
                  alt={'logo'}
                  width={150}
                  height={20}
                  className=""
                />
              </div>
              <div className="w-full px-2 py-2 font-light text-slate-500">
                Main
              </div>
              <div className="flex w-full flex-col gap-4">
                <Link
                  href={'/'}
                  className={`flex  w-full items-center gap-2 rounded-xl p-2 py-3 text-center text-slate-400 hover:bg-slate-800 ${path === '/' ? 'bg-slate-800' : 'text-slate-400'}`}
                >
                  <IoMdAnalytics /> Overview
                </Link>
                <Link
                  href={'/reservation'}
                  className={`flex  w-full items-center gap-2 rounded-xl p-2 py-3 text-center text-slate-400 hover:bg-slate-800 ${path === '/reservation' ? 'bg-slate-800' : 'text-slate-400'}`}
                >
                  <FaTicket /> Reservation
                </Link>
                <Link
                  href={'/qr-scanner'}
                  className={`flex  w-full items-center gap-2 rounded-xl p-2 py-3 text-center text-slate-400 hover:bg-slate-800 ${path === '/qr-scanner' ? 'bg-slate-800' : 'text-slate-400'}`}
                >
                  <FaQrcode /> QR Scanner
                </Link>
              </div>

              <div className="w-full px-2 py-2 font-light text-slate-500">
                Settings
              </div>
              <div className="flex w-full flex-col gap-4">
                <Link
                  href={'/staff'}
                  className={`flex  w-full items-center gap-2 rounded-xl p-2 py-3 text-center text-slate-400 hover:bg-slate-800 ${path === '/staff' ? 'bg-slate-800' : 'text-slate-400'}`}
                >
                  <FaPeopleRoof /> Staff
                </Link>
                <button
                  onClick={handleSubmit}
                  className="mt-10 flex w-full items-center gap-2 rounded-xl p-2 py-3 text-center text-red-400 hover:bg-slate-800"
                >
                  <IoLogOut /> Logout
                </button>
              </div>
              <div className="mt-auto flex w-full flex-col items-center gap-2 rounded-xl bg-slate-800 p-3">
                <div className="text-sm font-medium text-slate-400">{user}</div>
                <div className="text-xs font-light text-slate-500 ">Admin</div>
              </div>
            </div>
            <div className="w-full">{children}</div>
          </main>
          <div className={`${path === '/login' ? 'block' : 'hidden'}`}>
            {children}
          </div>
        </Provider>
      </body>
    </html>
  );
}
