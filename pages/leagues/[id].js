import { useState, createContext } from 'react';
import Link from 'next/link'
import { firebase } from '../../lib/firebase.js'
import { LeagueContext, MatchContext } from '../../lib/contexts.js';
import League from '../../components/leagues/League.js'
import Ranking from '../../components/leagues/Ranking.js'


export default function Index({initialLeague}) {
  const [league, setLeague] = useState(initialLeague);
  const [match, setMatch] = useState(false);
  const [mainColumn, setMainColumn] = useState('matches');

  return (
    <LeagueContext.Provider value={[league, setLeague]}>
      <MatchContext.Provider value={[match, setMatch]}>
        <div className="flex flex-col sm:flex-row">
          <div className="px-4 sm:px-12 pt-8 overflow-y-scroll pb-24">
            <h1 className="text-lg mb-8">{league.title}</h1>
            <div>
              <div className="flex border-b mb-8">
                <div className={`px-6 pb-1 border-gray-700 ${mainColumn == 'matches' ? 'border-b-2' : 'cursor-pointer'}`} onClick={()=>setMainColumn('matches')}>対戦表</div>
                <div className={`px-6 pb-1 border-gray-700 ${mainColumn == 'ranking' ? 'border-b-2' : 'cursor-pointer'}`} onClick={()=>setMainColumn('ranking')}>順位表</div>
              </div>
              { mainColumn == 'matches' && <League editable={false} /> }
              { mainColumn == 'ranking' && <Ranking /> }
            </div>
          </div>
        </div>
      </MatchContext.Provider>
    </LeagueContext.Provider>
  )
}


export async function getStaticPaths() {
  const snapshot = await firebase.firestore().collection('leagues').limit(3).get();
  const paths = await snapshot.docs.map(doc => {
    return {params: {id: doc.id}}
  });

  return {
    paths,
    fallback: false,
  }
}


export async function getStaticProps({params}) {
  const leagueId = params.id;
  const doc = await firebase.firestore().collection('leagues').doc(leagueId).get();
  const leagueData = doc.data() || {};
  const league = Object.assign(leagueData, {id: leagueId});

  return {
    props: {
      initialLeague: league,
    }
  }
}
