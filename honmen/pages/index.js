import React, { useEffect, useRef, useState } from 'react';

import axios from 'axios';

import baseUrl from '../utils/baseUrl';

import CreatePost from '../components/Post/CreatePost';
import CardPost from '../components/Post/CardPost';
import { NoPosts } from '../components/Layout/NoData';
import { PostDeleteToastr } from '../components/Layout/Toastr';
import SocketHoc from '../components/SocketHoc';
import {
  PlaceHolderPosts,
  EndMessage,
} from '../components/Layout/PlaceHolderGroup';

import { Segment } from 'semantic-ui-react';

import { parseCookies } from 'nookies';

import InfiniteScroll from 'react-infinite-scroll-component';

import { Axios } from '../utils/postActions';

function Index({ user, postsData, errorLoading }) {
  const [posts, setPosts] = useState(postsData || []);
  const [showToastr, setShowToastr] = useState(false); // 大事

  // Infinite scrolling
  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(2);

  const socket = useRef();

  useEffect(() => {
    document.title = `Welcome, ${user.name.split(' ')[0]}`;
  }, []);

  useEffect(() => {
    showToastr && setTimeout(() => setShowToastr(false), 3000);
  }, [showToastr]);

  const fetchDataOnScroll = async () => {
    try {
      const res = await Axios.get('/', { params: { pageNumber } });

      if (res.data.length === 0) setHasMore(false);

      setPosts((prev) => [...prev, ...res.data]);
      setPageNumber((prev) => prev + 1);
    } catch (error) {
      alert('Error fetching posts.');
    }
  };

  return (
    <SocketHoc user={user} socket={socket}>
      {showToastr && <PostDeleteToastr />}

      <Segment>
        <CreatePost user={user} setPosts={setPosts} />

        {posts.length === 0 || errorLoading ? (
          <NoPosts />
        ) : (
          <InfiniteScroll
            hasMore={hasMore}
            next={fetchDataOnScroll}
            loader={<PlaceHolderPosts />} // チェックする
            endMessage={<EndMessage />}
            dataLength={posts.length}
          >
            {posts.map((post) => (
              <CardPost
                socket={socket}
                key={post._id}
                post={post}
                user={user}
                setPosts={setPosts}
                setShowToastr={setShowToastr}
              />
            ))}
          </InfiniteScroll>
        )}
      </Segment>
    </SocketHoc>
  );
}

// Index.getInitialProps = async (ctx) => {};
export const getServerSideProps = async (ctx) => {
  try {
    const { token } = parseCookies(ctx);

    const res = await axios.get(`${baseUrl}/api/posts`, {
      headers: { Authorization: token },
      params: { pageNumber: 1 },
    });

    return { props: { postsData: res.data } };
  } catch (error) {
    return { props: { errorLoading: true } };
  }
};

export default Index;
