import { useState, useContext, useEffect } from 'react'
import { LeagueContext, MatchContext } from '../pages/index.js';


export default function Ranking({initialLeague}){
  const [league, setLeague] = useContext(LeagueContext);
  const [points, setPoints] = useState({});
  const [sortedTeamIds, setSortedTeamIds] = useState([]);

  useEffect(() => {
    // 勝ち点計算
    league.teams.map(t => points[t.id] = { win: 0, lose: 0, draw: 0, points: 0 });
    league.matches.forEach(match => {
      if(!match.finished) { return; }

      Object.keys(match.teams).map(tid => {
        if(match.winner == null) {
          points[tid]['draw'] += 1
        }else {
          const res = (match.winner == tid) ? 'win' : 'lose';
          points[tid][res] += 1
        }
      });
    });
    league.teams.forEach(t => {
      points[t.id]['point'] = points[t.id]['win'] * 3 + points[t.id]['draw'] * 1;
    });
    setPoints(points);
    setSortedTeamIds(calcSortedTeamIds());
  }, [league]);

  const calcSortedTeamIds = () => {
    return Object.keys(points).sort((a,b) => {
      return points[b]['point'] - points[a]['point'];
    });
  }


  return (
    <div>
      <table className="w-full">
        <thead className="bg-gray-100 text-sm">
          <tr>
            <th className="border px-1 py-2 text-left">順位</th>
            <th className="border px-1 py-2 text-left">名前</th>
            <th className="border px-1 py-2 text-left">Win</th>
            <th className="border px-1 py-2 text-left">Lose</th>
            <th className="border px-1 py-2 text-left">Draw</th>
            <th className="border px-1 py-2 text-left">勝点</th>
          </tr>
        </thead>
        <tbody>
          { sortedTeamIds.map((tid, index) => {
            if(!league.teams.find(t => t.id == tid)) { return; }
            return(
              <tr key={tid}>
                <td className="border px-1 py-2">{index + 1}</td>
                <td className="border px-1 py-2">{ league.teams.find(t => t.id == tid).name }</td>
                <td className="border px-1 py-2">{points[tid].win}</td>
                <td className="border px-1 py-2">{points[tid].lose}</td>
                <td className="border px-1 py-2">{points[tid].draw}</td>
                <td className="border px-1 py-2">{points[tid].point}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )
};
