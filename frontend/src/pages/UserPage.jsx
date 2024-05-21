import { useEffect, useState } from 'react';
import UserHeader from '../components/UserHeader';
import { useParams } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';
import { Flex, Spinner } from '@chakra-ui/react';
import Post from '../components/Post';
import useGetProfile from '../hooks/useGetProfile';

const UserPage = () => {
  const { user, loading } = useGetProfile();
  const { username } = useParams();
  const showToast = useShowToast();
  const [posts, setPosts] = useState([]);
  const [fetchingPosts, setFetchingPosts] = useState(true);  

  useEffect(() => {

    const getUserPosts = async () => {
			setFetchingPosts(true);
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        if (data.error) {
          showToast('Error', data.error, 'error');
          return;
        }
        setPosts(data);
      } catch (error) {
        showToast('Error', error.message, 'error');
        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }
    };
    getUserPosts();
  }, [username, showToast]);

  if (loading) {
    return (
      <Flex justify='center'>
        <Spinner size={'xl'} />
      </Flex>
    );
  }

  if (!user && !loading) return <h1>User not found</h1>;

  return (
    <>
      {user && <UserHeader user={user} />}

      {!fetchingPosts && posts?.length === 0 && (
        <Flex justifyContent='center'>
          <h1>No posts to show</h1>
        </Flex>
      )}
      {fetchingPosts && (
        <Flex justifyContent='center' my={12}>
          <Spinner size='xl' />
        </Flex>
      )}
      {posts?.map((post) => (
        <Post
          key={post._id}
          post={post}
          postedBy={post.postedBy}
        />
      ))}
    </>
  );
};

export default UserPage;
