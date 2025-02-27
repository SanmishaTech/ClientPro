import React from 'react';
import { Link, useRouteError } from 'react-router-dom';
import errorImg from '../../assets/404.svg';
import basicError from '../../assets/error.svg';
const Error = () => {
  const error = useRouteError();

  if (error.status === 404) {
    return (
      <>
        <div className=" bg-gray-50 dark:bg-gray-900 flex justify-center items-center flex-col gap-4 min-h-screen">
          <img src={errorImg} className=" w-4/5 md:w-2/5" alt="" />
          <p className="font-bold leading-7 dark:text-white">
            We couldn't find the page you'r looking for.
          </p>
          <Link
            to="/"
            className="px-5 font-bold py-2 bg-sky-500 hover:bg-sky-600 text-white rounded"
          >
            Go Back Home
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex bg-gray-50 dark:bg-gray-900 justify-center items-center flex-col gap-5 min-h-screen">
        <img src={basicError} className="w-4/5 md:w-1/5" alt="" />
        <p className=" dark:text-white font-bold text-4xl leading-7">
          There was an error.
        </p>
        <Link to="/" className=" dark:text-white bg-sky-500 px-5 py-2 rounded">
          Go Back Home
        </Link>
      </div>
    </>
  );
};

export default Error;
