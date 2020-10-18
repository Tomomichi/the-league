import Link from 'next/link'
import { useRouter } from 'next/router'
import { firebase } from '../lib/firebase.js'

export default function Index() {
  const router = useRouter()

  const createLeague = () => {
    const newRef = firebase.firestore().collection('leagues').doc();
    router.push(`/leagues/${newRef.id}/edit`);
  }

  return (
    <div className="full-bleed">
      <div className="bg-gray-800 text-gray-100 -mt-px text-center py-20">
        <svg className={`w-24 h-24 text-orange-400 fill-current inline`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM7 10.82C5.84 10.4 5 9.3 5 8V7h2v3.82zM19 8c0 1.3-.84 2.4-2 2.82V7h2v1z"></path>
        </svg>
        <h1 className="text-3xl sm:text-6xl font-bold mb-2">THE LEAGUE</h1>
        <p className="mb-12">簡単・便利な総当たりリーグ戦作成ツールの決定版！</p>
        <div className="inline-block text-white bg-red-700 rounded px-12 py-3 hover:bg-red-600 cursor-pointer mb-2" onClick={createLeague}>
          リーグ戦を作成する
        </div>
        <p className="text-gray-200 text-xs">（ログインなしでも利用できます）</p>
      </div>
    </div>
  )
}
