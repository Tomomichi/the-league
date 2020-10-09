import { useState } from 'react'
import { firebase } from '../lib/firebase.js'
import Link from 'next/link'


export default function Index({league}) {
  const [modalMatch, setModalMatch] = useState(false);

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
            { league.teams.map((team, teamIndex) => (
              <tr key={teamIndex}>
                <th className="bg-gray-100 border p-3 text-left">{team.name}</th>
                { league.teams.map((counter, counterIndex) => (
                  <Result key={`${teamIndex}-${counterIndex}`} league={league} teamIndex={teamIndex} counterIndex={counterIndex} setModalMatch={setModalMatch} />
                )) }
              </tr>
            )) }
          </tbody>
        </table>
      </div>

      { modalMatch &&
        <div className='transition-opacity duration-200 fixed w-full h-full top-0 left-0 flex items-center justify-center z-50'>
          <div className="absolute w-full h-full bg-black opacity-50" onClick={()=>{setModalMatch(false)}}></div>
          <div className="bg-gray-900 w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
            <div className="relative py-6 text-left px-6">
              <div className="absolute top-0 right-0 cursor-pointer mt-4 mr-4 text-white text-sm z-50" onClick={()=>{setModalMatch(false)}}>
                <svg className="fill-current text-white inline-block pr-1" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                  <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                </svg>
                Close
              </div>

              <div>
                <h5 className="pb-4 text-lg font-bold">Match</h5>
                <div className="flex flex-col md:flex-row mb-10">
                  {modalMatch.scores.join("-")}
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  )
}

const Result = ({league, teamIndex, counterIndex, setModalMatch}) => {
  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">
                      <line x1="0%" y1="0%" x2="100%" y2="100%" style="stroke: #e2e8f0; stroke-width: 1;"/>
                     </svg>`;
  const buff = new Buffer(svgString);
  const svg = buff.toString('base64');

  if(teamIndex == counterIndex) {
    return (
      <td className="border p-3 text-center" style={{ backgroundImage: `url(\'data:image/svg+xml;base64,${svg}\');` }}>
        <div></div>
      </td>
    );
  }

  if(teamIndex > counterIndex) {
    const match = league.results.find(r => r.teams.join("-") == [counterIndex, teamIndex].join("-"));
    return (
      <td className="border p-3 text-center cursor-pointer hover:bg-gray-200" onClick={()=>{setModalMatch(match)}}>
        <div>
          <div>{ match.result == 1 ? '○' : '●' }</div>
          { match.scores.join("-") }
        </div>
      </td>
    );
  }

  const match = league.results.find(r => r.teams.join("-") == [teamIndex, counterIndex].join("-"));
  return (
    <td className="border p-3 text-center cursor-pointer hover:bg-gray-200" onClick={()=>{setModalMatch(match)}}>
      <div>
        <div>{ match.result == 0 ? '○' : '●' }</div>
        { match.scores.join("-") }
      </div>
    </td>
  );
}


export async function getStaticProps(context) {
  const docId = "svVUNf8p6vwfpP9V96XW";
  const doc = await firebase.firestore().collection('leagues').doc(docId).get();
  const league = Object.assign(doc.data(), {id: doc.id});

  const defaultResult = [
    { teams: [0,1], result: 0, scores: [1, 0] },
    { teams: [0,2], result: 1, scores: [2, 3] },
    { teams: [0,3], result: 2, scores: [1, 1] },
    { teams: [1,2], result: 0, scores: [3, 0] },
    { teams: [1,3], result: 2, scores: [2, 2] },
    { teams: [2,3], result: 1, scores: [1, 4] },
  ]

  // const docRef = firebase.firestore().collection('leagues').doc(docId);
  // const res = await docRef.update(
  //   {
  //     results: defaultResult,
  //     teams: [
  //       {name: 'ぴよぴよ'},
  //       {name: 'ほげほげ'},
  //       {name: 'ふがふが'},
  //       {name: 'むにゃむにゃ'},
  //     ],
  //     title: 'ほげほーげ',
  //   }
  // );


  return {
    props: {
      league: league,
    }
  }
}
