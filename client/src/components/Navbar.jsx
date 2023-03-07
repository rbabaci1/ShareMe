import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdAdd, IoMdSearch } from 'react-icons/io';

const Navbar = ({ user, searchTerm, setSearchTerm }) => {
  const navigate = useNavigate();

  return (
    <div
      className='flex gap-2 md:gap-5 w-full p-5'
      style={{ boxShadow: '0 2px 2px -1px rgba(0, 0, 0, 0.05)' }}
    >
      <div className='flex justify-start items-center w-full px-2 rounded-md bg-gray-100 border-none outline-none focus-within:shadow-sm'>
        <IoMdSearch fontSize={22} className='ml-1' />
        <input
          type='text'
          onChange={e => setSearchTerm(e.target.value)}
          placeholder='Search'
          value={searchTerm}
          onFocus={() => navigate('/search')}
          className='p-2 bg-gray-100 w-full outline-none'
        />
      </div>

      <div className='flex gap-3 '>
        <Link
          to='/create_post'
          className='bg-black text-white rounded-full shadow-sm w-12 h-12 md:w-12 md:h-10 flex justify-center items-center'
        >
          <IoMdAdd />
        </Link>

        <Link to={`user_profile/${user?._id}`} className='hidden md:block'>
          <img
            src={user?.image}
            alt='user-pic'
            referrerPolicy='no-referrer'
            className='w-12 h-10 rounded-full shadow-sm '
          />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
