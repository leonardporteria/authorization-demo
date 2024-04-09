import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '../ui/button';

const User = () => {
  const navigate = useNavigate();
  const fetchDownloadCalled = useRef(false);

  const fetchDownload = (operatingSystem: string) => {
    console.log('Fetching from server:', operatingSystem);

    if (fetchDownloadCalled.current) {
      return;
    }

    fetchDownloadCalled.current = true;

    fetch('api/try')
      .then((res) => res.blob())
      .then((blob) => {
        const file = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = file;
        a.download = 'pup.bat';
        document.body.appendChild(a);
        // a.click();
        window.URL.revokeObjectURL(file);
        console.log('File Downloaded');
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/authorized');
  };

  useEffect(() => {
    if (navigator.userAgent.indexOf('Mac OS X') !== -1) {
      fetchDownload('mac');
    } else {
      fetchDownload('windows');
    }
  }, []);

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
          Your access i limited.
        </h1>
      </div>
    </div>
  );
};

export default User;
