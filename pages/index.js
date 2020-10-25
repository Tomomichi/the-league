import { useState, createContext } from 'react';
import Link from 'next/link'
import { useRouter } from 'next/router'
import { firebase } from '../lib/firebase.js'
import { LeagueContext, MatchContext } from '../lib/contexts.js';
import League from '../components/leagues/League.js'
import Ranking from '../components/leagues/Ranking.js'

export default function Index() {
  const router = useRouter();

  const createLeague = () => {
    const newRef = firebase.firestore().collection('leagues').doc();
    router.push(`/leagues/${newRef.id}/edit`);
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
    };
  }

  const [league, setLeague] = useState(defaultLeague);
  const [match, setMatch] = useState(false);
  const [mainColumn, setMainColumn] = useState('matches');


  return (
    <LeagueContext.Provider value={[league, setLeague]}>
      <MatchContext.Provider value={[match, setMatch]}>
        <div className="full-bleed bg-yellow-100 px-4 py-3 text-yellow-900 text-xs sm:text-sm">
          <svg className={`inline-block mr-1 w-5 h-5 fill-current`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"></path>
          </svg>
          <span className="flex-1">THE LEAGUEは現在「先行お試し版」として試験運用中です。本リリース時にデータがリセットされる可能性がありますので、あらかじめご了承ください。</span>
        </div>

        <div className="full-bleed bg-gray-800 text-gray-200 mb-20 text-center px-4">
            <div className="py-10">
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                THE LEAGUE
              </h1>
              <p className="mb-8 text-sm">簡単・便利な総当たりリーグ表作成ツールの決定版！</p>
              <div className="sm:inline-block text-white bg-red-700 rounded px-12 py-3 hover:bg-red-600 cursor-pointer mb-2" onClick={createLeague}>
                リーグ表を作成する
              </div>
              <p className="text-gray-400 text-xs">（ログインなしでも利用できます）</p>
            </div>
        </div>

        <div className="mb-32">
          <div className="text-center mb-6">
            <h3 className="inline-block text-lg font-bold pb-2 border-b-4 border-gray-700">
              利用イメージ
            </h3>
          </div>

          <div className="text-sm mb-12 text-center">
            組合せ部分をクリックすると試合結果を入力できます。
            また試合結果に応じて順位表が自動で更新されます。
            <br />
            <a onClick={createLeague} className="cursor-pointer border-b border-blue-500 text-blue-600 hover:opacity-75">実際の編集画面</a>
            ではさらに詳細な設定も可能です。
          </div>

          <div className="overflow-y-scroll">
            <div className="flex border-b mb-6">
              <div className={`px-6 pb-1 border-gray-700 ${mainColumn == 'matches' ? 'border-b-2' : 'cursor-pointer'}`} onClick={()=>setMainColumn('matches')}>対戦表</div>
              <div className={`px-6 pb-1 border-gray-700 ${mainColumn == 'ranking' ? 'border-b-2' : 'cursor-pointer'}`} onClick={()=>setMainColumn('ranking')}>順位表</div>
            </div>
            { mainColumn == 'matches' && <League editable={true} /> }
            { mainColumn == 'ranking' && <Ranking /> }
          </div>
        </div>

        <div className="full-bleed bg-gray-100 py-16 mb-24">
          <div className="max-w-screen-lg mx-auto px-4 sm:px-0">
            <div className="text-center mb-8">
              <h3 className="inline-block text-lg font-bold pb-2 border-b-4 border-gray-700">
                機能一覧（予定）
              </h3>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 text-sm mb-8">
              <div className="bg-white border rounded px-2 py-3">試合順の自動生成</div>
              <div className="bg-white border rounded px-2 py-3">独自ランキングロジック</div>
              <div className="bg-white border rounded px-2 py-3">外部サイト埋め込み</div>
              <div className="bg-white border rounded px-2 py-3">文字でのスコア登録</div>
              <div className="bg-white border rounded px-2 py-3">参加者シャッフル</div>
              <div className="bg-white border rounded px-2 py-3">参加者の所属表示</div>
              <div className="bg-white border rounded px-2 py-3">スコアなし（勝敗のみ記録）</div>
              <div className="bg-white border rounded px-2 py-3">画像ダウンロード</div>
              <div className="bg-white border rounded px-2 py-3">API連携</div>
              <div className="bg-white border rounded px-2 py-3">デザインカスタマイズ</div>
              <div className="bg-white border rounded px-2 py-3">選手の顔写真表示</div>
              <div className="bg-white border rounded px-2 py-3">試合詳細コメント</div>
              <div className="bg-white border rounded px-2 py-3">OEM提供</div>
            </div>
            <div className="text-center">
              <div className="text-sm mb-4">ここにない機能のご利用を検討されている方は、以下のフォームからお気軽にお問い合わせください。</div>
              <a href="https://goo.gl/forms/xqvYet0AAsQUalI52" target="_blank" className="bg-blue-600 text-white rounded px-4 py-2 block sm:inline-block">お問い合わせフォーム</a>
            </div>
          </div>
        </div>

        <div className="mb-32">
          <div className="text-center mb-12">
            <h3 className="inline-block text-lg font-bold pb-2 border-b-4 border-gray-700">
              今後の開発ロードマップ
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row">
            <div className="border rounded flex-1 p-4 text-center">
              <svg className={`inline-block mb-2 w-8 h-8 fill-current`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2V9h-2V7h4v10z"></path>
              </svg>
              <h5 className="font-bold mb-1">
                先行お試し版
                <span className="font-normal bg-orange-500 rounded text-white text-xs p-1 ml-2">Now!</span>
              </h5>
              <div className="text-sm text-left">
                バグや未実装の機能があるほか、データが失われる可能性もあります。
                <br />
                基本的な機能はすでに使えますので、気軽な大会などでぜひお試しください。
              </div>
            </div>

            <div className="mx-2 self-center">
              <svg className={`hidden sm:block w-6 h-6 fill-current`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
              </svg>
              <svg className={`block sm:hidden w-6 h-6 fill-current`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"></path>
              </svg>
            </div>

            <div className="border rounded flex-1 p-4 text-center">
              <svg className={`inline-block mb-2 w-8 h-8 fill-current`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 8c0 1.11-.9 2-2 2h-2v2h4v2H9v-4c0-1.11.9-2 2-2h2V9H9V7h4c1.1 0 2 .89 2 2v2z"></path>
              </svg>
              <h5 className="mb-2 font-bold">BETA版</h5>
              <div className="text-sm text-left">
                一通りのバグ修正と機能実装の完了後、ベータ版としてリリースします。
                <br />
                これ以降はデータが失われることはありませんので安心してご利用ください。
              </div>
            </div>

            <div className="mx-2 self-center">
              <svg className={`hidden sm:block w-6 h-6 fill-current`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
              </svg>
              <svg className={`block sm:hidden w-6 h-6 fill-current`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"></path>
              </svg>
            </div>

            <div className="border rounded flex-1 p-4 text-center">
              <svg className={`inline-block mb-2 w-8 h-8 fill-current`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.01 3h-14c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 7.5c0 .83-.67 1.5-1.5 1.5.83 0 1.5.67 1.5 1.5V15c0 1.11-.9 2-2 2h-4v-2h4v-2h-2v-2h2V9h-4V7h4c1.1 0 2 .89 2 2v1.5z"></path>
              </svg>
              <h5 className="mb-2 font-bold">本リリース</h5>
              <div className="text-sm text-left">
                サービスが安定したら、さらに高度な機能を有料版として追加し、本リリースします。
                <br />
                またこの時点でトーナメント表作成サービスと統合する予定です（次項参照）。
              </div>
            </div>
          </div>
        </div>

        <div className="full-bleed bg-gray-100 py-16">
          <div className="max-w-screen-lg mx-auto px-4 sm:px-0">
            <div className="text-center mb-8">
              <h3 className="inline-block text-lg font-bold pb-2 border-b-4 border-gray-700">
                トーナメント表の作成はこちら
              </h3>
            </div>
            <div className="text-center">
              <div className="text-sm mb-4">
                トーナメント表の作成をご希望の場合は、日本最大のトーナメント作成サービス「THE TOURNAMENT」をご利用ください。
                <br />
                「THE LEAGUE」はこちらの姉妹サービスとして開発しており、将来的にトーナメント表・リーグ表どちらも作れるサービスとして統合する予定です。
              </div>
              <div className="text-center">
                <a href="https://the-tournament.jp" target="_blank" className="bg-blue-600 text-white rounded px-4 py-2 block sm:inline-block">
                  トーナメント表を作成する
                  <svg className={`inline-block ml-1 w-5 h-5 fill-current`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path>
                  </svg>
                </a>
                <div className="text-xs mt-2">（THE TOURNAMENTのサイトに移動します）</div>
              </div>
            </div>
          </div>
        </div>
      </MatchContext.Provider>
    </LeagueContext.Provider>
  )
}
