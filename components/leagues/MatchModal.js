import { useContext, useState } from 'react';
import { LeagueContext, MatchContext } from '../../lib/contexts.js';

export default function MatchModal({editable}){
  const [league, setLeague] = useContext(LeagueContext);
  const [match, setMatch] = useContext(MatchContext);

  const updateMatch = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const teams = Object.keys(match.teams).sort();
    match.teams[teams[0]] = { score: formData.get(`scores[${teams[0]}]`) }
    match.teams[teams[1]] = { score: formData.get(`scores[${teams[1]}]`) }

    // 勝者未選択 or 引き分けのときは、 winner = null
    let winner = formData.get('winner');
    if(winner == '' || winner == 'draw') { winner = null; }
    match.winner = winner;

    //勝者未選択のときのみ、 finished = false
    match.finished = (formData.get('winner') !== '');

    const matchIndex = league.matches.findIndex(m => Object.keys(m.teams).join("-") == teams.join("-"));
    league.matches[matchIndex] = match;
    setLeague(Object.assign({}, league));
    setMatch(false);
  }

  const resetMatch = () => {
    const teamKeys = Object.keys(match.teams);
    let teams = {};
    teamKeys.map(k => { teams[k] = { score: null } });
    const newMatch = {
      finished: false,
      winner: null,
      teams: teams,
    }

    const matchIndex = league.matches.findIndex(m => Object.keys(m.teams).join("-") == teamKeys.join("-"));
    league.matches[matchIndex] = newMatch;
    setLeague(Object.assign({}, league));
    setMatch(false);
  }


  if(!match) { return null; }
  return (
    <div className='transition-opacity duration-200 fixed w-full h-full top-0 left-0 flex items-center justify-center z-50'>
      <div className="absolute w-full h-full bg-black opacity-75" onClick={()=>{setMatch(false)}}></div>
      <div className="bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
        <div className="relative text-left">
          <div className="absolute top-0 right-0 cursor-pointer mr-4 text-sm z-50" onClick={()=>{setMatch(false)}}>
            <svg className="fill-current inline-block pr-1" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
              <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
            </svg>
            Close
          </div>

          <div className="border-b my-4">
            <h5 className="px-4 pb-2 text-lg font-bold">試合結果</h5>
          </div>

          <form id="form" onSubmit={updateMatch}>
            <div className="mb-4 px-4">
              <div className="flex items-stretch">
                <div className="flex-1 text-center border bg-gray-100 py-4 rounded">
                  <div className="mb-2">{ league.teams.find(t => t.id == Object.keys(match.teams).sort()[0]).name }</div>
                  { editable ?
                    <input name={`scores[${Object.keys(match.teams)[0]}]`} className="px-1 py-2 rounded border" type="text" placeholder="スコア" defaultValue={match.teams[Object.keys(match.teams)[0]].score} />
                    :
                    <div className="mt-2">{match.teams[Object.keys(match.teams)[0]].score}</div>
                  }
                </div>
                <div className="mx-2 font-bold flex items-center">-</div>
                <div className="flex-1 text-center border bg-gray-100 py-4 rounded">
                  <div className="mb-2">{ league.teams.find(t => t.id == Object.keys(match.teams).sort()[1]).name }</div>
                  { editable ?
                    <input name={`scores[${Object.keys(match.teams)[1]}]`} className="px-1 py-2 rounded border" type="text" placeholder="スコア" defaultValue={match.teams[Object.keys(match.teams)[1]].score} />
                    :
                    <div className="mt-2">{match.teams[Object.keys(match.teams)[1]].score}</div>
                  }
                </div>
              </div>
            </div>

            { editable &&
              <>
                <div className="mb-4 px-4">
                  <select name="winner" className="w-full px-1 py-2 border" defaultValue={ (match.finished && match.winner===null) ? 'draw' : match.winner }>
                    <option value="">-- 勝者を選択 --</option>
                    { Object.keys(match.teams).map(teamId => (
                      <option key={teamId} value={teamId}>{ league.teams.find(team => team.id == teamId).name }</option>
                    ))}
                    <option value="draw">（引き分け）</option>
                  </select>
                </div>

                <div className="bg-gray-100 p-4 flex">
                  <div className="flex-1">
                    <input type="submit" className="bg-blue-600 text-white hover:opacity-75 text-sm p-2 mr-2 rounded cursor-pointer" value="更新" />
                    <div className="inline-block cursor-pointer hover:opacity-75 text-sm p-2 rounded" onClick={()=>{setMatch(false)}}>キャンセル</div>
                  </div>
                  <div>
                    <div className="inline-block cursor-pointer text-red-600 border border-red-600 hover:opacity-75 text-sm p-2 rounded" onClick={resetMatch}>削除</div>
                  </div>
                </div>
              </>
            }
          </form>
        </div>
      </div>
    </div>
  );
};
