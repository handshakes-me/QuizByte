'use client';

import { setUser } from '@/slices/userSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const UserHydrator = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      dispatch(setUser(JSON.parse(storedUser)));
    }
  }, [dispatch]);

  return null;
};

export default UserHydrator;
