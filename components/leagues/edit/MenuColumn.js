import Link from 'next/link'
import { useContext, useState } from 'react';
import { LeagueContext, MatchContext, MenuContext } from '../../../pages/_app.js';

export default function MenuColumn(){
  const [match, setMatch] = useContext(MatchContext);
  const [league, setLeague] = useContext(LeagueContext);
  const [menu, setMenu] = useContext(MenuContext);

  const menuActive = (target) => {
    return target == menu["target"] && menu["opened"];
  }

  return (
    <div className="flex flex-row sm:flex-col">
      <div className={`cursor-pointer sm:hover:bg-gray-900 flex items-center p-4`} onClick={()=>setMenu({target: menu['target'], opened: !menu['opened']})}>
        <svg className={`w-6 h-6 fill-current mx-auto transform duration-100 ${menu['opened'] ? '' : '-rotate-90'}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
        </svg>
      </div>
      <div className={`cursor-pointer flex-1 hover:bg-gray-900 flex flex-col justify-center py-2 sm:p-4 relative ${menuActive('settings') ? 'bg-gray-900 active' : ''}`} onClick={()=>setMenu({target: 'settings', opened: true})}>
        <svg className="w-6 h-6 fill-current mx-auto sm:mb-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"></path>
        </svg>
        基本情報
      </div>
      <div className={`cursor-pointer flex-1 hover:bg-gray-900 flex flex-col justify-center py-2 sm:p-4 relative ${menuActive('players') ? 'bg-gray-900 active' : ''}`} onClick={()=>setMenu({target: 'players', opened: true})}>
        <svg className="w-6 h-6 fill-current mx-auto sm:mb-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"></path>
        </svg>
        参加者
      </div>
      <div className={`cursor-pointer flex-1 hover:bg-gray-900 flex flex-col justify-center py-2 sm:p-4 relative ${menuActive('matches') ? 'bg-gray-900 active' : ''}`} onClick={()=>setMenu({target: 'matches', opened: true})}>
        <svg className="w-6 h-6 fill-current mx-auto sm:mb-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 5v14H5V5h14m1.1-2H3.9c-.5 0-.9.4-.9.9v16.2c0 .4.4.9.9.9h16.2c.4 0 .9-.5.9-.9V3.9c0-.5-.5-.9-.9-.9zM11 7h6v2h-6V7zm0 4h6v2h-6v-2zm0 4h6v2h-6zM7 7h2v2H7zm0 4h2v2H7zm0 4h2v2H7z"></path>
        </svg>
        試合結果
      </div>
      <div className={`cursor-pointer flex-1 hover:bg-gray-900 flex flex-col justify-center py-2 sm:p-4 relative ${menuActive('share') ? 'bg-gray-900 active' : ''}`} onClick={()=>setMenu({target: 'share', opened: true})}>
        <svg className="w-6 h-6 fill-current mx-auto sm:mb-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"></path>
        </svg>
        共有
      </div>

      <style jsx>{`
        .active:after {
          content: '';
          position: absolute;
          width: 5px;
          height: 5px;
          border-style: solid;
          border-width: 5px 0 5px 5px;
          border-color: transparent transparent transparent #1a202c;
        }

        @media (min-width: 640px) {
          .active:after {
            right: -5px;
            top: calc(50% - 5px);
            border-width: 5px 0 5px 5px;
            border-color: transparent transparent transparent #1a202c;
          }
        }
        @media (max-width: 640px) {
          .active:after {
            left: calc(50% - 5px);
            bottom: -5px;
            border-width: 5px 5px 0 5px;
            border-color: #1a202c transparent transparent transparent;
          }
        }
      `}</style>
    </div>
  );
};
