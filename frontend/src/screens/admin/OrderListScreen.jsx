import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';

const OrderListScreen = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <>
      <h1 style={{color: "#fff", fontFamily:'Poppins'}}>Orders</h1>
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
              <th style={{color: "#fff", fontFamily:'Poppins'}}>USER</th>
              <th style={{color: "#fff", fontFamily:'Poppins'}}>DATE</th>
              <th style={{color: "#fff", fontFamily:'Poppins'}}>TOTAL</th>
              <th style={{color: "#fff", fontFamily:'Poppins'}}>PAID</th>
              <th style={{color: "#fff", fontFamily:'Poppins'}}>DELIVERED</th>
              <th style={{color: "#fff", fontFamily:'Poppins'}}></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td style={{color: "#fff", fontFamily:'Poppins'}}>{order._id}</td>
                <td style={{color: "#fff", fontFamily:'Poppins'}}>{order.user && order.user.name}</td>
                <td style={{color: "#fff", fontFamily:'Poppins'}}>{order.createdAt.substring(0, 10)}</td>
                <td style={{color: "#fff", fontFamily:'Poppins'}}>₹{order.totalPrice}</td>
                <td style={{color: "#fff", fontFamily:'Poppins'}}>
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant='light' className='btn-sm' style={{backgroundColor: "#fff", fontFamily:'Poppins', color:'#0c75e6', border:'none'}}>
                      Details
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrderListScreen;
