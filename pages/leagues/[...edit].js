import { useState, useContext, createContext } from 'react';
import { useRouter } from 'next/router'
import Link from 'next/link'
import { firebase } from '../../lib/firebase.js'
import { UserContext, LeagueContext, MatchContext, MenuContext } from '../../lib/contexts.js';
import MenuColumn from '../../components/leagues/edit/MenuColumn.js'
import EditColumn from '../../components/leagues/edit/EditColumn.js'
import League from '../../components/leagues/League.js'
import Ranking from '../../components/leagues/Ranking.js'


export default function Index({initialLeague, initialPersisted}) {
  const router = useRouter();
  if (router.isFallback) {
    return(
      <div className="mt-16 text-center">
        <div>Loading...</div>
      </div>
    )
  }

  const [user, setUser] = useContext(UserContext);
  const [league, setLeague] = useState(initialLeague);
  const [match, setMatch] = useState(false);
  const [menu, setMenu] = useState({target: 'settings', opened: true});
  const [mainColumn, setMainColumn] = useState('matches');
  const [persisted, setPersisted] = useState(initialPersisted);


  const updateLeague = async () => {
    const ref = firebase.firestore().collection('leagues').doc(league.id);
    const dupLeague = Object.assign({}, league, {
      updatedAt: new Date(),
      createdAt: new Date(league.createdAt)
    });
    delete dupLeague.id;

    await ref.set(dupLeague);
    if(!persisted) { setPersisted(true); }
  }

  return (
    <LeagueContext.Provider value={[league, setLeague]}>
      <MatchContext.Provider value={[match, setMatch]}>
        <MenuContext.Provider value={[menu, setMenu]}>
          <div className="flex flex-col sm:flex-row leagueContainer full-bleed">
            <div className="bg-gray-800 text-white text-center text-xs -mt-px">
              <MenuColumn />
            </div>

            <div className={`px-4 sm:px-8 pt-8 bg-gray-200 sm:w-1/3 text-sm pb-8 sm:pb-24 mb-8 sm:mb-0 ${menu['opened'] ? '' : 'hidden'}`}>
              <EditColumn />
            </div>

            <div className="px-4 sm:px-12 pt-8 flex-1 overflow-y-scroll pb-24">
              <h1 className="text-lg mb-8">{league.title}</h1>
              <div>
                <div className="flex border-b mb-8">
                  <div className={`px-6 pb-1 border-gray-700 ${mainColumn == 'matches' ? 'border-b-2' : 'cursor-pointer'}`} onClick={()=>setMainColumn('matches')}>対戦表</div>
                  <div className={`px-6 pb-1 border-gray-700 ${mainColumn == 'ranking' ? 'border-b-2' : 'cursor-pointer'}`} onClick={()=>setMainColumn('ranking')}>順位表</div>
                </div>
                { mainColumn == 'matches' && <League editable={true} /> }
                { mainColumn == 'ranking' && <Ranking /> }
              </div>
            </div>
          </div>

          <div className="flex items-stretch fixed w-screen left-0 bottom-0 z-50 bg-white border-t px-4 py-1">
            <a className="rounded bg-red-600 text-white px-6 py-2 text-sm mr-8 hover:bg-red-700" onClick={updateLeague}>保存する</a>
            <Link href={ persisted ? '/leagues/[id]' : '/'} as={ persisted ? `/leagues/${league.id}` : '/'}>
              <a className="flex items-center text-sm hover:opacity-75">
                <svg className="w-4 h-4 fill-current mr-1" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="10 8.58578644 2.92893219 1.51471863 1.51471863 2.92893219 8.58578644 10 1.51471863 17.0710678 2.92893219 18.4852814 10 11.4142136 17.0710678 18.4852814 18.4852814 17.0710678 11.4142136 10 18.4852814 2.92893219 17.0710678 1.51471863 10 8.58578644"></polygon>
                </svg>
                閉じる
              </a>
            </Link>
          </div>

          <style jsx>{`
            @media (min-width: 640px) {
              .leagueContainer {
                height: calc(100vh - 40px);
              }
            }
          `}</style>
        </MenuContext.Provider>
      </MatchContext.Provider>
    </LeagueContext.Provider>
  )
}


export async function getStaticPaths() {
  const paths = [];

  return {
    paths,
    fallback: true,
  }
}


export async function getStaticProps({params}) {
  const leagueId = params.edit[0];
  const doc = await firebase.firestore().collection('leagues').doc(leagueId).get();
  const leagueData = doc.data() || defaultLeague();
  const league = Object.assign(leagueData, {
    id: leagueId,
    createdAt: leagueData.createdAt ? leagueData.createdAt.toDate().toISOString() : new Date().toISOString(),
    updatedAt: leagueData.updatedAt ? leagueData.updatedAt.toDate().toISOString() : new Date().toISOString(),
  });

  return {
    props: {
      initialLeague: league,
      persisted: !!doc.data(),
    }
  }
}


const defaultLeague = () => {
  const teams = [
    { name: 'PlayerA', id: Math.random().toString(36).substring(2) },
    { name: 'PlayerB', id: Math.random().toString(36).substring(2) },
    { name: 'PlayerC', id: Math.random().toString(36).substring(2) },
    { name: 'PlayerD', id: Math.random().toString(36).substring(2) },
  ];

  const teamIds = teams.map(t => t["id"]);
  let matches = [];
  teamIds.forEach((tId, tIndex) => {
    teamIds.forEach((cId, cIndex) => {
      if(tIndex >= cIndex ) { return; }
      matches.push({
        winner: null, finished: null, teams: {[tId]: {score: null}, [cId]: {score: null}}
      });
    });
  });

  return {
    teams: teams,
    matches: matches,
    // userId: user.id,
  };
}
