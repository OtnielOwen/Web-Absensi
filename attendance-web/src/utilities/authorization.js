import { useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CONSTANT, { ROLE_KEYS } from './constant';
import useMutationSubmit from './hooks/useMutationSubmit';

export const setUserData = (user) => {
  localStorage.setItem(CONSTANT.USER_ATTRIBUTES, user ? JSON.stringify(user) : null);
};

const setAuthData = (token, user) => {
  localStorage.setItem(CONSTANT.ACCESS_TOKEN, token || null);
  setUserData(user);
};

export const getAuthHeader = () => ({
  'x-auth-token': localStorage.getItem(CONSTANT.ACCESS_TOKEN),
});

export const getUser = () => {
  const user = localStorage.getItem(CONSTANT.USER_ATTRIBUTES);
  return user ? JSON.parse(user) : null;
};

export const useLoginSuccessNavigate = () => {
  const navigate = useNavigate();

  return (data) => {
    if (!data.token || !data.data) {
      return null;
    }

    setAuthData(data.token, data.data);

    setTimeout(() => {
      navigate(data?.data?.isAdmin === ROLE_KEYS.admin ? '/admin-dashboard' : '/dashboard', {
        replace: true,
      });
    }, 1000);

    return data;
  };
};

export const useLogin = () => {
  const loginSuccessNavigate = useLoginSuccessNavigate();

  const { submit, isLoading } = useMutationSubmit({
    url: '/user/signin',
    onSuccess: loginSuccessNavigate,
  });

  return {
    isLoginLoading: isLoading,
    submitLogin(payload) {
      submit(payload);
    },
  };
};

export const useLogout = () => {
  return (isLogoutRedirect = false) => {
    setAuthData(null, null);
    localStorage.removeItem(CONSTANT.ACCESS_TOKEN);
    localStorage.removeItem(CONSTANT.USER_ATTRIBUTES);
    window.location.href = `/login${isLogoutRedirect ? '?logoutRedirect=true' : ''}`;
  };
};

export const useIsAuthorized = (authorizedPaths = []) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const logout = useLogout();

  const user = useGetLoggedUser();
  const isNotAuthorized = useMemo(
    () =>
      pathname.split('/').filter((item) => authorizedPaths.includes(item)).length > 0 &&
      user === null,
    [pathname, authorizedPaths, user]
  );

  useEffect(() => {
    if (isNotAuthorized) {
      logout(true);
    }
  }, [isNotAuthorized]);

  return !isNotAuthorized;
};

export const useGetLoggedUser = () => {
  return getUser();
};
