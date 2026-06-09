import Head from 'next/head';

export default function Legal() {
  return (
    <>
      <Head>
        <title>Legal Information</title>
      </Head>
      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-4">Legal Information</h1>
        <p className="mb-4"><strong>Operator</strong><br />Mathis Gentine</p>
        <p className="mb-4"><strong>Contact</strong><br />mathis.gentine@gmail.com</p>
        <p>
        No personal information is stored or used by this website during your visit. Recently drawn songs or podcasts may be temporarily stored to enhance the app&apos;s functionality. If you contact me, your data will be stored only for the inquiry processing and will be deleted upon request.
        </p>
        <br /> 
        <p>
          This does not apply to the use of data by Spotify after you log in to your Spotify account.
          <br /> 
          <a href="https://www.spotify.com/legal/privacy-policy/" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
            Read more.
          </a>
        </p>
      </div>
    </>
  );
}
