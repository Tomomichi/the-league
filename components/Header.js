import Link from 'next/link'
import { useContext, useState } from 'react';

export default function Header(){
  return (
    <header className="flex text-sm border-b" style={{height: 40}}>
      <div className="flex items-center h-full">
        <div className="flex items-center bg-gray-900 px-6 h-full">
          <img style={{height: 20}} src="/images/logo_w.png" alt="THE TOURNAMENT" />
        </div>
        <Link href="#">
          <a className="flex items-center px-4 hover:bg-gray-100 hover:opacity-75">
            <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <path d="M14,7 C14,7.81404368 13.5749107,8.83930284 12.9961487,9.4180649 L11.4180649,10.9961487 C11.2143227,11.1998909 11,11.7148676 11,12 L11,13 L9,13 L9,12 C9,11.1832235 9.42588582,10.1599006 10.0038513,9.5819351 L11.5819351,8.00385134 C11.7857992,7.79998728 12,7.28336316 12,7 C12,5.8954305 11.1045695,5 10,5 C8.8954305,5 8,5.8954305 8,7 L6,7 C6,4.790861 7.790861,3 10,3 C12.209139,3 14,4.790861 14,7 Z M10,20 C15.5228475,20 20,15.5228475 20,10 C20,4.4771525 15.5228475,0 10,0 C4.4771525,0 0,4.4771525 0,10 C0,15.5228475 4.4771525,20 10,20 Z M9,15 L11,15 L11,17 L9,17 L9,15 Z"></path>
            </svg>
            使い方
          </a>
        </Link>
      </div>

      <div className="flex items-center h-full flex-1 justify-end">
        <Link href="#">
          <a className="flex h-full items-center px-4 hover:bg-gray-100 hover:opacity-75">
            <svg className="w-3 h-3" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,3 L20,3 L20,5 L0,5 L0,3 Z M0,9 L20,9 L20,11 L0,11 L0,9 Z M0,15 L20,15 L20,17 L0,17 L0,15 Z"></path>
            </svg>
          </a>
        </Link>
      </div>
    </header>
  );
};
