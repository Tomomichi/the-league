import { createContext, useContext, useState } from 'react'
import { LeagueContext, MatchContext } from '../../lib/contexts.js';
import MatchModal from './MatchModal.js'
import TableCell from './TableCell.js'

const CellWidth = 100;

export default function League({editable}){
  const [match, setMatch] = useContext(MatchContext);
  const [league, setLeague] = useContext(LeagueContext);

  const updateTeamName = (e) => {
    const teamId = e.currentTarget.dataset.teamId;
    league.teams.find(t => t.id == teamId).name = e.currentTarget.value;
    setLeague(Object.assign({}, league));
  }

  const addMember = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('newMember');
    if(!name || name == '') { return; }

    const newMember = { name: name, id: Math.random().toString(36).substring(2) };
    league.teams.forEach(team => {
      const teams = { [team.id]: { score: null }, [newMember.id]: { score: null }, };
      league.matches.push({ teams: teams, finished: false, winner: null });
    });
    league.teams.push(newMember);
    document.getElementsByName('newMember')[0].value = "";
    setLeague(Object.assign({}, league));
  }

  const removeMember = (teamId) => {
    league.teams = league.teams.filter(t => t.id != teamId);
    league.matches = league.matches.filter(m => !Object.keys(m.teams).includes(teamId));
    setLeague(Object.assign({}, league));
  }

  return (
    <>
      <div className="overflow-x-scroll mb-6">
        <table className="min-w-full rounded overflow-hidden border-collapse whitespace-no-wrap" style={{width: 200 + CellWidth*league.teams.length}}>
          <thead>
            <tr className="bg-gray-200">
              <th className="border" style={{width: 200}}></th>
              { league.teams.map(team => (
                <th key={team.name} className="border px-1 py-3 text-sm truncate" style={{width: CellWidth}}>{team.name}</th>
              )) }
            </tr>
          </thead>
          <tbody>
            { league.teams.map((team) => (
              <tr key={team.id}>
                <th className="bg-gray-200 border px-2 relative">
                  { editable ?
                    <div className="flex items-center">
                      <input data-team-id={team.id} className="w-full rounded px-1 py-2 focus:bg-white" type="text" name={`teams[${team.id}]`} defaultValue={team.name} placeholder='Player XX' onBlur={ updateTeamName } />
                      <div className="text-gray-500 cursor-pointer" onClick={()=>{removeMember(team.id)}}>
                        <svg className="fill-current inline-block w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                        </svg>
                      </div>
                    </div>
                    :
                    <div className="text-left">{team.name}</div>
                  }
                </th>
                { league.teams.map((counter) => {
                  if(team.id == counter.id) {
                    return <td key={`${team.id}-${counter.id}`} className="border diagonal"></td>;
                  }else {
                    return <TableCell key={`${team.id}-${counter.id}`} team={team} counter={counter} />;
                  }
                }) }
              </tr>
            )) }
          </tbody>
        </table>
      </div>

      { editable &&
        <div>
          <form onSubmit={addMember} className="flex items-center">
            <input className="flex-1 sm:flex-grow-0 border px-2 py-2 rounded-l text-sm" type="text" placeholder='参加者名' name='newMember' required />
            <button className="flex items-center px-3 py-2 border border-blue-600 bg-blue-600 text-white text-sm rounded-r" type="submit">
              <svg className="w-5 h-5 fill-current mr-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
              </svg>
              追加
            </button>
          </form>
        </div>
      }

      <MatchModal editable={editable} />

      <style jsx>{`
        .diagonal {
          background-image: url('data:image/svg+xml;base64,${
            new Buffer(`<svg xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;"><line x1="0%" y1="0%" x2="100%" y2="100%" style="stroke: #e2e8f0; stroke-width: 1;"/></svg>`).toString('base64')
          }');
        }
      `}</style>
    </>
  )
};
