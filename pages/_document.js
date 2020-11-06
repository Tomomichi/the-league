import Document, { Head, Main, NextScript } from 'next/document'
import { GA_TRACKING_ID } from '../lib/gtag'

export default class MyDocument extends Document {
  render() {
    return (
      <html lang='ja'>
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          <meta name="keywords" content="リーグ戦,リーグ表,総当り,ラウンドロビン,THE TOURNAMENT,LEAGUE" />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="THE TOURNAMENT (LEAGUE) | 簡単・便利な総当りリーグ表作成サービス" />
          <meta property="og:locale" content="ja_JP" />
          <meta name="twitter:card" content="summary_large_image" />

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
