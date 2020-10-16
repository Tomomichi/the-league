import Link from 'next/link'
import { useContext, useState } from 'react';
import { LeagueContext, MatchContext, MenuContext } from '../pages/index.js';

export default function MenuColumn(){
  const [match, setMatch] = useContext(MatchContext);
  const [league, setLeague] = useContext(LeagueContext);
  const [menu, setMenu] = useContext(MenuContext);

  const updateLeague = (key, value) => {
    league[key] = value;
    setLeague(Object.assign({}, league));
  }

  return (
    <div className={`p-8 bg-gray-200 w-1/3 overflow-y-scroll h-full text-sm ${menu['opened'] ? '' : 'hidden'}`}>
      <div className={`${menu['target'] == 'settings' ? '' : 'hidden'}`}>
        <div className="mb-8">
          <label htmlFor="title" className="block mb-2 font-bold">大会名*</label>
          <input id="title" className="rounded border px-1 py-2 w-full" type="text" required
            defaultValue={league.title}
            onBlur={e => updateLeague('title', e.target.value)}
          />
        </div>

        <div className="mb-8">
          <label htmlFor="description" className="block mb-2 font-bold">概要</label>
          <textarea id="description" className="rounded border px-1 py-2 w-full" placeholder="大会の詳細など。URLを貼ると自動でリンクに変換されます。"
            defaultValue={league.description}
            onBlur={e => updateLeague('description', e.target.value)}
          ></textarea>
        </div>
      </div>

      <div className={`${menu['target'] == 'players' ? '' : 'hidden'}`}>
        <label htmlFor="description" className="block mb-2 font-bold">参加者</label>
        <textarea id="description" rows={league.teams.length + 1} className="rounded border px-1 py-2 w-full"
          defaultValue={league.teams.map(t => t['name']).join('\r\n')}
        ></textarea>
      </div>

      <div className={`${menu['target'] == 'matches' ? '' : 'hidden'}`}>
        <h6 className="font-bold mb-2">試合結果の登録</h6>
        <div className="rounded border overflow-hidden">
          <table className="w-full bg-white text-center table-fixed">
            <tbody className="divide-y">
              { league['matches'].map(match => {
                const player = league.teams.find(team => team['id'] == Object.keys(match['teams']).sort()[0]);
                const counter = league.teams.find(team => team['id'] == Object.keys(match['teams']).sort()[1]);
                return(
                  <tr key={Math.random()} className="cursor-pointer" onClick={()=>setMatch(match)}>
                    <td className={`w-1/2 py-3 ${match['winner'] == player['id'] ? 'text-red-600 font-bold' : ''}`}>
                      <p className="truncate">{player['name']}</p>
                      <p>{match['teams'][player['id']]['score']}</p>
                    </td>
                    <td className="py-3">-</td>
                    <td className={`w-1/2 py-3 ${match['winner'] == counter['id'] ? 'text-red-600 font-bold' : ''}`}>
                      <p className="truncate">{counter['name']}</p>
                      {match['teams'][counter['id']]['score']}
                    </td>
                  </tr>
                );
              }) }
            </tbody>
          </table>
        </div>
      </div>

      <div className={`${menu['target'] == 'share' ? '' : 'hidden'}`}>
        <div className="mb-8">
          <h6 className="font-bold mb-2">公開URL</h6>
          <input type="text" readOnly className="w-full bg-white rounded p-4" defaultValue={`https://league.the-tournament.jp/leagues/${league.id}`} />
        </div>
        <div className="mb-8">
          <h6 className="font-bold mb-2">埋め込みタグ</h6>
          <input type="text" readOnly className="w-full bg-white rounded p-4" defaultValue={`<iframe src="https://league.the-tournament.jp/leagues/${league.id}"></iframe>`} />
        </div>
        <div className="mb-8">
          <h6 className="font-bold mb-2">SNSシェア</h6>
          <div className="flex">
            <Link href="">
              <a className="rounded bg-blue-600 text-white flex items-center px-4 py-2 w-auto mr-4 hover:opacity-75">
                <svg className="w-5 h-5 fill-current mr-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{fillRule: 'evenodd'}}>
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"></path>
                </svg>
                ツイート
              </a>
            </Link>
            <Link href="">
              <a className="rounded bg-blue-800 text-white flex items-center px-4 py-2 w-auto hover:opacity-75">
                <svg className="w-5 h-5 fill-current mr-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{fillRule: 'evenodd'}}>
                  <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2m13 2h-2.5A3.5 3.5 0 0 0 12 8.5V11h-2v3h2v7h3v-7h3v-3h-3V9a1 1 0 0 1 1-1h2V5z"></path>
                </svg>
                シェア
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
