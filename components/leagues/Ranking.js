import { useState, useContext, useEffect } from 'react'
import { LeagueContext, MatchContext } from '../../lib/contexts.js';

const CellWidth = 100;

export default function Ranking(){
  const [league, setLeague] = useContext(LeagueContext);

  // 勝ち点計算ロジック
  const pointsTable = league.pointsTable || { win: 3, lose: 0, draw: 1 };

  // ランキング表の表示項目・表示順
  const rankingColumns = league.rankingColumns || [
    { point: '勝ち点' },
    { win: '勝ち' },
    { draw: '引き分け' },
    { lose: '負け' },
    { gf: '得点' },
    { ga: '失点' },
    { gd: '得失差' },
  ];

  // 順位決定ロジック
  const rankingOrder = league.rankingOrder || ['point', 'gd', 'gf'];

  const calcPoints = () => {
    let p = {};
    // 試合数計算
    league.teams.map(t => p[t.id] = { win: 0, lose: 0, draw: 0, point: 0, gf: 0, ga: 0, gd: 0 });  // gf:得点、 ga: 失点, gd: 得失差
    league.matches.forEach(match => {
      if(!match.finished) { return; }

      Object.keys(match.teams).map((tid, index) => {
        if(match.winner == null) {
          p[tid]['draw'] += 1
        }else {
          const res = (match.winner == tid) ? 'win' : 'lose';
          p[tid][res] += 1
        }
        // ga: 得点
        const gf = match.teams[tid]['score'];
        if(!isNaN(gf)) {
          p[tid]['gf'] += Number(gf);
        }
        // gf: 失点
        const opponentId = Object.keys(match.teams)[1-index];
        const ga = match.teams[opponentId]['score'];
        if(!isNaN(ga)) {
          p[tid]['ga'] += Number(ga);
        }
        // gd: 得失点
        p[tid]['gd'] += (Number(gf) - Number(ga));
      });
    });
    // 勝ち点計算
    league.teams.forEach(t => {
      p[t.id]['point'] = p[t.id]['win'] * pointsTable.win + p[t.id]['draw'] * pointsTable.draw + p[t.id]['lose'] * pointsTable.lose ;
    });
    return p;
  }

  // TODO: 比較項目のカスタマイズ、同点の扱い
  const calcSortedTeamIds = () => {
    return Object.keys(points).sort((a,b) => {
      const col = rankingOrder.find(column => { return points[a][column] !== points[b][column] });
      return col ? points[b][col] - points[a][col] : 0;
    });
  }

  const points = calcPoints();
  const sortedTeamIds = calcSortedTeamIds();


  return (
    <>
      <div className="overflow-x-scroll">
        <table className="min-w-full rounded overflow-hidden whitespace-nowrap table-fixed" style={{width: 760}}>
          <thead className="bg-gray-200 text-sm">
            <tr>
              <th className="px-2 py-3 text-left" style={{width: 70}}>順位</th>
              <th className="px-2 py-3 text-left" style={{width: 200}}>名前</th>

              { rankingColumns.map(column => (
                <th key={Object.keys(column)[0]} className="px-2 py-3 text-left" style={{width: 70}}>{ Object.values(column)[0] }</th>
              ))}
            </tr>
          </thead>
          <tbody>
            { sortedTeamIds.map((tid, index) => (
              <tr key={tid} className="border-b hover:bg-gray-100">
                <td className="px-2 py-3">{index + 1}</td>
                <td className="px-2 py-3">{ league.teams.find(t => t.id == tid).name }</td>

                { rankingColumns.map(column => (
                  <td key={Object.keys(column)[0]} className="px-2 py-3">{ points[tid][Object.keys(column)[0]] }</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
};
