import { useState, useEffect } from 'react';
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import * as Sentry from '@sentry/node';
import * as gtag from '../lib/gtag'
import { UserContext, SnackbarContext } from '../lib/contexts.js';
import { firebase } from '../lib/firebase.js';
import Header from '../components/Header.js'
import SnackbarProvider from 'react-simple-snackbar'
import "../styles/tailwind.css"


// Sentry
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    enabled: process.env.NODE_ENV === 'production',
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN
  });
}

const App = ({ Component, pageProps, err }) => {
  const router = useRouter();
  const [user, setUser] = useState();

  firebase.auth().onAuthStateChanged((u) => {
    setUser(u);
  })

  useEffect(() => {
    // Google Analytics
    const handleRouteChange = (url) => {
      gtag.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, []);


  return pageProps.noLayout ? (
      <>
        <Head>
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        </Head>
        <Component {...pageProps} err={err} />
      </>
    ) : (
      <UserContext.Provider value={[user, setUser]}>
        <SnackbarProvider>
          <Head>
            <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
          </Head>

          <div className="text-gray-700">
            <Header />

            <div className="max-w-screen-lg mx-auto px-4 sm:px-0">
              <Component {...pageProps} err={err} />
            </div>

            { router.pathname != '/leagues/[...edit]' &&
              <footer className="bg-gray-900 text-gray-200 text-center py-12 mt-32">
                <div className="max-w-screen-lg mx-auto px-4 sm:px-0">
                  <div className="mb-4">
                    <h5>
                      <Link href="/">
                        <a className="mb-2 flex items-center flex-col sm:flex-row justify-center">
                          <span className="text-lg font-bold">THE TOURNAMENT</span>
                          <span className="rounded bg-orange-600 text-white text-xs px-2 py-1 ml-2">LEAGUE</span>
                        </a>
                      </Link>
                    </h5>
                    <small className="text-xs text-gray-500">簡単・便利な総当りリーグ表作成サービス</small>
                  </div>

                  <ul className="flex flex-col sm:flex-row justify-center sm:space-x-4 text-sm mb-4 text-gray-300">
                    <li><a href="https://app.the-tournament.jp/pages/terms.html" target="_blank" className="hover:text-white">利用規約</a></li>
                    <li><a href="https://app.the-tournament.jp/pages/privacy.html" target="_blank" className="hover:text-white">プライバシーポリシー</a></li>
                    <li><a href="https://notsobad.jp" target="_blank" className="hover:text-white">運営</a></li>
                    <li><a href="https://goo.gl/forms/xqvYet0AAsQUalI52" target="_blank" className="hover:text-white">お問い合わせ</a></li>
                  </ul>
                  <p className="text-sm text-gray-500">
                    © 2020 THE TOURNAMENT by NOT SO BAD, LLC. All Rights Reserved.
                  </p>
                </div>
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
        </SnackbarProvider>
      </UserContext.Provider>
    );
}

export default App
