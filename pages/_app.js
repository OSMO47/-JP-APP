import '@/styles/globals.css';
import Head from 'next/head';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>JLPT Vocabulary Trainer</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="แอปฝึกคำศัพท์ภาษาญี่ปุ่นสำหรับการสอบ JLPT ระดับ N5, N4 และ N3"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
