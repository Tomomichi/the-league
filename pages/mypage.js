import { useContext, useState, useEffect } from 'react'
import Head from 'next/head';
import Link from 'next/link'
import { useRouter } from 'next/router'
import { firebase, getLeagues } from '../lib/firebase.js'
import { UserContext } from '../lib/contexts.js'
import Breadcrumb from '../components/Breadcrumb.js'
import LeagueList from '../components/leagues/LeagueList.js'

const limit = 10;

export default function Mypage() {
  const router = useRouter();
  const [user, setUser] = useContext(UserContext);
  const [items, setItems] = useState([]);


  useEffect(() => {
    let ignore = false;
    if(!user) { return; }
    const fetchData = async () => {
      const res = await getLeagues({limit: limit, userId: user.uid});
      if(!ignore) { setItems(res); }
    }
    fetchData();
    return () => { ignore = true; }
  }, [user] )


  const createLeague = () => {
    const newRef = firebase.firestore().collection('leagues').doc();
    router.push(`/leagues/${newRef.id}/edit`);
  }

  const breadcrumbs = [
    { name: 'マイページ' },
  ];

  return (
    <>
      <Head>
        <title>マイページ - THE LEAGUE</title>
        <meta name="robots" content="noindex" />
      </Head>

      <Breadcrumb items={breadcrumbs} />

      <div>
        <div className="border-b mb-6">
          <h1 className="inline-block font-bold pb-1 border-b-2 pl-1 pr-6 border-gray-900">
            <div className="flex items-center">
              <svg className={`w-5 h-5 fill-current`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
              </svg>
              作成済みのリーグ表一覧
            </div>
          </h1>
        </div>

        <div>
          { user && items.length > 0 &&
            <LeagueList result={items} limit={10} />
          }

          { user && items.length == 0 &&
            <>
              <div className="mb-4 text-sm">※まだ作成済みのリーグ表がありません。</div>
              <button className="rounded bg-red-600 text-white px-4 py-2" onClick={createLeague}>リーグ表を作る</button>
            </>
          }
        </div>
      </div>
    </>
  )
}
