import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { addDoc, collection, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase/firebase';

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState(''); // State for category
  const productCollection = collection(db, 'Glassesdatabase');

  useEffect(() => {
    if (id !== 'new') {
      const fetchProduct = async () => {
        try {
          const docRef = doc(db, 'Glassesdatabase', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const product = docSnap.data();
            setTitle(product.title);
            setDescription(product.description);
            setPrice(product.price);
            setImage(product.image);
            setCategory(product.category?.name || ''); // Load existing category
          }
        } catch (error) {
          console.error('Error fetching product:', error);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      title,
      description,
      price: parseFloat(price),
      image,
      category: { name: category }, // Including category in the product data
    };
    try {
      if (id === 'new') {
        await addDoc(productCollection, productData);
        alert('Product added successfully');
      } else {
        const docRef = doc(db, 'productdatabase', id);
        await updateDoc(docRef, productData);
        alert('Product updated successfully');
      }
      navigate('/Product');
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (
    <div style={{ paddingLeft: '200px' }}>
      <h1>{id === 'new' ? 'Add Product' : 'Edit Product'}</h1>
      <div className="edit-product">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter Product Title"
            required
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter Product Description"
            required
          />
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter Product Price"
            required
          />
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Enter Product Image URL"
            required
          />
          {/* Category Selection */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="Perfume">Perfume</option>
            <option value="Cloth">Cloth</option>
          </select>
          <button type="submit">{id === 'new' ? 'Add Product' : 'Save Changes'}</button>
        </form>

        <div className="product-preview">
          <h2>Product Preview</h2>
          <div className="preview-card">
            <img src={image} alt={title} style={{ width: '200px', height: '200px' }} />
            <h3>Title: {title || 'Title Here'}</h3>
            <p>Description: {description || 'Description Here'}</p>
            <p>Price: {price ? `${price}` : 'Price Here'} Rs.</p>
            <p>Category: {category || 'Category Here'}</p> {/* Displaying the selected category */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProduct;
