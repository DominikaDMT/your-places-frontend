import React, { useEffect, useState } from 'react';

import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './Users.css'

// image: 'https://tulodz.pl/files/pl/magda-gessler-zawita-do-galerii-lodzkiej-(fot--mat--prasowe)-1581417625.jpg',
const Users = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();

  // useEffect nie lubi promisów (ustawiania async na funkcji, którą dostaje w argumencie)- zamiast tego IEF - immediately executed fn
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + '/users'
        );
        // nie trzeba podawać nagłowka content-type, bo nie załączamy żadnych dancyh

        setLoadedUsers(responseData.users);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest]);


  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className='center'>
          <LoadingSpinner />
        </div>
      )}
      <p className='hint'>Select user to see added places or register to add the new one</p>
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </>
  );
};

export default Users;
