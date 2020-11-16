import { useState } from 'react';
import { useRouter } from 'next/router'
import Head from 'next/head';
import Link from 'next/link'
import { firebase } from '../../../../lib/firebase.js'
import Embed from '../../../../components/leagues/Embed.js'


export default function Show({initialLeague, visibleTables}) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>
  }
  return <Embed initialLeague={initialLeague} visibleTables={visibleTables} />;
}


export async function getStaticPaths() {
  // const snapshot = await firebase.firestore().collection('leagues').limit(30).get();
  // const paths = await snapshot.docs.map(doc => {
  //   return {params: {id: doc.id}}
  // });
  const paths = [];

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
      visibleTables: ['ranking'],
      noLayout: true,
    },
    revalidate: 60,
  }
}
