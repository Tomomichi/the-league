import Document, { Head, Main, NextScript } from 'next/document'
import { GA_TRACKING_ID } from '../lib/gtag'

const baseUrl = 'https://the-league.vercel.app';

export default class MyDocument extends Document {
  render() {
    return (
      <html lang='ja'>
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          <meta name="description" content="THE TOURNAMENT(LEAGUE)は、簡単・便利な総当りのリーグ表作成サービスです。" />
          <meta name="keywords" content="リーグ戦,リーグ表,総当り,ラウンドロビン,THE TOURNAMENT,LEAGUE" />
          <meta property="og:title" content="THE TOURNAMENT (LEAGUE) | 簡単・便利な総当りリーグ表作成サービス" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={`${baseUrl}`} />
          <meta property="og:image" content={`${baseUrl}/images/ogp.png`} />
          <meta property="og:site_name" content="THE TOURNAMENT (LEAGUE) | 簡単・便利な総当りリーグ表作成サービス" />
          <meta property="og:description" content="THE TOURNAMENT(LEAGUE)は、簡単・便利な総当りのリーグ表作成サービスです。" />
          <meta property="og:locale" content="ja_JP" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:description" content="THE TOURNAMENT(LEAGUE)は、簡単・便利な総当りのリーグ表作成サービスです。" />
          <meta name="twitter:image:src" content={`${baseUrl}/images/ogp.png`} />

          {/* Google Analytics */}
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
