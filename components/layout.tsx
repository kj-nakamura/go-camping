import { useState, useEffect } from "react";
import Router from "next/router";
import Link from "next/link";
import Header from "./header";
import Head from "next/head";
import BreadCrumbs from "./breadcrumbs";

interface LAYOUT {
  home?: boolean;
  headTitle?: string;
  description?: string;
  imageUrl?: string;
  secondList?: string;
  secondUrl?: string;
  thirdList?: string;
}

const Layout: React.FC<LAYOUT> = ({ children, home, headTitle, description, imageUrl, secondList, secondUrl, thirdList }) => {
  // const [query, setQuery] = useState("");
  const [isLoading, setLoading] = useState(false);
  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);
  useEffect(() => {
    Router.events.on("routeChangeStart", startLoading);
    Router.events.on("routeChangeComplete", stopLoading);

    return () => {
      Router.events.off("routeChangeStart", startLoading);
      Router.events.off("routeChangeComplete", stopLoading);
    };
  }, []);

  const siteTitle: string = headTitle ? headTitle.slice(0, 25) + " | go-camping" : "go-camping | 全国のキャンプ場を探せるサイト";
  const siteDescription: string = description ? description : "全国のキャンプ場を探せるサイトです。";
  const imageURL: string = imageUrl ? imageUrl : `${process.env.NEXT_PUBLIC_RESTAPI_URL}images/profile.jpg`;

  return (
    <div className="p-0 m-0 font-sans text-2xl box-border">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
        <meta property="og:image" content={imageURL} />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Header />
      <BreadCrumbs home={home} secondList={secondList} secondUrl={secondUrl} thirdList={thirdList} />
      <main>
        <div className="max-w-7xl mx-auto py-6 px-2">
          {children}
          {!home && (
            <div className="cursor-pointer ml-8">
              <Link href="/">
                <a>← Back to home</a>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Layout;
