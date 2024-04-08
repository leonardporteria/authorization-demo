import { BrowserRouter, Routes, Route, Link, useMatch } from 'react-router-dom';

import { ThemeProvider } from '@/components/theme-provider';
import { ModeToggle } from './components/ui/mode-toggle';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { GitHubLogoIcon } from '@radix-ui/react-icons';

import Authorized from './components/Authorized/Authorized';
import Unauthorized from './components/Unauthorized/Unauthorized';

interface NavLinkProps {
  to: string;
  label: string;
}

const NavLink = ({ to, label }: NavLinkProps) => {
  const match = useMatch(to);

  return (
    <Link
      to={to}
      className={match ? 'font-semibold underline underline-offset-4' : ''}
    >
      {label}
    </Link>
  );
};

function App() {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <BrowserRouter>
        <div className='flex justify-between items-center px-8 pb-8'>
          <h1 className='font-bold text-3xl'>Authorization Demo</h1>

          <div className='flex justify-around w-1/2'>
            <NavLink to='/' label='Home' />

            <NavLink to='/unauthorized' label='Unauthorized' />

            <NavLink to='/authorized' label='Authorized' />
          </div>

          <div className='flex justify-between w-20'>
            <ModeToggle />
            <Button variant='outline' size='icon' asChild>
              <a
                href='https://github.com/leonardporteria/credit-score-classifier'
                target='_blank'
              >
                <GitHubLogoIcon className='h-4 w-4' />
              </a>
            </Button>
          </div>
        </div>

        <Routes>
          <Route
            path='/'
            element={
              <div className='mx-8 p-8 h-full rounded-xl border flex flex-col gap-12'>
                <h1 className='text-3xl font-semibold text-center'>
                  Difference of{' '}
                  <span className='underline underline-offset-4 font-bold'>
                    WITH
                  </span>{' '}
                  and{' '}
                  <span className='underline underline-offset-4 font-bold'>
                    WITHOUT
                  </span>{' '}
                  Authorization.
                </h1>

                <div className='grid grid-cols-2 gap-8'>
                  <Card>
                    <CardHeader>
                      <CardTitle>Try Without Authorization</CardTitle>
                      <CardDescription>
                        Clicking on the link will automatically download a file
                        to your computer. Opening this file will direct you to
                        an unauthorized website, highlighting the risks
                        associated with unrestricted access.
                      </CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button variant='outline' className='w-44'>
                        <NavLink
                          to='/unauthorized'
                          label='Without Authorization'
                        />
                      </Button>
                    </CardFooter>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Try With Authorization</CardTitle>
                      <CardDescription>
                        Clicking on the link will prompt security features. It
                        shall check passwords, sessions, and user's role.
                        Witness how authorization measures enhance security and
                        protect systems from unauthorized access.
                      </CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button className='w-44'>
                        <NavLink to='/authorized' label='With Authorization' />
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            }
          />
          <Route
            path='/authorized'
            element={
              <div className='mx-8 p-8 h-full rounded-xl border '>
                <Authorized />
              </div>
            }
          />
          <Route
            path='/unauthorized'
            element={
              <div className='mx-8 p-8 h-full rounded-xl border '>
                <Unauthorized />
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
