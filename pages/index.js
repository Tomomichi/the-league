import { useState } from 'react'
import { firebase } from '../lib/firebase.js'
import Link from 'next/link'


export default function Index({league}) {
  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">
                      <line x1="0%" y1="0%" x2="100%" y2="100%" style="stroke: #e2e8f0; stroke-width: 1;"/>
                     </svg>`;
  const buff = new Buffer(svgString);
  const svg = buff.toString('base64');

  const [modalMatch, setModalMatch] = useState(false);

  const updateMatch = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const teams = Object.keys(modalMatch.teams);
    modalMatch.teams[teams[0]] = {
      score: formData.get(`scores[${teams[0]}]`),
      result: getResult(teams[0], formData.get('winner')),
    }
    modalMatch.teams[teams[1]] = {
      score: formData.get(`scores[${teams[1]}]`),
      result: getResult(teams[1], formData.get('winner')),
    }

    let matchIndex = league.results.findIndex(res => Object.keys(res.teams).join("-") == teams.join("-"));
    league.results[matchIndex] = modalMatch;

    const docRef = firebase.firestore().collection('leagues').doc(league.id);
    const res = await docRef.update(
      {
        results: league.results,
      }
    );
  }

  const getResult = (id, winnerValue) => {
    switch(winnerValue) {
      case '':
        return null;
        break;
      case 'draw':
        return 2;
        break;
      case `${id}`:
        return 0;
        break;
      default:
        return 1;
        break;
    }
  }


  return (
    <div>
      <h1 className="text-lg mb-8">{league.title}</h1>
      <div>
        <table className="table-fixed w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border">
              </th>
              { league.teams.map(team => (
                <th key={team.name} className="border py-2 text-sm">{team.name}</th>
              )) }
            </tr>
          </thead>
          <tbody>
            { league.teams.map((team) => (
              <tr key={team.id}>
                <th className="bg-gray-100 border p-3 text-left">{team.name}</th>
                { league.teams.map((counter) => {
                  if(team.id == counter.id) {
                    return <td key={`${team.id}-${counter.id}`} className="border p-3" style={{ backgroundImage: `url(\'data:image/svg+xml;base64,${svg}\');` }}></td>;
                  }else {
                    return <Result key={`${team.id}-${counter.id}`} league={league} team={team} counter={counter} setModalMatch={setModalMatch} />;
                  }
                }) }
              </tr>
            )) }
          </tbody>
        </table>
      </div>

      { modalMatch &&
        <div className='transition-opacity duration-200 fixed w-full h-full top-0 left-0 flex items-center justify-center z-50'>
          <div className="absolute w-full h-full bg-black opacity-75" onClick={()=>{setModalMatch(false)}}></div>
          <div className="bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
            <div className="relative text-left">
              <div className="absolute top-0 right-0 cursor-pointer mr-4 text-sm z-50" onClick={()=>{setModalMatch(false)}}>
                <svg className="fill-current inline-block pr-1" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                  <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                </svg>
                Close
              </div>

              <div className="border-b my-4">
                <h5 className="px-4 pb-2 text-lg font-bold">試合結果の編集</h5>
              </div>

              <form id="form" onSubmit={updateMatch}>
                <div className="mb-4 px-4">
                  <div className="flex items-center">
                    <div className="flex-1 text-center border bg-gray-100 p-4 rounded">
                      <div className="mb-2">{ league.teams.find(t => t.id == Object.keys(modalMatch.teams)[0]).name }</div>
                      <input name={`scores[${Object.keys(modalMatch.teams)[0]}]`} className="px-1 py-2 rounded border" type="text" placeholder="スコア" defaultValue={modalMatch.teams[Object.keys(modalMatch.teams)[0]].score} />
                    </div>
                    <div className="mx-2 font-bold">-</div>
                    <div className="flex-1 text-center border bg-gray-100 p-4 rounded">
                      <div className="mb-2">{ league.teams.find(t => t.id == Object.keys(modalMatch.teams)[1]).name }</div>
                      <input name={`scores[${Object.keys(modalMatch.teams)[1]}]`} className="px-1 py-2 rounded border" type="text" placeholder="スコア" defaultValue={modalMatch.teams[Object.keys(modalMatch.teams)[1]].score} />
                    </div>
                  </div>
                </div>

                <div className="mb-4 px-4">
                  <select name="winner" className="w-full px-1 py-2 border">
                    <option value="">-- 勝者を選択 --</option>
                    { Object.keys(modalMatch.teams).map(teamId => (
                      <option key={teamId} value={teamId}>{ league.teams.find(team => team.id == teamId).name }</option>
                    ))}
                    <option value="draw">（引き分け）</option>
                  </select>
                </div>

                <div className="bg-gray-100 p-4 flex">
                  <div className="flex-1">
                    <input type="submit" className="bg-blue-600 text-white hover:opacity-75 text-sm p-2 mr-2 rounded cursor-pointer" value="更新" />
                    <button className="hover:opacity-75 text-sm p-2 rounded">キャンセル</button>
                  </div>
                  <div>
                    <button className="text-red-600 border border-red-600 hover:opacity-75 text-sm p-2 rounded">削除</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      }
    </div>
  )
}

const Result = ({league, team, counter, setModalMatch}) => {
  const match = league.results.find(r => Object.keys(r.teams).sort().join("-") == [team.id, counter.id].sort().join("-"));
  return (
    <td className="border p-3 text-center cursor-pointer hover:bg-gray-200" onClick={()=>{setModalMatch(match)}}>
      <div>
        <div>{ resultMark(match.teams[team.id].result) }</div>
        { match.teams[team.id].result !== null &&
          `${match.teams[team.id].score} - ${match.teams[counter.id].score}`
        }
      </div>
    </td>
  );
}

const resultMark = (res) => {
  switch(res) {
    case 0:
      return '○';
      break;
    case 1:
      return '●';
      break;
    case 2:
      return '▲';
      break;
    default:
      return '-';
      break;
  }
};


export async function getStaticProps(context) {
  const docId = "svVUNf8p6vwfpP9V96XW";
  const doc = await firebase.firestore().collection('leagues').doc(docId).get();
  const league = Object.assign(doc.data(), {id: doc.id});

  const results = [
    {
      teams: {
        '6zdnot6r2as' : { result: 0, score: 12, },
        'a2brymi257a': { result: 1, score: 3, },
      },
    },
    {
      teams: {
        '6zdnot6r2as' : { result: null, score: null, },
        'a54zzd5a0d4': { result: null, score: null, },
      },
    },
    {
      teams: {
        '6zdnot6r2as' : { result: 1, score: 2, },
        'fe50h7tqqgk': { result: 0, score: 5, },
      },
    },
    {
      teams: {
        'a2brymi257a' : { result: 2, score: 4, },
        'a54zzd5a0d4': { result: 2, score: 4, },
      },
    },
    {
      teams: {
        'a2brymi257a' : { result: 0, score: 2, },
        'fe50h7tqqgk': { result: 1, score: 0, },
      },
    },
    {
      teams: {
        'a54zzd5a0d4' : { result: 2, score: 30, },
        'fe50h7tqqgk': { result: 2, score: 30, },
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
  //     results: results,
  //     teams: teams,
  //     title: 'ほげほーげ',
  //   }
  // );


  return {
    props: {
      league: league,
    }
  }
}
