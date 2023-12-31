import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Avatar,
} from '@chakra-ui/react';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import TextsmsOutlinedIcon from '@mui/icons-material/TextsmsOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Link,useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../utils/axios';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/authContext';
import moment from 'moment';
import Comments from './Comments';


const Post = ({ post, isCommentOpen }) => {
  const [commentOpen, setCommentOpen] = useState(isCommentOpen ? true : false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const { id } = useParams();
  console.log(id);

  const { data : pagePost} = useQuery(
    ['post', id],
    () => makeRequest.get(`/posts/${id}`).then((res) => res.data),
    { enabled: !post}
  );

  console.log(pagePost);
  if(!post) post = {...pagePost};


  const { isLoading:isLikeLoading, error, data } = useQuery({
    queryKey: ['likes', post?.id],
    queryFn: () =>
      makeRequest.get('/likes?postId=' + post?.id).then((res) => res.data),
  });

  const likeMutation = useMutation(
    (liked) => {
      if (liked) return makeRequest.delete('/likes?postId=' + post?.id);
      return makeRequest.post('/likes', { postId: post?.id });
    },
    {
      onMutate: (liked) => {
        // Optimistically update the UI
        queryClient.setQueryData(['likes', post?.id], (oldData) => {
          if (liked) {
            return oldData.filter((id) => id !== currentUser?.id);
          } else {
            return [...oldData, currentUser?.id];
          }
        });
      },
      onError: (error, liked, context) => {
        // Rollback the UI changes if the API request fails
        queryClient.setQueryData(['likes', post?.id], context.oldData);
      },
      onSettled: () => {
        // Refetch the likes after the mutation completes
        queryClient.invalidateQueries(['likes', post?.id]);
      },
    }
  );

  const deleteMutation = useMutation(
    (postId) => {
      return makeRequest.delete(`/posts/${postId}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['posts', 'user']);
        queryClient.refetchQueries();
      },
    }
  );

  const handleLike = async () => {
    likeMutation.mutate(data?.includes(currentUser?.id));
  };

  const handleDelete = async () => {
    deleteMutation.mutate(post?.id);
  };

  const renderLikeIcon = () => {
    if (!isLikeLoading && data?.includes(currentUser?.id)) {
      return <FavoriteOutlinedIcon style={{ color: '#ff6262' }} />;
    }
    return <FavoriteBorderOutlinedIcon />;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this post!',
          text: post?.desc,
          url: `${window.location.origin}/post/${post?.id}`,
        });
        console.log('Content shared successfully');
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      console.log('Web Share API is not supported in your browser.');
    }
  };

  return (
    <Box borderRadius="lg" border="1px solid #dcdcdc" bgColor="white" color="black" margin="20px" padding="20px">
      <Flex align="center" justify="space-between" p="4">
        <Flex align="center">
          <Avatar
            src={post?.userProfilePic}
            name={post?.userName}
            borderRadius="full"
            fit="cover"
            mr="4"
          />
          <Box>
            <Link to={{ pathname: `/profile/${post?.userId}` }}>
              <Text fontWeight="500">{post?.userName}</Text>
            </Link>
            <Text fontSize="sm" color="gray.500">
              {moment(post?.createdAt).fromNow()}
            </Text>
          </Box>
        </Flex>
        <IconButton
          icon={<MoreHorizIcon />}
          onClick={() => setMenuOpen(!menuOpen)}
          background="transparent" _hover={{ bg: 'transparent' }}
        />
        {menuOpen && post?.userId === currentUser?.id && (
          <Button onClick={handleDelete}>Delete</Button>
        )}
      </Flex>
      <Box p="4">
        <Text mt={4} mb={4}>{post?.desc}</Text>
        <Box>
          <LazyLoadImage
            effect="blur"
            src={post?.img}
            alt={post?.desc}
            fit="cover"
            mt="4"
          />
        </Box>
      </Box>
      <Flex justify="space-between" p="4">
        <Flex align="center" gap="4" onClick={handleLike} cursor="pointer">
          {renderLikeIcon()}
          <Text>{data?.length} Likes</Text>
        </Flex>
        <Flex
          align="center"
          gap="4"
          cursor="pointer"
          onClick={() => setCommentOpen(!commentOpen)}
        >
          <TextsmsOutlinedIcon />
          <Text>Comments</Text>
        </Flex>
        <Flex align="center" gap="4" onClick={handleShare} cursor="pointer">
          <ShareOutlinedIcon />
          <Text>Share</Text>
        </Flex>
      </Flex>
      {commentOpen && <Comments postId={post?.id} />}
    </Box>
  );
};

export default Post;
