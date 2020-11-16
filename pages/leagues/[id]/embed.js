import { useState } from 'react';
import { useRouter } from 'next/router'
import Head from 'next/head';
import Link from 'next/link'
import { firebase } from '../../../lib/firebase.js'
import Embed from '../../../components/leagues/Embed.js'


export default function Show({initialLeague, visibleTables}) {
  const router = useRouter();

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
  return <Embed initialLeague={initialLeague} visibleTables={visibleTables} />;
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
      visibleTables: ['matches', 'ranking'],
      noLayout: true,
    },
    revalidate: 60,
  }
}
