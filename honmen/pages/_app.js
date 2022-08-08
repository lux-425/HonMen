import Head from 'next/head';

import axios from 'axios';

import { parseCookies, destroyCookie } from 'nookies';

import baseUrl from '../utils/baseUrl';
import { redirectUser } from '../utils/authUser';

import Layout from '../components/Layout/Layout';

import 'semantic-ui-css/semantic.min.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta charSet="UTF-8" />
        <title>『本面』</title>
      </Head>
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

MyApp.getInitialProps = async ({ Component, ctx }) => {
  const { token } = parseCookies(ctx);

  let pageProps = {};

  const protectedRoutes = // 大事
    ctx.pathname === '/' ||
    ctx.pathname === '/[username]' ||
    ctx.pathname === '/notifications' ||
    ctx.pathname === '/post/[postId]' ||
    ctx.pathname === '/messages' ||
    ctx.pathname === '/search';

  if (!token) {
    protectedRoutes && redirectUser(ctx, '/login');
  } else {
    try {
      const getFollowingData =
        ctx.pathname === '/notifications' || ctx.pathname === '/[username]';

      const res = await axios.get(`${baseUrl}/api/auth`, {
        headers: { Authorization: token, getFollowingData },
        params: { getFollowingData },
      });

      const { user, userFollowStats } = res.data;

      if (user) !protectedRoutes && redirectUser(ctx, '/'); // 大切

      pageProps.user = user; // 再大切
      pageProps.userFollowStats = userFollowStats;
    } catch (error) {
      destroyCookie(ctx, 'token');
      redirectUser(ctx, '/login');
    }
  }

  return { pageProps };
};

export default MyApp;
