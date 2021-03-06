import { useContext, useState } from 'react';
import { LeagueContext, MatchContext } from '../../lib/contexts.js';

export default function TableCell({team, counter}){
  const [league, setLeague] = useContext(LeagueContext);
  const [match, setMatch] = useContext(MatchContext);
  const targetMatch = league.matches.find(m => Object.keys(m.teams).sort().join("-") == [team.id, counter.id].sort().join("-"));

  return (
    <td className="border text-center cursor-pointer hover:bg-gray-100" style={{height: 80}} onClick={()=>{setMatch(targetMatch)}}>
      <div>
        <div>{ resultMark(team.id, targetMatch) }</div>
        { targetMatch.finished &&
          `${targetMatch.teams[team.id].score} - ${targetMatch.teams[counter.id].score}`
        }
      </div>
    </td>
  );
};

const resultMark = (teamId, match) => {
  if(!match.finished) { return '-'; }
  if(match.winner === null) { return '▲'; }
  return (match.winner == teamId) ? '○' : '●';
};
