import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';

const Product = ({ product }) => {
  return (
    <Card
      className='my-3 p-3 rounded'
      style={{
        transition: '0.5s',
        boxShadow: '0px 4px 8px 0px rgba(0,0,0,0.2)',
        backgroundColor: '#ADD8E6',
        borderRadius: '20px',
        transform: 'scale(1)',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.boxShadow = '0px 8px 16px 0px rgba(0,0,0,0.2)';
        e.currentTarget.style.backgroundColor = '#87CEEB';
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.boxShadow = '0px 4px 8px 0px rgba(0,0,0,0.2)';
        e.currentTarget.style.backgroundColor = '#ADD8E6';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant='top' />
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as='div' className='product-title'>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as='div'>
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </Card.Text>

        <Card.Text as='h3'>₹{product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
