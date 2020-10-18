import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Header from '../components/Header.js'
import "../styles/tailwind.css"

const App = ({ Component, pageProps }) => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>THE LEAGUE | 簡単・便利な総当りリーグ戦作成サービス</title>
      </Head>

      <div className="text-gray-700">
        <Header />

        <div className="max-w-screen-md mx-auto">
          <Component {...pageProps} />
        </div>

        { router.pathname != '/leagues/[...edit]' &&
          <footer className="bg-gray-900 text-gray-200 text-center py-12 mt-32">
            <div className="mb-4">
              <h5>
                <span className="text-lg">THE LEAGUE</span>
              </h5>
              <small className="text-xs text-gray-400">簡単・便利な総当りリーグ戦作成サービス</small>
            </div>
            <p className="text-sm text-gray-400">
              © 2020 THE LEAGUE by NOT SO BAD, LLC. All Rights Reserved.
            </p>
          </footer>
        }
      </div>

      <style global jsx>{`
        .full-bleed {
          width: 100vw;
          margin-left: 50%;
          transform: translateX(-50%);
        }
      `}</style>
    </>
  );
}

export default App
