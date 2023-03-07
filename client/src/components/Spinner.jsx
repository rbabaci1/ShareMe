import React from 'react';
import { Circles } from 'react-loader-spinner';

const Spinner = ({ message = '' }) => {
  return (
    <div
      className='flex flex-col w-full justify-center items-center'
      style={{ height: '80vh' }}
    >
      <Circles
        height='75'
        width='75'
        color='#f04444'
        ariaLabel='circles-loading'
        visible={true}
      />
      <p className='text-lg text-red-600 mt-2'>{message}</p>
    </div>
  );
};

export default Spinner;
