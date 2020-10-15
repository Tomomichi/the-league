import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/Header.js'
import "../styles/tailwind.css"

const App = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>リーグ</title>
      </Head>

      <div className="text-gray-700">
        <Header />
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default App
