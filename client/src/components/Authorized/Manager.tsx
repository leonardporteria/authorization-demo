import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '../ui/button';
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
} from '../ui/card';

const Manager = () => {
  const navigate = useNavigate();
  const fetchDownloadCalled = useRef(false);

  const fetchDownload = (operatingSystem: string) => {
    console.log('Fetching from server:', operatingSystem);

    if (fetchDownloadCalled.current) {
      return;
    }

    fetchDownloadCalled.current = true;

    fetch('api/manager')
      .then((res) => res.blob())
      .then((blob) => {
        const file = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = file;
        a.download = 'pup.bat';
        document.body.appendChild(a);
        a.click();
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
      fetch('api/manager')
        .then((res) => res.blob())
        .then((blob) => {
          const file = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = file;
          a.download = 'pup.bat';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(file);
          console.log('File Downloaded');
        });
    } else {
      fetch('api/manager')
        .then((res) => res.blob())
        .then((blob) => {
          const file = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = file;
          a.download = 'pup.sh';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(file);
          console.log('File Downloaded');
        });
    }
  }, []);

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex justify-between'>
        <h1 className='text-2xl font-bold'>Manager</h1>
        <Button onClick={handleLogout}>Log Out</Button>
      </div>

      <h1 className='text-2xl font-bold text-center'>
        Your Download should start automatically
      </h1>

      <div className='flex flex-col gap-16'>
        <h1 className='text-xl font-semibold text-center'>
          If you encounter issues, you may download the files manually
        </h1>

        <div className='flex justify-around'>
          <Card className='w-2/6'>
            <CardHeader>
              <CardTitle>Windows</CardTitle>
              <CardDescription>
                Download for Windows Operating System (.bat - batch file)
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Button asChild>
                <a
                  href='#'
                  onClick={() => {
                    fetchDownload('windows');
                  }}
                >
                  Download
                </a>
              </Button>
            </CardContent>
          </Card>
          <Card className='w-2/6'>
            <CardHeader>
              <CardTitle>MacOS</CardTitle>
              <CardDescription>
                Download for Mac Operating Syste (.sh - bash file)
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Button asChild>
                <a
                  href='#'
                  onClick={() => {
                    fetchDownload('mac');
                  }}
                >
                  Download
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Manager;
