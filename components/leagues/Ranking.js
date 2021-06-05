import { useState, useContext, useEffect } from 'react'
import { LeagueContext, MatchContext } from '../../lib/contexts.js';

const CellWidth = 100;

export default function Ranking(){
  const [league, setLeague] = useContext(LeagueContext);

  const pointsTable = league.pointsTable || { win: 3, lose: 0, draw: 1 }

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
      // 勝ち点
      if(points[a]['point'] !== points[b]['point']){
        return points[b]['point'] - points[a]['point'];
      }
      // 得失点差
      if(points[a]['gd'] !== points[b]['gd']){
        return points[b]['gd'] - points[a]['gd'];
      }
      // 得点
      if(points[a]['gf'] !== points[b]['gf']){
        return points[b]['gf'] - points[a]['gf'];
      }
      return 0
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
              <th className="px-2 py-3 text-left" style={{width: 70}}>勝ち点</th>
              <th className="px-2 py-3 text-left" style={{width: 70}}>勝ち</th>
              <th className="px-2 py-3 text-left" style={{width: 70}}>引き分け</th>
              <th className="px-2 py-3 text-left" style={{width: 70}}>負け</th>
              <th className="px-2 py-3 text-left" style={{width: 70}}>得点</th>
              <th className="px-2 py-3 text-left" style={{width: 70}}>失点</th>
              <th className="px-2 py-3 text-left" style={{width: 70}}>得失差</th>
            </tr>
          </thead>
          <tbody>
            { sortedTeamIds.map((tid, index) => (
              <tr key={tid} className="border-b hover:bg-gray-100">
                <td className="px-2 py-3">{index + 1}</td>
                <td className="px-2 py-3">{ league.teams.find(t => t.id == tid).name }</td>
                <td className="px-2 py-3">{points[tid].point}</td>
                <td className="px-2 py-3">{points[tid].win}</td>
                <td className="px-2 py-3">{points[tid].draw}</td>
                <td className="px-2 py-3">{points[tid].lose}</td>
                <td className="px-2 py-3">{points[tid].gf}</td>
                <td className="px-2 py-3">{points[tid].ga}</td>
                <td className="px-2 py-3">{points[tid].gd}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 text-xs">
        ※ランキングは「勝点→得失点→得点」順で、勝ち点は勝ちが「3点」,引き分けを「1点」として計算しています。
        点数のカスタマイズや得失点などの表示も将来的に実装予定です。
        <br />
        ※独自要件が必要な場合、カスタム開発での対応も可能です。お問い合わせからお気軽にご相談ください。
      </div>
    </>
  )
};
