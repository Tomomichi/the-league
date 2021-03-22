import { useState, useContext, createContext } from 'react';
import { useRouter } from 'next/router'
import Head from 'next/head';
import Link from 'next/link'
import reactStringReplace from "react-string-replace";
import { firebase } from '../../lib/firebase.js'
import { UserContext, LeagueContext, MatchContext } from '../../lib/contexts.js';
import Breadcrumb from '../../components/Breadcrumb.js'
import League from '../../components/leagues/League.js'
import Ranking from '../../components/leagues/Ranking.js'
import MatchModal from '../../components/leagues/MatchModal.js'


export default function Show({initialLeague}) {
  const router = useRouter();
  const [user, setUser] = useContext(UserContext);
  const [league, setLeague] = useState(initialLeague);
  const [match, setMatch] = useState(false);
  const [activeTable, setactiveTable] = useState('matches');
  const [descOpened, setDescOpened] = useState(false);

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

  const addLinkAndBreak = (str) => {
    return reactStringReplace(
      reactStringReplace(str, /(https?:\/\/\S+)/g, (match, i) => (
        <a href={match} target="_blank" className="text-blue-600 border-b border-blue-500">{match}</a>
      )),
      /(\r\n|\r|\n)/g, (match, i) => <br />);
  }

  const description = () => {
    if(!league.description || league.description == '') { return ; }

    const lines = league.description.split('\n');
    const sliceEnd = descOpened ? lines.length : 3;
    const str = lines.slice(0, sliceEnd).join('\n')

    return (
      <>
        { addLinkAndBreak(str) }

        { !descOpened && lines.length > 3 &&
          <>
            <p>...</p>
            <button className="mt-2 border-b border-dashed border-gray-700" onClick={() => { setDescOpened(true); }}>
              ▼ 続きを見る
            </button>
          </>
        }
        { descOpened &&
          <div>
            <button className="mt-6 border-b border-dashed border-gray-700" onClick={() => { setDescOpened(false); }}>
              ▲ 閉じる
            </button>
          </div>
        }
      </>
    );
  }

  const scaasUrl = `https://scaas.vercel.app/api/?url=${process.env.NEXT_PUBLIC_WEB_ROOT}/leagues/embed/${league.id}&slowMo=150&maxAge=3600`;

  return (
    <LeagueContext.Provider value={[league, setLeague]}>
      <MatchContext.Provider value={[match, setMatch]}>
        <Head>
          <title>{league.title} - THE TOURNAMENT(LEAGUE)</title>
          <meta property="og:title" content={`${league.title} - THE TOURNAMENT(LEAGUE)`} />
          <meta property="og:image" content={scaasUrl} />
          <meta name="twitter:image:src" content={scaasUrl} />

          { league.description && league.description != '' &&
            <>
              <meta name="description" content={league.description} />
              <meta property="og:description" content={league.description} />
              <meta name="twitter:description" content={league.description} />
            </>
          }
        </Head>

        <Breadcrumb items={breadcrumbs} />

        <div>
          <h1 className="text-xl mb-6 py-2 border-t-4 border-b-4 border-gray-900 font-bold">{league.title}</h1>
          { user && user.uid == league.userId &&
            <div className="mb-8 text-sm">
              <Link href="/leagues/[id]/edit" as={`/leagues/${league.id}/edit`}>
                <a className="rounded border px-4 py-2 text-blue-600 border-blue-600 hover:opacity-75">
                  編集
                </a>
              </Link>
              <a className="cursor-pointer rounded px-4 py-2 text-red-700 hover:opacity-75 ml-2" onClick={deleteLeague}>
                削除
              </a>
            </div>
          }
          <div className="mb-12 text-sm">
            { description() }
          </div>

          <div className="overflow-y-scroll">
            <div className="flex border-b mb-8">
              <div className={`px-6 pb-1 border-gray-700 ${activeTable == 'matches' ? 'border-b-2' : 'cursor-pointer'}`} onClick={()=>setactiveTable('matches')}>対戦表</div>
              <div className={`px-6 pb-1 border-gray-700 ${activeTable == 'ranking' ? 'border-b-2' : 'cursor-pointer'}`} onClick={()=>setactiveTable('ranking')}>順位表</div>
            </div>
            { activeTable == 'matches' && <League editable={false} /> }
            { activeTable == 'ranking' && <Ranking /> }
            <MatchModal editable={false} />
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
    },
    revalidate: 60,
  }
}
