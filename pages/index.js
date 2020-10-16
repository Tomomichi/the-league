import { useState, createContext } from 'react';
import Link from 'next/link'
import { firebase } from '../lib/firebase.js'
import MenuColumn from '../components/MenuColumn.js'
import League from '../components/League.js'
import Ranking from '../components/Ranking.js'

export const LeagueContext = createContext(["", () => {}]);
export const MatchContext = createContext(["", () => {}]);
export const MenuContext = createContext(["", () => {}]);

export default function Index({initialLeague}) {
  const [league, setLeague] = useState(initialLeague);
  const [match, setMatch] = useState(false);
  const [menu, setMenu] = useState({target: 'settings', opened: true});

  return (
    <LeagueContext.Provider value={[league, setLeague]}>
      <MatchContext.Provider value={[match, setMatch]}>
        <MenuContext.Provider value={[menu, setMenu]}>
          <div className="flex flex-col sm:flex-row" style={{height: "calc(100vh - 40px)"}}>
            <MenuColumn />

            { menu['opened'] &&
              <div className={`p-4 bg-gray-100 w-1/3 h-full`}></div>
            }
            <div className="px-12 py-4 flex-1 h-full overflow-y-scroll">
              <h1 className="text-lg mb-8">{league.title}</h1>
              <div>
                <Ranking />
                <hr className="my-12" />
                <League editable={true} />
              </div>
            </div>
          </div>
        </MenuContext.Provider>
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
