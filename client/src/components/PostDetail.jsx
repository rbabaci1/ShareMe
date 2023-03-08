import React, { useEffect, useState } from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { client, urlFor } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { useDispatch, useSelector } from 'react-redux';
import { addPostComment } from '../state';

const PostDetail = () => {
  const { postId } = useParams();
  const User = useSelector(state => state.user);
  const posts = useSelector(state => state.posts);
  const dispatch = useDispatch();

  const [filteredPosts, setFilteredPosts] = useState([]);
  const [postDetails, setPostDetails] = useState(null);
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);

  useEffect(() => {
    const findSelectedPost = () => {
      const postDetails = posts.find(post => post._id === postId);
      setPostDetails(postDetails);
    };

    const findRelatedPosts = () => {
      const relatedPosts = posts.filter(
        post =>
          post?.postedBy?._id === postDetails?.postedBy?._id &&
          post?._id !== postDetails?._id
      );

      setFilteredPosts(relatedPosts);
    };

    findSelectedPost();
    findRelatedPosts();
  }, [postId, posts, postDetails?._id, postDetails?.postedBy?._id]);

  const addComment = () => {
    if (comment) {
      setAddingComment(true);
      const _key = uuidv4();

      client
        .patch(postId)
        .setIfMissing({ comments: [] })
        .insert('after', 'comments[-1]', [
          {
            comment,
            _key,
            postedBy: { _type: 'postedBy', _ref: User?.googleId },
          },
        ])
        .commit()
        .then(() => {
          dispatch(
            addPostComment({
              postId: postDetails._id,
              comment: {
                comment,
                _key,
                postedBy: {
                  image: User?.imageUrl,
                  userName: User?.name,
                  _id: User?.googleId,
                },
              },
            })
          );
          setComment('');
          setAddingComment(false);
        });
    }
  };

  if (!postDetails) {
    return <Spinner message='Loading post...' />;
  }

  return (
    <>
      {postDetails && (
        <div
          className='flex xl:flex-row flex-col m-auto bg-white'
          style={{
            maxWidth: '1500px',
            borderRadius: '32px',
            marginTop: '100px',
          }}
        >
          <div className='flex justify-center items-center md:items-start flex-initial'>
            <img
              className='lg:rounded-2xl sm:rounded-t-2xl'
              src={postDetails?.image && urlFor(postDetails?.image).url()}
              alt='user-post'
            />
          </div>

          <div className='w-full p-5 flex-1 xl:min-w-620'>
            <div className='flex items-center justify-between'>
              <div className='flex gap-2 items-center'>
                <a
                  href={`${postDetails?.image.asset.url}?dl=`}
                  download
                  className='bg-secondaryColor p-2 text-xl rounded-full flex items-center justify-center text-dark opacity-75 hover:opacity-100'
                >
                  <MdDownloadForOffline />
                </a>
              </div>

              <a
                href={postDetails?.destination}
                target='_blank'
                rel='noreferrer'
                className='bg-gray-100 flex items-center gap-2 text-black font-bold p-1 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md'
              >
                <BsFillArrowUpRightCircleFill />
                {postDetails?.destination?.slice(8, 28)} ...
              </a>
            </div>

            <div>
              <h1 className='text-4xl font-bold break-words mt-3'>
                {postDetails?.title}
              </h1>
              <p className='mt-3'>{postDetails?.about}</p>
            </div>

            <Link
              to={`/user_profile/${postDetails?.postedBy._id}`}
              className='flex gap-2 mt-5 items-center bg-white rounded-lg '
            >
              <img
                src={postDetails?.postedBy.image}
                className='w-10 h-10 rounded-full'
                alt='user-profile'
              />
              <p className='font-bold'>{postDetails?.postedBy.userName}</p>
            </Link>

            <h2 className='mt-5 text-2xl'>Comments</h2>

            <div className='max-h-370 overflow-y-auto'>
              {postDetails?.comments?.map(item => (
                <div
                  className='flex gap-2 mt-5 items-center bg-white rounded-lg'
                  key={item.comment}
                >
                  <Link to={`/user_profile/${item.postedBy._id}`}>
                    <img
                      src={item.postedBy?.image}
                      className='w-10 h-10 rounded-full cursor-pointer'
                      alt='user-profile'
                    />
                  </Link>

                  <div className='flex flex-col'>
                    <p className='font-bold'>{item.postedBy?.userName}</p>
                    <p>{item.comment}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className='flex flex-wrap mt-6 gap-3'>
              <Link to={`/user_profile/${User?._id}`}>
                <img
                  src={User?.image}
                  className='w-10 h-10 rounded-full cursor-pointer'
                  alt='user-profile'
                />
              </Link>

              <input
                className=' flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300'
                type='text'
                placeholder='Add a comment'
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
              <button
                type='button'
                className='bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none'
                onClick={addComment}
              >
                {addingComment ? 'Commenting...' : 'Comment'}
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className='text-center w-full bg-white font-bold text-4xl rounded-2xl pt-4 pb-4 mt-14'>
        More like this
      </h1>

      {filteredPosts.length ? (
        <MasonryLayout posts={filteredPosts} />
      ) : (
        <h2 className='text-center text-2xl pt-5 pb-5'>No matching posts :(</h2>
      )}
    </>
  );
};

export default PostDetail;
