import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from '../../slices/usersApiSlice';
import { toast } from 'react-toastify';

const UserListScreen = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  const [deleteUser] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure')) {
      try {
        await deleteUser(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <h1 style={{color: "#fff", fontFamily:'Poppins'}}>Users</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th style={{color: "#fff", fontFamily:'Poppins'}}>ID</th>
              <th style={{color: "#fff", fontFamily:'Poppins'}}>NAME</th>
              <th style={{color: "#fff", fontFamily:'Poppins'}}>EMAIL</th>
              <th style={{color: "#fff", fontFamily:'Poppins'}}>ADMIN</th>
              <th style={{color: "#fff", fontFamily:'Poppins'}}></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td style={{color: "#fff", fontFamily:'Poppins'}}>{user._id}</td>
                <td style={{color: "#fff", fontFamily:'Poppins'}}>{user.name}</td>
                <td style={{color: "#fff", fontFamily:'Poppins'}}>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td style={{color: "#fff", fontFamily:'Poppins'}}>
                  {user.isAdmin ? (
                    <FaCheck style={{ color: 'green' }} />
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td style={{color: "#fff", fontFamily:'Poppins'}}>
                  {!user.isAdmin && (
                    <>
                      <LinkContainer
                        to={`/admin/user/${user._id}/edit`}
                        style={{ marginRight: '10px' }}
                      >
                        <Button variant='light' className='btn-sm'>
                          <FaEdit />
                        </Button>
                      </LinkContainer>
                      <Button
                        variant='danger'
                        className='btn-sm'
                        onClick={() => deleteHandler(user._id)}
                      >
                        <FaTrash style={{ color: 'white' }} />
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default UserListScreen;
