import Login from '@/app/login/page';
import { useRouter } from 'next/navigation';

const PrivateRoute = (Component) => {
  const Auth = () => {
    const router = useRouter();
    if (typeof window != 'undefined' && localStorage.getItem('accessToken')) {
      return <Component />;
    }
    router.push('/login');
    return null;
  };
  return Auth;
};

export default PrivateRoute;
