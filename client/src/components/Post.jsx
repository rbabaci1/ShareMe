import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import {
  BsFillArrowUpRightCircleFill,
  BsSaveFill,
  BsSave,
} from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';

import { client, urlFor } from '../client';
import { addSavePost, removePost, removePostSave } from '../state';

const Post = ({ post: { postedBy, image, _id, destination, save } }) => {
  const [postHovered, setPostHovered] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const [unSavingPost, setUnSavingPost] = useState(false);
  const [deletingPost, setDeletingPost] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const User = useSelector(state => state.user);

  const alreadySaved = !!save?.filter(
    item => item?.postedBy?._id === User?.googleId
  )?.length;

  const savePost = () => {
    if (!alreadySaved) {
      setSavingPost(true);
      const _key = uuidv4();

      client
        .patch(_id)
        .setIfMissing({ save: [] })
        .insert('after', 'save[-1]', [
          {
            _key,
            userId: User?.googleId,
            postedBy: {
              _type: 'postedBy',
              _ref: User?.googleId,
            },
          },
        ])
        .commit()
        .then(() => {
          dispatch(
            addSavePost({
              postId: _id,
              save: {
                _key,
                postedBy: {
                  image: User?.imageUrl,
                  userName: User?.name,
                  _id: User?.googleId,
                },
              },
            })
          );
          setSavingPost(false);
        });
    }
  };

  const unSavePost = () => {
    setUnSavingPost(true);

    client
      .patch(_id)
      .unset([
        `save[${save?.findIndex(
          item => item?.postedBy?._id === User?.googleId
        )}]`,
      ])
      .commit()
      .then(() => {
        dispatch(
          removePostSave({
            postId: _id,
            saveIndex: save?.findIndex(
              item => item?.postedBy?._id === User?.googleId
            ),
          })
        );
        setUnSavingPost(false);
      });
  };

  const deletePost = () => {
    setDeletingPost(true);

    client.delete(_id).then(() => {
      dispatch(removePost({ postId: _id }));
      setDeletingPost(false);
    });
  };

  return (
    <div className='m-2'>
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/post_detail/${_id}`)}
        className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out'
      >
        <img
          className='rounded-lg w-full'
          src={urlFor(image).width(250).url()}
          alt='user-post'
        />

        {postHovered && (
          <div className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50'>
            <div className='flex items-center justify-between'>
              <div className='flex gap-2'>
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={e => e.stopPropagation()}
                  className='bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'
                >
                  <MdDownloadForOffline />
                </a>
              </div>

              <div className='bg-red-500 text-white font-bold px-5 py-1 text-base rounded-3xl'>
                {save?.length
                  ? save.length === 1
                    ? '1 Save'
                    : save.length + ' Saves'
                  : '0 Saves'}
              </div>
            </div>

            <div className=' flex justify-between items-center gap-2 w-full'>
              {destination && (
                <a
                  href={destination}
                  onClick={e => e.stopPropagation()}
                  target='_blank'
                  className='bg-white flex items-center gap-2 text-black font-bold p-1 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md'
                  rel='noreferrer'
                >
                  <BsFillArrowUpRightCircleFill />
                  {destination?.slice(8, 17)}...
                </a>
              )}

              {postedBy?._id === User?.googleId &&
                (deletingPost ? (
                  <div className='text-red-600'>Deleting...</div>
                ) : (
                  <button
                    type='button'
                    onClick={e => {
                      e.stopPropagation();
                      deletePost();
                    }}
                    className='bg-white p-2 rounded-full w-8 h-8 flex items-center justify-center text-dark opacity-75 hover:opacity-100 outline-none'
                  >
                    <AiTwotoneDelete />
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>

      <div className='flex relative'>
        <Link
          to={`/user_profile/${postedBy?._id}`}
          className='flex gap-2 mt-1.5 mb-3.5 items-center hover:scale-105 transition-all duration-200 ease-in-out'
        >
          <img
            className='w-8 h-8 rounded-full object-cover'
            src={postedBy?.image}
            alt='user-profile'
          />
          <p className='font-semibold capitalize'>{postedBy?.userName}</p>
        </Link>

        <div
          className='absolute cursor-pointer right-0 top-2.5'
          onClick={e => {
            e.stopPropagation();

            if (alreadySaved) {
              unSavePost();
            } else {
              savePost();
            }
          }}
        >
          {alreadySaved ? (
            unSavingPost ? (
              <div className='text-sm text-red-600'>UnSaving...</div>
            ) : (
              <BsSaveFill size={20} />
            )
          ) : savingPost ? (
            <div className='text-sm text-red-600'>Saving...</div>
          ) : (
            <BsSave size={20} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
