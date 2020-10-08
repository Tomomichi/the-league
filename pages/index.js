import { firebase } from '../lib/firebase.js'
import Link from 'next/link'

export default function Index({league}) {
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
                  <Result key={`${teamIndex}-${counterIndex}`} league={league} teamIndex={teamIndex} counterIndex={counterIndex} />
                )) }
              </tr>
            )) }
          </tbody>
        </table>
      </div>
    </div>
  )
}

const Result = (props) => {
  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">
                      <line x1="0%" y1="0%" x2="100%" y2="100%" style="stroke: #e2e8f0; stroke-width: 1;"/>
                     </svg>`;
  const buff = new Buffer(svgString);
  const svg = buff.toString('base64');

  if(props.teamIndex == props.counterIndex || props.teamIndex > props.counterIndex) {
    return (
      <td className="border p-3 text-center" style={{ backgroundImage: `url(\'data:image/svg+xml;base64,${svg}\');` }}>
        <div></div>
      </td>
    );
  }

  return (
    <td className="border p-3 text-center cursor-pointer hover:bg-gray-200">
      <div>
        { props.league.results[props.teamIndex][0].scores.join("-") }
      </div>
    </td>
  );
}


export async function getStaticProps(context) {
  const docId = "svVUNf8p6vwfpP9V96XW";
  const doc = await firebase.firestore().collection('leagues').doc(docId).get();
  const league = Object.assign(doc.data(), {id: doc.id});

  const defaultResult = {
    0: [
      { result: 0, scores: [1, 0] },
      { result: 0, scores: [1, 0] },
      { result: 0, scores: [1, 0] },
    ],
    1: [
      { result: 0, scores: [1, 0] },
      { result: 0, scores: [1, 0] },
    ],
    2: [
      { result: 0, scores: [1, 0] },
    ],
  }

  // const docRef = firebase.firestore().collection('leagues').doc(docId);
  // const res = await docRef.update(
  //   {results: defaultResult}
  // );


  return {
    props: {
      league: league,
    }
  }
}
