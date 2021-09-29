 import Layout from "../../components/layout";
import Box from "../../components/box";
import Article from "../../components/article";
import { TwitterTimelineEmbed } from "react-twitter-embed";
import { useRouter } from "next/router";
import Image from "next/image";
import { getAllArtistIds, getArtistData, getSpotifyArtistData } from "../../lib/artists";
import { GetServerSideProps, GetStaticPaths } from "next";
import { ARTIST, SPOTIFYARTIST } from "../../types/Types";

interface ARTISTSHOW {
  spotifyArtist: SPOTIFYARTIST;
  artist: ARTIST
}

const ArtistShow: React.FC<ARTISTSHOW> = ({ spotifyArtist, artist }) => {
  // ページが存在しないとき
  const router = useRouter();

  if (router.isFallback || !artist || !spotifyArtist.spotify_artist_info) {
    return <div>Loading...</div>;
  }
  const spotify_artist = spotifyArtist.spotify_artist_info;
  var artist_name = artist.name ? artist.name : spotify_artist.name

  // homepage link
  var url = artist.url;
  var hp_link =
    url !== "" ? (
      <a href={url} target="_blank" rel="noopener noreferrer" data-testid={`hp-${artist.name}`}>
        {artist.name}のホームページ
      </a>
    ) : (
      ""
    );

  // spotify music list
  const spority_music =
    spotify_artist.id !== "" ? (
      <iframe
        data-testid={`spotify-${artist.name}`}
        className="w-full"
        src={`https://open.spotify.com/embed/artist/${spotify_artist.id}`}
        width="300"
        height="400"
        frameBorder="0"
        allow="encrypted-media"
      ></iframe>
    ) : (
      ""
    );

  //news list
  var articleList = <></>;
  if (artist.articles != null && artist.articles.length !== 0) {
    articleList = (
      <article className="text-left mt-5">
        <h3>関連ニュース</h3>
        <ul className="list-none p-0" data-testid={`related_news-${artist.name}`}>
          {artist.articles && artist.articles.map((article) => <Article key={article.id} {...article} />)}
        </ul>
      </article>
    );
  }

  // youtube
  var youtubeSection = <></>;
  if (artist.youtubes != null && artist.youtubes.length !== 0) {
    youtubeSection = (
      <Box title="youtube" h={3} testId={`youtube-${artist.name}`}>
        {artist.youtubes.map((youtube, i) => (
          <li className="list-none mt-5" key={i}>
            <iframe className="w-full" title={`youtube${artist.name}_${i}`} id="ytplayer" src={`https://www.youtube.com/embed/${youtube.movie_id}`} frameBorder="0"></iframe>
          </li>
        ))}
      </Box>
    );
  }

  // twitter
  var twitter_id = artist.twitter_id;
  var twitter =
    twitter_id !== "" ? (
      <Box title="twitter" h={3} testId={`twitter-${artist.name}`}>
        <TwitterTimelineEmbed className="w-full" sourceType="profile" screenName={twitter_id} theme="dark" options={{ height: 450 }} />
      </Box>
    ) : (
      <></>
    );

  return (
    <Layout headTitle={artist_name} secondList="Artist" secondUrl="/artists/page/1" thirdList={artist_name}>
      <div className="grid grid-cols-3 gap-x-2">
        <div className="col-span-3 md:col-span-2">
          <Box title={artist_name}>
            <div className="grid grid-cols-2 gap-x-4">
              <div className="col-span-2 sm:col-span-1">
                <Image data-testid={`image-${artist.name}`} src={spotify_artist.images[0].url} alt={artist_name} width={320} height={320} />
                <p>{hp_link}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">{spority_music}</div>
            </div>
            {articleList}
          </Box>
        </div>
        <div className="col-span-3 md:col-span-1">
          {youtubeSection}
          {twitter}
        </div>
      </div>
    </Layout>
  );
};

export default ArtistShow;

// export const getStaticPaths: GetStaticPaths = async () => {
//   const paths = await getAllArtistIds();

//   return {
//     paths,
//     fallback: true,
//   };
// };

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const artist = await getArtistData(String(params.id));
  const spotifyArtist = await getSpotifyArtistData(String(params.id));
  return {
    props: {
      artist,
      spotifyArtist,
    }
  };
};
