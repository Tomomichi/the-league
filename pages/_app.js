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

      <Header />
      <div className="max-w-screen-lg mx-auto my-24 text-gray-700">
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default App
