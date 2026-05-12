import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetLoggedUser } from '../authorization';

function useRedirectWhenLoggedIn(redirectTo = '/dashboard') {
  const user = useGetLoggedUser();
  const navigate = useNavigate();
  const isLoggedIn = Boolean(user);

  useEffect(() => {
    if (user) {
      navigate(redirectTo);
    }
  }, []);

  return isLoggedIn;
}

export default useRedirectWhenLoggedIn;
