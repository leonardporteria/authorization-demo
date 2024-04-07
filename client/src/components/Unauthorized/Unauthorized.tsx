import { useEffect } from 'react';

import { Button } from '../ui/button';

const Unauthorized = () => {
  const fetchDownload = (operatingSystem: string) => {
    console.log('Fetching from server:', operatingSystem);

    // fetch('api/try')
    //   .then((res) => res.blob())
    //   .then((blob) => {
    //     const file = window.URL.createObjectURL(blob);
    //     const a = document.createElement('a');
    //     a.href = file;
    //     a.download = 'pup.bat';
    //     document.body.appendChild(a);
    //     a.click();
    //     window.URL.revokeObjectURL(file);
    //   });
  };

  useEffect(() => {
    if (navigator.userAgent.indexOf('Mac OS X') != -1) {
      fetchDownload('mac');
    } else {
      fetchDownload('windows');
    }
  }, []);

  return (
    <div>
      <h1>Your Download should start automatically</h1>

      <div>
        <h1>If you encounter issues, you may download the files manually</h1>
        <div>
          <div>
            <h1>Windows</h1>
            <Button asChild>
              <a href=''>Download</a>
            </Button>
          </div>
          <div>
            <h1>MacOS</h1>
            <Button asChild>
              <a href=''>Download</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
