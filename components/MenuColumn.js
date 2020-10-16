import Link from 'next/link'
import { useContext, useState } from 'react';
import { LeagueContext, MatchContext, MenuContext } from '../pages/index.js';

export default function MenuColumn(){
  const [match, setMatch] = useContext(MatchContext);
  const [league, setLeague] = useContext(LeagueContext);
  const [menu, setMenu] = useContext(MenuContext);

  const menuActive = (target) => {
    return target == menu["target"] && menu["opened"];
  }

  return (
    <div className="flex flex-row sm:flex-col bg-gray-800 text-white text-center text-xs">
      <div className={`cursor-pointer hover:bg-gray-900 flex items-center p-4`} onClick={()=>setMenu({target: menu['target'], opened: !menu['opened']})}>
        <svg className={`w-5 h-5 fill-current mx-auto transform duration-100 ${menu['opened'] ? '' : '-rotate-90'}`} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,3 L20,3 L20,5 L0,5 L0,3 Z M0,9 L20,9 L20,11 L0,11 L0,9 Z M0,15 L20,15 L20,17 L0,17 L0,15 Z"></path>
        </svg>
      </div>
      <div className={`cursor-pointer hover:bg-gray-900 flex flex-col justify-center p-4 relative ${menuActive('settings') ? 'bg-gray-900 active' : ''}`} onClick={()=>setMenu({target: 'settings', opened: true})}>
        <svg className="w-5 h-5 fill-current mx-auto mb-2" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style={{fillRule: 'evenodd'}}>
          <path d="M3.93830521,6.49683865 C3.63405147,7.02216933 3.39612833,7.5907092 3.23599205,8.19100199 L5.9747955e-16,9 L9.6487359e-16,11 L3.23599205,11.808998 C3.39612833,12.4092908 3.63405147,12.9778307 3.93830521,13.5031614 L2.22182541,16.363961 L3.63603897,17.7781746 L6.49683865,16.0616948 C7.02216933,16.3659485 7.5907092,16.6038717 8.19100199,16.7640079 L9,20 L11,20 L11.808998,16.7640079 C12.4092908,16.6038717 12.9778307,16.3659485 13.5031614,16.0616948 L16.363961,17.7781746 L17.7781746,16.363961 L16.0616948,13.5031614 C16.3659485,12.9778307 16.6038717,12.4092908 16.7640079,11.808998 L20,11 L20,9 L16.7640079,8.19100199 C16.6038717,7.5907092 16.3659485,7.02216933 16.0616948,6.49683865 L17.7781746,3.63603897 L16.363961,2.22182541 L13.5031614,3.93830521 C12.9778307,3.63405147 12.4092908,3.39612833 11.808998,3.23599205 L11,0 L9,0 L8.19100199,3.23599205 C7.5907092,3.39612833 7.02216933,3.63405147 6.49683865,3.93830521 L3.63603897,2.22182541 L2.22182541,3.63603897 L3.93830521,6.49683865 L3.93830521,6.49683865 Z M10,13 C11.6568542,13 13,11.6568542 13,10 C13,8.34314575 11.6568542,7 10,7 C8.34314575,7 7,8.34314575 7,10 C7,11.6568542 8.34314575,13 10,13 L10,13 Z"></path>
        </svg>
        基本情報
      </div>
      <div className={`cursor-pointer hover:bg-gray-900 flex flex-col justify-center p-4 relative ${menuActive('players') ? 'bg-gray-900 active' : ''}`} onClick={()=>setMenu({target: 'players', opened: true})}>
        <svg className="w-5 h-5 fill-current mx-auto mb-2" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M7,8 C9.209139,8 11,6.209139 11,4 C11,1.790861 9.209139,0 7,0 C4.790861,0 3,1.790861 3,4 C3,6.209139 4.790861,8 7,8 Z M7,9 C4.852,9 2.801,9.396 0.891,10.086 L2,16 L3.25,16 L4,20 L10,20 L10.75,16 L12,16 L13.109,10.086 C11.199,9.396 9.148,9 7,9 Z M15.315,9.171 L13.66,18 L12.41,18 L12.035,20 L16,20 L16.75,16 L18,16 L19.109,10.086 C17.899,9.648 16.627,9.346 15.315,9.171 Z M13,0 C12.532,0 12.089,0.096 11.671,0.243 C12.501,1.272 13,2.578 13,4 C13,5.422 12.501,6.728 11.671,7.757 C12.089,7.904 12.531,8 13,8 C15.209,8 17,6.209 17,4 C17,1.791 15.209,0 13,0 Z"></path>
        </svg>
        参加者
      </div>
      <div className={`cursor-pointer hover:bg-gray-900 flex flex-col justify-center p-4 relative ${menuActive('matches') ? 'bg-gray-900 active' : ''}`} onClick={()=>setMenu({target: 'matches', opened: true})}>
        <svg className="w-5 h-5 fill-current mx-auto mb-2" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style={{fillRule: 'evenodd'}}>
          <path d="M4,10 L12,10 L12,12 L4,12 L4,10 L4,10 Z M4,14 L12,14 L12,16 L4,16 L4,14 L4,14 Z M4,4 L12,4 L12,8 L4,8 L4,4 L4,4 Z M16,2 L16,1 L16,0 L0,0 L0,1 L0,1 L0,17.0057979 C0,18.656688 1.34320226,20 3.00012623,20 L17,20 C18.6534829,20 20,18.6601943 20,17.0074602 L20,3 L20,2 L16,2 L16,2 L16,2 Z M16,4 L16,17.0066023 C16,17.5552407 16.4438648,18 17,18 C17.5522847,18 18,17.5553691 18,16.9991283 L18,4 L16,4 L16,4 L16,4 Z M2,2 L14,2 L14,17.0057979 C14,17.3541355 14.0597981,17.6887794 14.1697239,18 L3.00748397,18 C2.44892021,18 2,17.5552407 2,17.0066023 L2,2 L2,2 L2,2 L2,2 Z"></path>
        </svg>
        試合結果
      </div>
      <div className={`cursor-pointer hover:bg-gray-900 flex flex-col justify-center p-4 relative ${menuActive('share') ? 'bg-gray-900 active' : ''}`} onClick={()=>setMenu({target: 'share', opened: true})}>
        <svg className="w-5 h-5 fill-current mx-auto mb-2" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.08261143,12.1593397 C4.54304902,12.6798471 3.80891237,13 3,13 C1.34314575,13 0,11.6568542 0,10 C0,8.34314575 1.34314575,7 3,7 C3.80891237,7 4.54304902,7.32015293 5.08261143,7.84066029 L14.0226687,3.37063167 C14.0077053,3.24918566 14,3.12549267 14,3 C14,1.34314575 15.3431458,0 17,0 C18.6568542,0 20,1.34314575 20,3 C20,4.65685425 18.6568542,6 17,6 C16.1910876,6 15.456951,5.67984707 14.9173886,5.15933971 L5.97733131,9.62936833 C5.99229467,9.75081434 6,9.87450733 6,10 C6,10.1254927 5.99229467,10.2491857 5.97733131,10.3706317 L14.9173886,14.8406603 C15.456951,14.3201529 16.1910876,14 17,14 C18.6568542,14 20,15.3431458 20,17 C20,18.6568542 18.6568542,20 17,20 C15.3431458,20 14,18.6568542 14,17 C14,16.8745073 14.0077053,16.7508143 14.0226687,16.6293683 L5.08261143,12.1593397 L5.08261143,12.1593397 Z"></path>
        </svg>
        共有
      </div>

      <style jsx>{`
        .active:after {
          content: '';
          position: absolute;
          width: 5px;
          height: 5px;
          right: -5px;
          top: calc(50% - 5px);
          border-style: solid;
          border-width: 5px 0 5px 5px;
          border-color: transparent transparent transparent #1a202c;
        }
      `}</style>
    </div>
  );
};
