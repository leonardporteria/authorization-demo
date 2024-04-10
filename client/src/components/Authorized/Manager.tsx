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

  const downloadFile = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not available');
      return;
    }

    fetch('https://authorization-demo-80wf.onrender.com/api/manager', {
      headers: {
        Authorization: `${token}`,
      },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const file = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = file;
        a.download = 'pup-site.html';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(file);
        // console.log('File Downloaded');
      })
      .catch((error) => {
        console.error('Error downloading file:', error);
      });
  };

  const fetchDownload = () => {
    downloadFile();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/authorized');
  };

  useEffect(() => {
    if (fetchDownloadCalled.current) {
      return;
    }
    downloadFile();
    fetchDownloadCalled.current = true;
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
          <Card className='w-1/2'>
            <CardHeader>
              <CardTitle>Manually Download the File</CardTitle>
              <CardDescription>
                File that will redirect you to a website
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Button asChild>
                <a
                  href='#'
                  onClick={() => {
                    fetchDownload();
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
