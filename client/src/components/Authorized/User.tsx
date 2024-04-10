import { useNavigate } from 'react-router-dom';

import { Button } from '../ui/button';

const User = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/authorized');
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex justify-between'>
        <h1 className='text-2xl font-bold'>User</h1>
        <Button onClick={handleLogout}>Log Out</Button>
      </div>
      <h1 className='text-2xl font-bold text-center'>
        You do not have enough permission.
      </h1>

      <div className='flex flex-col gap-16'>
        <h1 className='text-xl font-semibold text-center'>
          Your access is limited.
        </h1>
      </div>
    </div>
  );
};

export default User;
