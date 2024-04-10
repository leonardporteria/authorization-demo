import { useRef, useEffect } from 'react';

import { Button } from '../ui/button';
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
} from '../ui/card';

const Unauthorized = () => {
  const fetchDownloadCalled = useRef(false);

  const fetchDownload = () => {
    if (fetchDownloadCalled.current) {
      return;
    }

    fetchDownloadCalled.current = true;

    fetch('/api/public')
      .then((res) => res.blob())
      .then((blob) => {
        const file = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = file;
        a.download = 'pup-site-public.html';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(file);
        // console.log('File Downloaded');
      })
      .catch((error) => {
        console.error('Error downloading file:', error);
      });
  };

  useEffect(() => {
    fetchDownload();
  }, []);

  return (
    <div className='flex flex-col gap-4'>
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

export default Unauthorized;
