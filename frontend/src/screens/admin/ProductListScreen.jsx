import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useCreateProductMutation,
} from '../../slices/productsApiSlice';
import { toast } from 'react-toastify';

const ProductListScreen = () => {
  const { pageNumber } = useParams();

  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
  });

  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure')) {
      try {
        await deleteProduct(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  const createProductHandler = async () => {
    if (window.confirm('Are you sure you want to create a new product?')) {
      try {
        await createProduct();
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };
  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1 style={{ color: '#fff', fontFamily: 'Poppins' }}>Products</h1>
        </Col>
        <Col className='text-end'>
          <Button
            className='my-3'
            onClick={createProductHandler}
            style={{
              backgroundColor: '#fff',
              fontFamily: 'Poppins',
              color: '#0c75e6',
              border: 'none',
            }}
          >
            <FaPlus /> Create Product
          </Button>
        </Col>
      </Row>

      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th style={{ color: '#fff', fontFamily: 'Poppins' }}>ID</th>
                <th style={{ color: '#fff', fontFamily: 'Poppins' }}>NAME</th>
                <th style={{ color: '#fff', fontFamily: 'Poppins' }}>PRICE</th>
                <th style={{ color: '#fff', fontFamily: 'Poppins' }}>
                  CATEGORY
                </th>
                <th style={{ color: '#fff', fontFamily: 'Poppins' }}>BRAND</th>
                <th style={{ color: '#fff', fontFamily: 'Poppins' }}></th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product) => (
                <tr key={product._id}>
                  <td style={{ color: '#fff', fontFamily: 'Poppins' }}>
                    {product._id}
                  </td>
                  <td style={{ color: '#fff', fontFamily: 'Poppins' }}>
                    {product.name}
                  </td>
                  <td style={{ color: '#fff', fontFamily: 'Poppins' }}>
                    ₹{product.price}
                  </td>
                  <td style={{ color: '#fff', fontFamily: 'Poppins' }}>
                    {product.category}
                  </td>
                  <td style={{ color: '#fff', fontFamily: 'Poppins' }}>
                    {product.brand}
                  </td>
                  <td style={{ color: '#fff', fontFamily: 'Poppins' }}>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant='light' className='btn-sm mx-2'>
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandler(product._id)}
                    >
                      <FaTrash style={{ color: 'white' }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={data.pages} page={data.page} isAdmin={true} />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
