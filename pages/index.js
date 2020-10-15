import { useState, createContext } from 'react';
import Link from 'next/link'
import { firebase } from '../lib/firebase.js'
import League from '../components/League.js'
import Ranking from '../components/Ranking.js'

export const LeagueContext = createContext(["", () => {}]);
export const MatchContext = createContext(["", () => {}]);


export default function Index({initialLeague}) {
  const [league, setLeague] = useState(initialLeague);
  const [match, setMatch] = useState(false);

  return (
    <LeagueContext.Provider value={[league, setLeague]}>
      <MatchContext.Provider value={[match, setMatch]}>
        <div className="flex flex-col sm:flex-row">
          <div className="flex flex-row sm:flex-col bg-gray-800 text-white text-center text-xs">
            <div className="flex items-center px-4 py-6">
              <svg className="w-5 h-5 fill-current mx-auto" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,3 L20,3 L20,5 L0,5 L0,3 Z M0,9 L20,9 L20,11 L0,11 L0,9 Z M0,15 L20,15 L20,17 L0,17 L0,15 Z"></path>
              </svg>
            </div>
            <div className="flex flex-col justify-center p-4 relative bg-gray-900 active">
              <svg className="w-5 h-5 fill-current mx-auto mb-2" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style={{fillRule: 'evenodd'}}>
                <path d="M3.93830521,6.49683865 C3.63405147,7.02216933 3.39612833,7.5907092 3.23599205,8.19100199 L5.9747955e-16,9 L9.6487359e-16,11 L3.23599205,11.808998 C3.39612833,12.4092908 3.63405147,12.9778307 3.93830521,13.5031614 L2.22182541,16.363961 L3.63603897,17.7781746 L6.49683865,16.0616948 C7.02216933,16.3659485 7.5907092,16.6038717 8.19100199,16.7640079 L9,20 L11,20 L11.808998,16.7640079 C12.4092908,16.6038717 12.9778307,16.3659485 13.5031614,16.0616948 L16.363961,17.7781746 L17.7781746,16.363961 L16.0616948,13.5031614 C16.3659485,12.9778307 16.6038717,12.4092908 16.7640079,11.808998 L20,11 L20,9 L16.7640079,8.19100199 C16.6038717,7.5907092 16.3659485,7.02216933 16.0616948,6.49683865 L17.7781746,3.63603897 L16.363961,2.22182541 L13.5031614,3.93830521 C12.9778307,3.63405147 12.4092908,3.39612833 11.808998,3.23599205 L11,0 L9,0 L8.19100199,3.23599205 C7.5907092,3.39612833 7.02216933,3.63405147 6.49683865,3.93830521 L3.63603897,2.22182541 L2.22182541,3.63603897 L3.93830521,6.49683865 L3.93830521,6.49683865 Z M10,13 C11.6568542,13 13,11.6568542 13,10 C13,8.34314575 11.6568542,7 10,7 C8.34314575,7 7,8.34314575 7,10 C7,11.6568542 8.34314575,13 10,13 L10,13 Z"></path>
              </svg>
              基本情報
            </div>
            <div className="flex flex-col justify-center p-4 relative">
              <svg className="w-5 h-5 fill-current mx-auto mb-2" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M7,8 C9.209139,8 11,6.209139 11,4 C11,1.790861 9.209139,0 7,0 C4.790861,0 3,1.790861 3,4 C3,6.209139 4.790861,8 7,8 Z M7,9 C4.852,9 2.801,9.396 0.891,10.086 L2,16 L3.25,16 L4,20 L10,20 L10.75,16 L12,16 L13.109,10.086 C11.199,9.396 9.148,9 7,9 Z M15.315,9.171 L13.66,18 L12.41,18 L12.035,20 L16,20 L16.75,16 L18,16 L19.109,10.086 C17.899,9.648 16.627,9.346 15.315,9.171 Z M13,0 C12.532,0 12.089,0.096 11.671,0.243 C12.501,1.272 13,2.578 13,4 C13,5.422 12.501,6.728 11.671,7.757 C12.089,7.904 12.531,8 13,8 C15.209,8 17,6.209 17,4 C17,1.791 15.209,0 13,0 Z"></path>
              </svg>
              参加者
            </div>
            <div className="flex flex-col justify-center p-4 relative">
              <svg className="w-5 h-5 fill-current mx-auto mb-2" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style={{fillRule: 'evenodd'}}>
                <path d="M0,2 L20,2 L20,18 L0,18 L0,2 Z M2,4 L18,4 L18,16 L2,16 L2,4 Z M6,4 L8,4 L8,16 L6,16 L6,4 Z M12,4 L14,4 L14,16 L12,16 L12,4 Z"></path>
              </svg>
              試合結果
            </div>
            <div className="flex flex-col justify-center p-4 relative">
              <svg className="w-5 h-5 fill-current mx-auto mb-2" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.08261143,12.1593397 C4.54304902,12.6798471 3.80891237,13 3,13 C1.34314575,13 0,11.6568542 0,10 C0,8.34314575 1.34314575,7 3,7 C3.80891237,7 4.54304902,7.32015293 5.08261143,7.84066029 L14.0226687,3.37063167 C14.0077053,3.24918566 14,3.12549267 14,3 C14,1.34314575 15.3431458,0 17,0 C18.6568542,0 20,1.34314575 20,3 C20,4.65685425 18.6568542,6 17,6 C16.1910876,6 15.456951,5.67984707 14.9173886,5.15933971 L5.97733131,9.62936833 C5.99229467,9.75081434 6,9.87450733 6,10 C6,10.1254927 5.99229467,10.2491857 5.97733131,10.3706317 L14.9173886,14.8406603 C15.456951,14.3201529 16.1910876,14 17,14 C18.6568542,14 20,15.3431458 20,17 C20,18.6568542 18.6568542,20 17,20 C15.3431458,20 14,18.6568542 14,17 C14,16.8745073 14.0077053,16.7508143 14.0226687,16.6293683 L5.08261143,12.1593397 L5.08261143,12.1593397 Z"></path>
              </svg>
              共有
            </div>
          </div>
          <div className="p-4 bg-gray-100 w-1/3">
          </div>
          <div className="px-12 py-4 flex-1">
            <h1 className="text-lg mb-8">{league.title}</h1>
            <div>
              <Ranking initialLeague={league} />
              <hr className="my-12" />
              <League initialLeague={league} editable={true} />
            </div>
          </div>
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
      </MatchContext.Provider>
    </LeagueContext.Provider>
  )
}


export async function getStaticProps(context) {
  const docId = "svVUNf8p6vwfpP9V96XW";
  const doc = await firebase.firestore().collection('leagues').doc(docId).get();
  const league = Object.assign(doc.data(), {id: doc.id});

  const matches = [
    {
      winner: '6zdnot6r2as',
      finished: true,
      teams: {
        '6zdnot6r2as' : { score: 12, },
        'a2brymi257a': { score: 3, },
      },
    },
    {
      winner: null,
      finished: false,
      teams: {
        '6zdnot6r2as' : { score: null, },
        'a54zzd5a0d4': { score: null, },
      },
    },
    {
      winner: 'fe50h7tqqgk',
      finished: true,
      teams: {
        '6zdnot6r2as' : { score: 2, },
        'fe50h7tqqgk': { score: 5, },
      },
    },
    {
      winner: null,
      finished: true,
      teams: {
        'a2brymi257a' : { score: 4, },
        'a54zzd5a0d4': { score: 4, },
      },
    },
    {
      winner: 'a2brymi257a',
      finished: true,
      teams: {
        'a2brymi257a' : { score: 2, },
        'fe50h7tqqgk': { score: 0, },
      },
    },
    {
      winner: null,
      finished: true,
      teams: {
        'a54zzd5a0d4' : { score: 30, },
        'fe50h7tqqgk': { score: 30, },
      },
    },
  ];

  const teams = [
    { name: 'ぴよぴよ', id: '6zdnot6r2as' },
    { name: 'ほげほげ', id: 'a2brymi257a' },
    { name: 'ふがふが', id: 'a54zzd5a0d4' },
    { name: 'むにゃむにゃ', id: 'fe50h7tqqgk' },
  ];

  // const docRef = firebase.firestore().collection('leagues').doc(docId);
  // const res = await docRef.update(
  //   {
  //     matches: matches,
  //     teams: teams,
  //     title: 'ほげほーげ',
  //   }
  // );


  return {
    props: {
      initialLeague: league,
    }
  }
}
