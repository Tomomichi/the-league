import { useState, createContext } from 'react';
import Link from 'next/link'
import { firebase } from '../lib/firebase.js'
// import DiagonalSVG from '../lib/diagonalSVG.js'
import MatchModal from '../components/MatchModal.js'
import TableCell from '../components/TableCell.js'

export const LeagueContext = createContext(["", () => {}]);
export const MatchContext = createContext(["", () => {}]);

export default function Index({initialLeague}) {
  const [match, setMatch] = useState(false);
  const [league, setLeague] = useState(initialLeague);

  const updateTeamName = (e) => {
    const teamId = e.currentTarget.dataset.teamId;
    league.teams.find(t => t.id == teamId).name = e.currentTarget.value;
    setLeague(Object.assign({}, league));
  }

  const addMember = () => {
    const newMember = { name: 'PlayerX', id: Math.random().toString(36).substring(2) };
    league.teams.forEach(team => {
      const teams = {
        [team.id]: { score: null },
        [newMember.id]: { score: null },
      };
      league.matches.push({ teams: teams, finished: false, winner: null });
    });
    league.teams.push(newMember);
    setLeague(Object.assign({}, league));
  }

  const removeMember = (teamId) => {
    league.teams = league.teams.filter(t => t.id != teamId);
    league.matches = league.matches.filter(m => !Object.keys(m.teams).includes(teamId));
    setLeague(Object.assign({}, league));
  }

  return (
    <LeagueContext.Provider value={[league, setLeague]}>
      <MatchContext.Provider value={[match, setMatch]}>
        <div>
          <h1 className="text-lg mb-8">{league.title}</h1>
          <div>
            <table className="table-fixed w-full overflow-x-scroll border-collapse border mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border"></th>
                  { league.teams.map(team => (
                    <th key={team.name} className="border px-1 py-2 text-sm truncate">{team.name}</th>
                  )) }
                </tr>
              </thead>
              <tbody>
                { league.teams.map((team) => (
                  <tr key={team.id}>
                    <th className="bg-gray-100 border p-3 relative">
                      <input data-team-id={team.id} className="w-full bg-gray-100 px-1 py-2 focus:bg-white" type="text" name={`teams[${team.id}]`} defaultValue={team.name} placeholder='Player XX' onBlur={ updateTeamName } />
                      <div className="absolute cursor-pointer top-0 right-0" onClick={()=>{removeMember(team.id)}}>
                        <svg className="fill-current inline-block pr-1" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                          <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                        </svg>
                      </div>
                    </th>
                    { league.teams.map((counter) => {
                      if(team.id == counter.id) {
                        return <td key={`${team.id}-${counter.id}`} className="border p-3 diagonal"></td>;
                      }else {
                        return <TableCell key={`${team.id}-${counter.id}`} team={team} counter={counter} />;
                      }
                    }) }
                  </tr>
                )) }
              </tbody>
            </table>

            <div>
              <div className="cursor-pointer inline-block" onClick={addMember}>＋ 参加者を追加する</div>
            </div>
          </div>

          <MatchModal />
        </div>

        <style jsx>{`
          .diagonal {
            background-image: url('data:image/svg+xml;base64,${
              new Buffer(`<svg xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;"><line x1="0%" y1="0%" x2="100%" y2="100%" style="stroke: #e2e8f0; stroke-width: 1;"/></svg>`).toString('base64')
            }');
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
