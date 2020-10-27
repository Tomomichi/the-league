import { useState, useContext, useEffect } from 'react'
import { LeagueContext, MatchContext } from '../../lib/contexts.js';


export default function Ranking(){
  const [league, setLeague] = useContext(LeagueContext);

  const calcPoints = () => {
    let p = {};
    // 勝ち点計算
    league.teams.map(t => p[t.id] = { win: 0, lose: 0, draw: 0, points: 0 });
    league.matches.forEach(match => {
      if(!match.finished) { return; }

      Object.keys(match.teams).map(tid => {
        if(match.winner == null) {
          p[tid]['draw'] += 1
        }else {
          const res = (match.winner == tid) ? 'win' : 'lose';
          p[tid][res] += 1
        }
      });
    });
    league.teams.forEach(t => {
      p[t.id]['point'] = p[t.id]['win'] * 3 + p[t.id]['draw'] * 1;
    });
    return p;
  }

  const calcSortedTeamIds = () => {
    return Object.keys(points).sort((a,b) => {
      return points[b]['point'] - points[a]['point'];
    });
  }

  const points = calcPoints();
  const sortedTeamIds = calcSortedTeamIds();



  return (
    <div className="overflow-x-scroll">
      <table className="min-w-full">
        <thead className="bg-gray-200 text-sm">
          <tr>
            <th className="px-2 py-3 text-left">順位</th>
            <th className="px-2 py-3 text-left">名前</th>
            <th className="px-2 py-3 text-left">Win</th>
            <th className="px-2 py-3 text-left">Lose</th>
            <th className="px-2 py-3 text-left">Draw</th>
            <th className="px-2 py-3 text-left">勝点</th>
          </tr>
        </thead>
        <tbody>
          { sortedTeamIds.map((tid, index) => (
            <tr key={tid} className="border-b">
              <td className="px-2 py-3">{index + 1}</td>
              <td className="px-2 py-3">{ league.teams.find(t => t.id == tid).name }</td>
              <td className="px-2 py-3">{points[tid].win}</td>
              <td className="px-2 py-3">{points[tid].lose}</td>
              <td className="px-2 py-3">{points[tid].draw}</td>
              <td className="px-2 py-3">{points[tid].point}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-8 text-xs">
        ※ランキングは勝点順で、勝ちが「3点」,引き分けを「1点」として計算しています。
        点数のカスタマイズや得失点などの表示も将来的に実装予定です。
        <br />
        ※独自要件が必要な場合、カスタム開発での対応も可能です。お問い合わせからお気軽にご相談ください。
      </div>
    </div>
  )
};
