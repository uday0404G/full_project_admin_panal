import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import './ProductPage.css';
import { db } from '../Firebase/firebase';

function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State for error handling
  const productCollection = collection(db, 'productdatabase');
  const [filterData, setFilter] = useState({
    Perfume: false,
    Cloth: false,
  });
  const [sort, setSort] = useState('');
  const [search, setSearch] = useState('');

  const getProducts = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(productCollection);
      const productArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productArray);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteDoc(doc(db, 'productdatabase', id));
        alert('Product deleted successfully');
        getProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
      }
    }
  };

  const handleFilter = (e) => {
    setFilter({
      ...filterData,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSort = (e) => {
    setSort(e.target.value);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // Apply filters
  let filteredDatas = products;

  if (Object.values(filterData).some(Boolean)) {
    filteredDatas = filteredDatas.filter((el) => {
      return Object.keys(filterData).some(
        (category) => filterData[category] && el.category.name === category
      );
    });
  }

  // Apply sorting
  if (sort) {
    filteredDatas.sort((a, b) => {
      return sort === 'asc' ? a.price - b.price : b.price - a.price;
    });
  }

  // Apply search
  if (search) {
    filteredDatas = filteredDatas.filter((el) =>
      el.title.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>{error}</div>; // Display error if any

  return (
    <div className="container">
      <h1>Product Page</h1>
      <div className="filter-sort-search">
        <div className="filter-section" style={{ marginLeft: '200px' }}>
          {Object.keys(filterData).map((category) => (
            <label key={category}>
              <input
                type="checkbox"
                name={category}
                onChange={handleFilter}
                checked={filterData[category]}
              />{' '}
              {category}
            </label>
          ))}
        </div>
        <div className="sort-section">
          <select value={sort} onChange={handleSort}>
            <option value="">Sort</option>
            <option value="asc">Low to High</option>
            <option value="desc">High to Low</option>
          </select>
        </div>
        <div className="search-section">
          <input
            type="text"
            placeholder="Search products"
            onChange={handleSearch}
            value={search}
          />
        </div>
      </div>
      <div className="product-list">
        {filteredDatas.length ? (
          filteredDatas.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.title} />
              <div className="product-card-content">
                <h3 className="h3">{product.title}</h3>
                <p>{product.description}</p>
                <p>
                  <span>
                    <b>Rs.{product.price}</b>
                  </span>
                </p>
                <div className="editbtn">
                  <Link to={`/edit/${product.id}`}>Edit</Link>
                  <button onClick={() => handleDelete(product.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
    </div>
  );
}

export default Product;
