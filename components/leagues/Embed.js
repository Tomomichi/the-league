import { useState, createContext } from 'react'
import Link from 'next/link'
import { LeagueContext, MatchContext } from '../../lib/contexts.js';
import League from '../../components/leagues/League.js'
import Ranking from '../../components/leagues/Ranking.js'
import MatchModal from '../../components/leagues/MatchModal.js'

export default function Embed({initialLeague, visibleTables}) {
  const [league, setLeague] = useState(initialLeague);
  const [match, setMatch] = useState(false);
  const [activeTable, setactiveTable] = useState(visibleTables.includes("matches") ? 'matches' : 'ranking');

  return (
    <LeagueContext.Provider value={[league, setLeague]}>
      <MatchContext.Provider value={[match, setMatch]}>
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
              { visibleTables.length == 2 &&
                <div className="flex border-b mb-4">
                  <div className={`px-6 pb-1 border-gray-700 ${activeTable == 'matches' ? 'border-b-2' : 'cursor-pointer'}`} onClick={()=>setactiveTable('matches')}>対戦表</div>
                  <div className={`px-6 pb-1 border-gray-700 ${activeTable == 'ranking' ? 'border-b-2' : 'cursor-pointer'}`} onClick={()=>setactiveTable('ranking')}>順位表</div>
                </div>
              }
              { activeTable == 'matches' && <League editable={false} /> }
              { activeTable == 'ranking' && <Ranking /> }
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
