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
        <div>
          <h1 className="text-lg mb-8">{league.title}</h1>
          <div>
            <Ranking initialLeague={league} />
            <hr className="my-12" />
            <League initialLeague={league} editable={true} />
          </div>
        </div>
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
