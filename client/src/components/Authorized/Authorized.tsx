import { useState, useEffect } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useToast } from '@/components/ui/use-toast';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '../ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import Admin from './Admin';
import Manager from './Manager';
import User from './User';

const Authorized = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [loginMode, setLoginMode] = useState('user');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  interface TokenPayload {
    username: string;
    password: string;
    role: string;
  }

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken = jwtDecode<TokenPayload>(token);
      const userRole = decodedToken.role;
      setLoginMode(userRole);

      if (userRole !== loginMode) {
        const redirectPath =
          decodedToken.role === 'admin'
            ? '/authorized/'
            : `/authorized/${decodedToken.role}`;
        navigate(redirectPath);
      } else if (
        loginMode === 'admin' &&
        location.pathname.startsWith('/admin')
      ) {
        return;
      } else if (
        loginMode === 'manager' &&
        location.pathname.startsWith('/manager')
      ) {
        return;
      } else {
        const redirectPath = `/authorized/${userRole}`;
        navigate(redirectPath);
      }
    } else {
      navigate('/authorized');
    }
  }, [navigate, location.pathname, loginMode]);

  const handleLogin = async (usernameValue: string, passwordValue: string) => {
    setUsername(usernameValue);
    setPassword(passwordValue);

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, role: loginMode }),
      });

      if (response.ok) {
        const data = await response.json();
        const { token } = data;

        localStorage.setItem('token', token);

        const decodedToken = jwtDecode<TokenPayload>(token);
        const redirectPath =
          decodedToken.role === 'admin'
            ? '/authorized/admin'
            : `/authorized/${decodedToken.role}`;

        navigate(redirectPath);
      } else {
        toast({
          variant: 'destructive',
          title: 'Unauthorized Login',
          description: 'Wrong Credentials',
        });
      }
    } catch (error) {
      alert(error);
      console.error('Error during authentication:', error);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setPassword(e.target.value);
  };

  const shouldRenderLogin =
    !localStorage.getItem('token') ||
    (!location.pathname.startsWith('/authorized/admin') &&
      !location.pathname.startsWith('/authorized/manager') &&
      !location.pathname.startsWith('/authorized/user') &&
      location.pathname !== '/*');

  return (
    <div className='flex align-middle justify-center'>
      {shouldRenderLogin && (
        <Tabs defaultValue='user' className='w-[400px]'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger
              value='user'
              onClick={() => {
                setLoginMode('user');
              }}
            >
              User
            </TabsTrigger>
            <TabsTrigger
              value='manager'
              onClick={() => {
                setLoginMode('manager');
              }}
            >
              Manager
            </TabsTrigger>
            <TabsTrigger
              value='admin'
              onClick={() => {
                setLoginMode('admin');
              }}
            >
              Admin
            </TabsTrigger>
          </TabsList>

          <TabsContent value='user'>
            <Card>
              <CardHeader>
                <CardTitle>User Login</CardTitle>
                <CardDescription>
                  Don't have an account? Contact your Manager.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-2'>
                <div className='space-y-1'>
                  <Label htmlFor='name'>Email</Label>
                  <Input
                    id='name'
                    placeholder='Enter Email Address'
                    type='email'
                    onChange={(e) => {
                      handleUsernameChange(e);
                    }}
                  />
                </div>
                <div className='space-y-1'>
                  <Label htmlFor='username'>Password</Label>
                  <Input
                    id='username'
                    placeholder='Enter Password'
                    type='password'
                    onChange={(e) => {
                      handlePasswordChange(e);
                    }}
                  />
                </div>
                <CardDescription className='flex gap-2'>
                  Forgot password?{' '}
                  <a href='#' className='underline'>
                    Click Here
                  </a>
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => {
                    setLoginMode('user');
                    handleLogin(username, password);
                  }}
                >
                  Login
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value='manager'>
            <Card>
              <CardHeader>
                <CardTitle>Manager Login</CardTitle>
                <CardDescription>
                  Having issues? Contact an Admin.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-2'>
                <div className='space-y-1'>
                  <Label htmlFor='name'>Email</Label>
                  <Input
                    id='name'
                    placeholder='Enter Email Address'
                    type='email'
                    onChange={(e) => {
                      handleUsernameChange(e);
                    }}
                  />
                </div>
                <div className='space-y-1'>
                  <Label htmlFor='username'>Password</Label>
                  <Input
                    id='username'
                    placeholder='Enter Password'
                    type='password'
                    onChange={(e) => {
                      handlePasswordChange(e);
                    }}
                  />
                </div>
                <CardDescription className='flex gap-2'>
                  Forgot password?
                  <a href='#' className='underline'>
                    Click Here
                  </a>
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => {
                    setLoginMode('manager');
                    handleLogin(username, password);
                  }}
                >
                  Login
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value='admin'>
            <Card>
              <CardHeader>
                <CardTitle>Admin Login</CardTitle>
                <CardDescription>
                  Having issues? Request reset key from other Admin.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-2'>
                <div className='space-y-1'>
                  <Label htmlFor='name'>Email</Label>
                  <Input
                    id='name'
                    placeholder='Enter Email Address'
                    type='email'
                    onChange={(e) => {
                      handleUsernameChange(e);
                    }}
                  />
                </div>
                <div className='space-y-1'>
                  <Label htmlFor='username'>Password</Label>
                  <Input
                    id='username'
                    placeholder='Enter Password'
                    type='password'
                    onChange={(e) => {
                      handlePasswordChange(e);
                    }}
                  />
                </div>
                <CardDescription className='flex gap-2'>
                  Forgot account?{' '}
                  <a href='#' className='underline'>
                    Click Here
                  </a>
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => {
                    setLoginMode('admin');
                    handleLogin(username, password);
                  }}
                >
                  Login
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      <Routes>
        <Route path='/user' element={<User />} />
        <Route path='/manager' element={<Manager />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/' element={<div></div>} />
      </Routes>
    </div>
  );
};

export default Authorized;
