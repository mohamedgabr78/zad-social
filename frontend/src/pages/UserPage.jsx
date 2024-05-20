import { useEffect, useState } from 'react';
import UserHeader from '../components/UserHeader';
import { useParams } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';
import { Flex, Spinner } from '@chakra-ui/react';
import Post from '../components/Post';

const UserPage = () => {
  const [users, setUsers] = useState(null);
  const { username } = useParams();
  const showToast = useShowToast();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [fetchingPosts, setFetchingPosts] = useState(true);  

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        if (data.error) {
          showToast('Error', data.error, 'error');
          return;
        }
        setUsers(data);
      } catch (error) {
        showToast('Error', error.message, 'error');
      } finally {
        setLoading(false);
      }
    };

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
        setLoading(false);
        setFetchingPosts(false);
      }
    };

    setLoading(true); // Start loading before fetching data
    getUser();
    getUserPosts();
  }, [username, showToast]);

  if (loading) {
    return (
      <Flex justify='center'>
        <Spinner size={'xl'} />
      </Flex>
    );
  }

  if (!users && !loading) return <h1>User not found</h1>;

  return (
    <>
      {users && <UserHeader user={users} />}

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
