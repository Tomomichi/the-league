import { useState, useContext, createContext } from 'react';
import { useRouter } from 'next/router'
import Link from 'next/link'
import { firebase } from '../../lib/firebase.js'
import { UserContext, LeagueContext, MatchContext } from '../../lib/contexts.js';
import Breadcrumb from '../../components/Breadcrumb.js'
import League from '../../components/leagues/League.js'
import Ranking from '../../components/leagues/Ranking.js'


export default function Show({initialLeague}) {
  const router = useRouter();
  const [user, setUser] = useContext(UserContext);
  const [league, setLeague] = useState(initialLeague);
  const [match, setMatch] = useState(false);
  const [mainColumn, setMainColumn] = useState('matches');

  const breadcrumbs = [
    { name: 'すべてのリーグ表', href: '/leagues' },
    { name: league.title },
  ];

  const deleteLeague = async () => {
    const conf = confirm('大会データを削除します。本当によろしいですか？');
    if(!conf) { return; }
    await firebase.firestore().collection('leagues').doc(league.id).delete();
    router.push('/');
  }

  return (
    <LeagueContext.Provider value={[league, setLeague]}>
      <MatchContext.Provider value={[match, setMatch]}>
        <Breadcrumb items={breadcrumbs} />

        <div>
          <h1 className="text-xl mb-6 py-2 border-t-4 border-b-4 border-gray-900 font-bold">{league.title}</h1>
          <div className="mb-20 text-sm">
            { user && user.uid == league.userId &&
              <>
                <Link href="/leagues/[...edit]" as={`/leagues/${league.id}/edit`}>
                  <a className="rounded border px-4 py-2 text-blue-600 border-blue-600 hover:opacity-75">
                    編集
                  </a>
                </Link>
                <a className="cursor-pointer rounded px-4 py-2 text-red-700 hover:opacity-75 ml-2" onClick={deleteLeague}>
                  削除
                </a>
              </>
            }
          </div>

          <div className="overflow-y-scroll">
            <div className="flex border-b mb-8">
              <div className={`px-6 pb-1 border-gray-700 ${mainColumn == 'matches' ? 'border-b-2' : 'cursor-pointer'}`} onClick={()=>setMainColumn('matches')}>対戦表</div>
              <div className={`px-6 pb-1 border-gray-700 ${mainColumn == 'ranking' ? 'border-b-2' : 'cursor-pointer'}`} onClick={()=>setMainColumn('ranking')}>順位表</div>
            </div>
            { mainColumn == 'matches' && <League editable={false} /> }
            { mainColumn == 'ranking' && <Ranking /> }
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
  const league = Object.assign(leagueData, {
    id: leagueId,
    createdAt: leagueData.createdAt.toDate().toISOString(),
    updatedAt: leagueData.updatedAt.toDate().toISOString(),
  });

  return {
    props: {
      initialLeague: league,
    }
  }
}
