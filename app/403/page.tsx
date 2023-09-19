const Forbidden403 = () => {
  return (
    <div className='h-screen w-full flex items-center justify-center bg-gray-100'>
      <div className='bg-white rounded-lg shadow-lg p-8 m-4 w-full sm:w-3/4 lg:w-1/2'>
        <h1 className='text-3xl font-bold mb-4'>403 - Forbidden</h1>
        <p className='text-gray-700 mb-4'>
          You do not have permission to access this page.
        </p>
        <div className='flex justify-center'>
          <button className='btn btn-primary btn-block'>Go to Homepage</button>
        </div>
      </div>
    </div>
  );
};

export default Forbidden403;
