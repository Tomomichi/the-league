import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react';
import { firebase } from '../lib/firebase.js'

export default function Header(){
  const router = useRouter()

  const createLeague = () => {
    const newRef = firebase.firestore().collection('leagues').doc();
    router.push(`/leagues/${newRef.id}/edit`);
  }

  return (
    <header className="flex justify-between text-sm border-b" style={{height: 40}}>
      <div className="flex items-center h-full">
        <div className="flex items-center bg-gray-900 px-6 h-full">
          { false && <img style={{height: 20}} src="/images/logo_w.png" alt="THE TOURNAMENT" /> }
          <Link href="/"><a className="text-white text-xl font-bold hover:opacity-75">THE LEAGUE</a></Link>
        </div>
        <Link href="#">
          <a className="flex items-center px-4 hover:bg-gray-100 hover:opacity-75">
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"></path>
            </svg>
            使い方
          </a>
        </Link>
      </div>

      <div className="flex">
        <div className="flex cursor-pointer items-center hover:opacity-75 mr-4" onClick={createLeague}>
          <svg className={`mr-1 w-5 h-5 fill-current`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
          </svg>
          新規作成
        </div>

        <Link href="#">
          <a className="flex items-center px-4 hover:opacity-75">
            <svg className={`w-5 h-5 fill-current`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
            </svg>
          </a>
        </Link>
      </div>
    </header>
  );
};
