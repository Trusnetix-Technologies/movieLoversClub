import Head from "next/head";
import Blog from "@/components/user/Blog";

export default function BlogPage() {
  return (
    <>
      <Head>
        <title>Spoiler Alert</title>
        <meta name="description" content="Spoiler Alert" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Blog />
    </>
  );
}
