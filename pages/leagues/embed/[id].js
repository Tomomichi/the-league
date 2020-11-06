import { useState, useContext, createContext } from 'react';
import { useRouter } from 'next/router'
import Head from 'next/head';
import Link from 'next/link'
import { firebase } from '../../../lib/firebase.js'
import { LeagueContext, MatchContext } from '../../../lib/contexts.js';
import League from '../../../components/leagues/League.js'
import Ranking from '../../../components/leagues/Ranking.js'
import MatchModal from '../../../components/leagues/MatchModal.js'


export default function Show({initialLeague}) {
  const router = useRouter();
  const [league, setLeague] = useState(initialLeague);
  const [match, setMatch] = useState(false);
  const [mainColumn, setMainColumn] = useState('matches');

  if (router.isFallback) {
    return(
      <>
        <div className="bg-black px-4 py-3 text-white flex w-full z-50">
          <h1>
            <div className="inline-block w-4 h-4 text-teal-500 fill-current mr-3 align-middle">
              <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"></path></svg>
            </div>
            <span className="align-middle">　</span>
          </h1>
        </div>

        <div className="mt-16 text-center">
          <div>Loading...</div>
        </div>
      </>
    )
  }

  return (
    <LeagueContext.Provider value={[league, setLeague]}>
      <MatchContext.Provider value={[match, setMatch]}>
        <Head>
          <title>{league.title} - THE LEAGUE</title>
          <link rel="canonical" href={`${process.env.NEXT_PUBLIC_WEB_ROOT}/leagues/${league.id}`} />
        </Head>

        <div className="m-1">
          <div className="p-1 border border-gray-900 bg-gray-900 text-white text-sm break-all">
            <h1 className="inline mr-2">
              <Link href='/leagues/[id]' as={`/leagues/${league.id}`}>
                <a className="hover:text-gray-200">{league.title}</a>
              </Link>
            </h1>
            <div className="text-xs inline">
              <span className="text-gray-500">powered by </span>
              <Link href='/'><a className="hover:text-gray-200">THE LEAGUE</a></Link>
            </div>
          </div>

          <div className="p-4 pt-8 border-r border-l border-b">
            <div className="overflow-y-scroll">
              <div className="flex border-b mb-4">
                <div className={`px-6 pb-1 border-gray-700 ${mainColumn == 'matches' ? 'border-b-2' : 'cursor-pointer'}`} onClick={()=>setMainColumn('matches')}>対戦表</div>
                <div className={`px-6 pb-1 border-gray-700 ${mainColumn == 'ranking' ? 'border-b-2' : 'cursor-pointer'}`} onClick={()=>setMainColumn('ranking')}>順位表</div>
              </div>
              { mainColumn == 'matches' && <League editable={false} /> }
              { mainColumn == 'ranking' && <Ranking /> }
              <MatchModal editable={false} />
            </div>

            <div className="bg-gray-800 text-white max-w-lg px-4 py-8 rounded text-center my-4">
              広告枠
            </div>
          </div>
        </div>
      </MatchContext.Provider>
    </LeagueContext.Provider>
  )
}


export async function getStaticPaths() {
  const snapshot = await firebase.firestore().collection('leagues').limit(30).get();
  const paths = await snapshot.docs.map(doc => {
    return {params: {id: doc.id}}
  });

  return {
    paths,
    fallback: true,
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
      noLayout: true,
    },
    unstable_revalidate: 60,
  }
}
