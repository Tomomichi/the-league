import Head from 'next/head';

export default function Error() {
  return (
    <>
      <Head>
        <title>404: This page could not be found. - THE LEAGUE</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="flex justify-center items-center my-64 divide-x">
        <span className="font-bold text-lg pr-4">404</span>
        <span className="text-sm pl-4">This page could not be found.</span>
      </div>
    </>
  );
}
