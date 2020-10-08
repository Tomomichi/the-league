import { firebase } from '../lib/firebase.js'
import Link from 'next/link'

export default function Index({league}) {
  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">
                      <line x1="0%" y1="0%" x2="100%" y2="100%" style="stroke: #ddd; stroke-width: 2;"/>
                     </svg>`;
  const buff = new Buffer(svgString);
  const svg = buff.toString('base64');

  return (
    <div>
      <h1 className="text-lg mb-8">{league.title}</h1>
      <div style={{ backgroundImage: `url(\'data:image/svg+xml;base64,${svg}\');` }}>
        <table className="table-fixed w-full border-collapse border" style={{position: 'relative', zIndex: '-1'}}>
          <thead>
            <tr className="bg-gray-100">
              <th className="border">
              </th>
              { league.teams.map(team => (
                <th key={team.name} className="border py-3">{team.name}</th>
              )) }
            </tr>
          </thead>
          <tbody>
            { league.teams.map((team, teamIndex) => (
              <tr key={teamIndex}>
                <th className="bg-gray-100 border p-3 text-left">{team.name}</th>
                { league.teams.map((counter, counterIndex) => (
                  <td key={`${teamIndex}-${counterIndex}`} className="border p-3 text-center">
                    <Result teamIndex={teamIndex} counterIndex={counterIndex} />
                  </td>
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
  console.log("******")
  console.log(props)
  return <div>aa</div>
}


export async function getStaticProps(context) {
  const docId = "svVUNf8p6vwfpP9V96XW";
  const doc = await firebase.firestore().collection('leagues').doc(docId).get();
  const league = Object.assign(doc.data(), {id: doc.id});

  console.log("-----")
  console.log(league.results[0]);
  console.log("=====")
  console.log(league.results[0][0]);

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
