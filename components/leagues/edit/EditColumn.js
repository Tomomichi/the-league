import Link from 'next/link'
import { useContext, useState } from 'react';
import { LeagueContext, MatchContext, MenuContext } from '../../../lib/contexts.js';

export default function MenuColumn(){
  const [match, setMatch] = useContext(MatchContext);
  const [league, setLeague] = useContext(LeagueContext);
  const [menu, setMenu] = useContext(MenuContext);
  const [embedTables, setEmbedTables] = useState({matches: true, ranking: true});
  const [embedPath, setEmbedPath] = useState('');

  const titleBlank = () => {
    return !league.title || league.title == '';
  }

  const updateLeague = (key, value) => {
    league[key] = value;
    setLeague(Object.assign({}, league));
  }

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

  const handleChange = (table, e) => {
    setEmbedTables(Object.assign(embedTables, {[table]: !embedTables[table]}));
    const activeTableNames = Object.keys(embedTables).filter(tableName => embedTables[tableName]);
    const path = (activeTableNames.length == 1) ? `/${activeTableNames[0]}` : '';
    setEmbedPath(path);
  }

  return (
    <>
      <div className={`${menu['target'] == 'settings' ? '' : 'hidden'}`}>
        <div className={`mb-8 ${titleBlank() ? 'text-red-600' : ''}`}>
          <label htmlFor="title" className="block mb-2 font-bold">大会名*</label>

          <input id="title" className={`rounded p-2 w-full ${titleBlank() ? 'border border-red-600 bg-red-100' : ''}`} type="text" required
            defaultValue={league.title}
            onBlur={e => updateLeague('title', e.target.value)}
          />
        </div>

        <div className="mb-8">
          <label htmlFor="description" className="block mb-2 font-bold">概要</label>
          <textarea id="description" className="rounded p-2 w-full" placeholder="大会の詳細など。URLを貼ると自動でリンクに変換されます。"
            defaultValue={league.description}
            onBlur={e => updateLeague('description', e.target.value)}
          ></textarea>
        </div>
      </div>

      <div className={`${menu['target'] == 'players' ? '' : 'hidden'}`}>
        <h6 className="mb-2 font-bold">参加者</h6>
        <div className="space-y-4 mb-6">
          { league.teams.map(team => {
            return(
              <div key={team.id} className="flex items-center">
                <input data-team-id={team.id} className="w-full rounded p-2 focus:bg-white" type="text" name={`teams[${team.id}]`} value={team.name} placeholder='Player XX' onChange={ updateTeamName } />
                <div className="text-gray-500 cursor-pointer" onClick={()=>{removeMember(team.id)}}>
                  <svg className="fill-current inline-block ml-1 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                  </svg>
                </div>
              </div>
            )
          }) }
        </div>
        <div className="border-t border-dashed pt-6">
          <form onSubmit={addMember} className="flex items-center">
            <input className="flex-1 px-2 py-2 rounded-l text-sm" type="text" placeholder='参加者名' name='newMember' required />
            <button className="flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-r" type="submit">
              <svg className="w-5 h-5 fill-current mr-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
              </svg>
              追加
            </button>
          </form>
        </div>
      </div>

      <div className={`${menu['target'] == 'matches' ? '' : 'hidden'}`}>
        <h6 className="font-bold mb-2">試合結果の登録</h6>
        <div className="text-xs mb-2">※クリックすると試合結果を編集できます</div>
        <div className="w-full rounded bg-white text-center divide-y">
          { league['matches'].map(match => {
            const player = league.teams.find(team => team['id'] == Object.keys(match['teams']).sort()[0]);
            const counter = league.teams.find(team => team['id'] == Object.keys(match['teams']).sort()[1]);
            return(
              <div key={Math.random()} className="flex cursor-pointer hover:bg-gray-100" onClick={()=>setMatch(match)}>
                <div className={`flex-1 px-2 py-4 ${match['winner'] == player['id'] ? 'text-red-700 font-bold' : ''}`}>
                  <p className="truncate">{player['name']}</p>
                </div>
                <div className="px-2 py-4 flex">
                  <span className={`w-8 ${match['winner'] == player['id'] ? 'text-red-700 font-bold' : ''}`}>
                    {match['teams'][player['id']]['score']}
                  </span>
                  <span className="mx-2">-</span>
                  <span className={`w-8 ${match['winner'] == counter['id'] ? 'text-red-700 font-bold' : ''}`}>
                    {match['teams'][counter['id']]['score']}
                  </span>
                </div>
                <div className={`flex-1 px-2 py-4 ${match['winner'] == counter['id'] ? 'text-red-700 font-bold' : ''}`}>
                  <p className="truncate">{counter['name']}</p>
                </div>
              </div>
            );
          }) }
        </div>
      </div>

      <div className={`${menu['target'] == 'share' ? '' : 'hidden'}`}>
        <div className="mb-8">
          <h6 className="font-bold mb-2">公開URL</h6>
          <input type="text" readOnly className="w-full bg-white rounded p-4" defaultValue={`${process.env.NEXT_PUBLIC_WEB_ROOT}/leagues/${league.id}`} />
        </div>
        <div className="mb-8">
          <h6 className="font-bold mb-2">埋め込みタグ</h6>
          <div className="w-full bg-white rounded p-4 whitespace-no-wrap overflow-x-scroll">
            {`<div style='position:relative!important;width:100%!important;max-width:100%!important;margin-bottom:20px!important;overflow:auto !important;-webkit-overflow-scrolling:touch !important;'><iframe src='${process.env.NEXT_PUBLIC_WEB_ROOT}/leagues/${league.id}/embed${embedPath}' seamless frameborder='0' scrolling='no' width='100%' height='564' style='width:1px;min-width:100%;'></iframe></div>`}
          </div>
          <div className="mt-2 flex">
            <label className="flex items-center mr-2">
              <input className="mr-1" type="checkbox" defaultChecked={embedTables.matches} onChange={(e)=>{handleChange("matches", e)}} />
              対戦表
            </label>
            <label className="flex items-center">
              <input className="mr-1" type="checkbox" defaultChecked={embedTables.ranking} onChange={(e)=>{handleChange("ranking", e)}} />
              順位表
            </label>
          </div>
        </div>
        <div className="mb-8">
          <h6 className="font-bold mb-2">SNSシェア</h6>
          <div className="flex">
            <a href={`https://twitter.com/share?url=${process.env.NEXT_PUBLIC_WEB_ROOT}/leagues/${league.id}&text=${league.title}のリーグ表%20-%20THE%20LEAGUE(ザ・リーグ)%20簡単・便利な無料総当りリーグ表作成ツール&hashtags=the_league`} target="_blank" className="rounded bg-blue-600 text-white flex items-center px-4 py-2 w-auto mr-4 hover:opacity-75">
              <svg className="w-5 h-5 fill-current mr-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"></path>
              </svg>
              ツイート
            </a>
            <a href={`https://www.facebook.com/share.php?u=${process.env.NEXT_PUBLIC_WEB_ROOT}/leagues/${league.id}`} target="_blank" className="rounded bg-blue-800 text-white flex items-center px-4 py-2 w-auto hover:opacity-75">
              <svg className="w-5 h-5 fill-current mr-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2m13 2h-2.5A3.5 3.5 0 0 0 12 8.5V11h-2v3h2v7h3v-7h3v-3h-3V9a1 1 0 0 1 1-1h2V5z"></path>
              </svg>
              シェア
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
