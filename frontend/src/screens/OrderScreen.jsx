import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from '../slices/ordersApiSlice';

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': paypal.clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPaypalScript();
        }
      }
    }
  }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success('Order is paid');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    });
  }

  // TESTING ONLY! REMOVE BEFORE PRODUCTION
  // async function onApproveTest() {
  //   await payOrder({ orderId, details: { payer: {} } });
  //   refetch();

  //   toast.success('Order is paid');
  // }

  function onError(err) {
    toast.error(err.message);
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error?.data?.message || error.error}</Message>
  ) : (
    <>
      <h1 style={{ color: '#0c75e6', fontFamily: 'Poppins' }}>
        Order {order._id}
      </h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2 style={{ color: '#0c75e6', fontFamily: 'Poppins' }}>
                Shipping
              </h2>
              <p>
                <strong style={{ fontFamily: 'Poppins' }}>Name: </strong>{' '}
                {order.user.name}
              </p>
              <p>
                <strong style={{ fontFamily: 'Poppins' }}>Email: </strong>{' '}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong style={{ fontFamily: 'Poppins' }}>Address:</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant='success' style={{ fontFamily: 'Poppins' }}>
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant='danger' style={{ fontFamily: 'Poppins' }}>
                  Not Delivered
                </Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2 style={{ color: '#0c75e6', fontFamily: 'Poppins' }}>
                Payment Method
              </h2>
              <p>
                <strong style={{ fontFamily: 'Poppins' }}>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant='success' style={{ fontFamily: 'Poppins' }}>
                  Paid on {order.paidAt}
                </Message>
              ) : (
                <Message variant='danger' style={{ fontFamily: 'Poppins' }}>
                  Not Paid
                </Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2 style={{ color: '#0c75e6', fontFamily: 'Poppins' }}>
                Adopt Pets
              </h2>
              {order.orderItems.length === 0 ? (
                <Message style={{ fontFamily: 'Poppins' }}>
                  List is empty
                </Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1} style={{ fontFamily: 'Poppins' }}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col style={{ fontFamily: 'Poppins' }}>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4} style={{ fontFamily: 'Poppins' }}>
                          {item.qty} x ₹{item.price} = ₹{item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2 style={{ color: '#0c75e6', fontFamily: 'Poppins' }}>
                  Order Summary
                </h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col style={{ fontFamily: 'Poppins' }}>Items</Col>
                  <Col style={{ fontFamily: 'Poppins' }}>
                    ₹{order.itemsPrice}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col style={{ fontFamily: 'Poppins' }}>Shipping</Col>
                  <Col style={{ fontFamily: 'Poppins' }}>
                    ₹{order.shippingPrice}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col style={{ fontFamily: 'Poppins' }}>Tax</Col>
                  <Col style={{ fontFamily: 'Poppins' }}>₹{order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col style={{ fontFamily: 'Poppins' }}>Total</Col>
                  <Col style={{ fontFamily: 'Poppins' }}>
                    ₹{order.totalPrice}
                  </Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}

                  {isPending ? (
                    <Loader />
                  ) : (
                    <div>
                      {/* THIS BUTTON IS FOR TESTING! REMOVE BEFORE PRODUCTION! */}
                      {/* <Button
                        style={{ marginBottom: '10px' }}
                        onClick={onApproveTest}
                      >
                        Test Pay Order
                      </Button> */}

                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    </div>
                  )}
                </ListGroup.Item>
              )}

              {loadingDeliver && <Loader />}

              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type='button'
                      className='btn btn-block'
                      onClick={deliverHandler}
                      style={{
                        backgroundColor: '#0c75e6',
                        color: '#fff',
                        fontFamily: 'Poppins',
                      }}
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
