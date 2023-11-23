import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import Loader from '../components/Loader';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const dispatch = useDispatch();
  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2 style={{ color: '#0c75e6', fontFamily: 'Poppins' }}>
                Shipping
              </h2>
              <p style={{ fontFamily: 'Poppins' }}>
                <strong>Address:</strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                {cart.shippingAddress.postalCode},{' '}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2 style={{ color: '#0c75e6', fontFamily: 'Poppins' }}>
                Payment Method
              </h2>
              <strong style={{ fontFamily: 'Poppins' }}>Method: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2 style={{ color: '#0c75e6', fontFamily: 'Poppins' }}>
                Adopt Pet
              </h2>
              {cart.cartItems.length === 0 ? (
                <Message style={{ fontFamily: 'Poppins' }}>
                  Your Adoption list is empty
                </Message>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
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
                  List Summary
                </h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col style={{ fontFamily: 'Poppins' }}>Pets</Col>
                  <Col style={{ fontFamily: 'Poppins' }}>
                    ₹{cart.itemsPrice}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col style={{ fontFamily: 'Poppins' }}>Shipping</Col>
                  <Col style={{ fontFamily: 'Poppins' }}>
                    ₹{cart.shippingPrice}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col style={{ fontFamily: 'Poppins' }}>Tax</Col>
                  <Col style={{ fontFamily: 'Poppins' }}>₹{cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col style={{ fontFamily: 'Poppins' }}>Total</Col>
                  <Col style={{ fontFamily: 'Poppins' }}>
                    ₹{cart.totalPrice}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && (
                  <Message variant='danger' style={{ fontFamily: 'Poppins' }}>
                    {error?.data?.message || error.error}
                  </Message>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn-block'
                  disabled={cart.cartItems === 0}
                  onClick={placeOrderHandler}
                  style={{
                    backgroundColor: '#0c75e6',
                    color: '#fff',
                    fontFamily: 'Poppins',
                  }}
                >
                  Adopt Pet
                </Button>
                {isLoading && <Loader />}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
