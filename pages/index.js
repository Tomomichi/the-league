import { useState, createContext } from 'react';
import Link from 'next/link'
import { firebase } from '../lib/firebase.js'
import DiagonalSVG from '../lib/diagonalSVG.js'
import MatchModal from '../components/MatchModal.js'

export const LeagueContext = createContext(["", () => {}]);
export const MatchContext = createContext(["", () => {}]);

export default function Index({initialLeague}) {
  const [modalMatch, setModalMatch] = useState(false);
  const [league, setLeague] = useState(initialLeague);

  const updateTeamName = (e) => {
    const teamId = e.currentTarget.dataset.teamId;
    league.teams.find(t => t.id == teamId).name = e.currentTarget.value;
    setLeague(league);
  }

  return (
    <LeagueContext.Provider value={[league, setLeague]}>
      <MatchContext.Provider value={[modalMatch, setModalMatch]}>
        <div>
          <h1 className="text-lg mb-8">{league.title}</h1>
          <div>
            <table className="table-fixed w-full border-collapse border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border">
                  </th>
                  { league.teams.map(team => (
                    <th key={team.name} className="border py-2 text-sm">{team.name}</th>
                  )) }
                </tr>
              </thead>
              <tbody>
                { league.teams.map((team) => (
                  <tr key={team.id}>
                    <th className="bg-gray-100 border p-3 text-left">
                      <input data-team-id={team.id} className="bg-gray-100 px-1 py-2" type="text" name={`teams[${team.id}]`} defaultValue={team.name} placeholder='Player XX' onBlur={ updateTeamName } />
                    </th>
                    { league.teams.map((counter) => {
                      if(team.id == counter.id) {
                        return <td key={`${team.id}-${counter.id}`} className="border p-3" style={{ backgroundImage: `url(\'data:image/svg+xml;base64,${DiagonalSVG}\');` }}></td>;
                      }else {
                        return <Result key={`${team.id}-${counter.id}`} league={league} team={team} counter={counter} setModalMatch={setModalMatch} />;
                      }
                    }) }
                  </tr>
                )) }
              </tbody>
            </table>
          </div>

          <MatchModal />
        </div>
      </MatchContext.Provider>
    </LeagueContext.Provider>
  )
}

const Result = ({league, team, counter, setModalMatch}) => {
  const match = league.matches.find(m => Object.keys(m.teams).sort().join("-") == [team.id, counter.id].sort().join("-"));
  return (
    <td className="border p-3 text-center cursor-pointer hover:bg-gray-200" onClick={()=>{setModalMatch(match)}}>
      <div>
        <div>{ resultMark(team.id, match) }</div>
        { match.finished &&
          `${match.teams[team.id].score} - ${match.teams[counter.id].score}`
        }
      </div>
    </td>
  );
}

const resultMark = (teamId, match) => {
  if(!match.finished) { return '-'; }
  if(match.winner === null) { return '▲'; }
  return (match.winner == teamId) ? '○' : '●';
};


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
    { name: 'ぴよぴよ', id: Math.random().toString(36).substring(2) },
    { name: 'ほげほげ', id: Math.random().toString(36).substring(2) },
    { name: 'ふがふが', id: Math.random().toString(36).substring(2) },
    { name: 'むにゃむにゃ', id: Math.random().toString(36).substring(2) },
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
