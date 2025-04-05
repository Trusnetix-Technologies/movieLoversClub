import Head from "next/head";
import Login from "@/components/Login";

export default function Home() {
  return (
    <>
      <Head>
        <title>Spoiler Alert</title>
        <meta name="description" content="Spoiler Alert" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Login />
    </>
  );
}
