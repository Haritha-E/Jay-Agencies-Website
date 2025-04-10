import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { getProducts, deleteProduct  } from "../api"; // Adjust the path if needed
import "./AdminManageProducts.css";

const AdminManageProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        setProducts(res.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleEdit = (id) => {
    navigate(`/admin/products/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id); // API call
        setProducts(products.filter(product => product._id !== id)); // UI update
      } catch (error) {
        console.error("Failed to delete product:", error);
        alert("Something went wrong while deleting the product.");
      }
    }
  };

  return (
    <div className="manage-products-container">
      <header className="manage-products-header">
        <h2>Manage Products</h2>
        <button className="add-product-btn" onClick={() => navigate("/admin/products/add")}>
          <FaPlus /> Add Product
        </button>
      </header>

      <div className="product-table">
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price (₹)</th>
                <th>Size</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <img
                      src={`http://localhost:5000/uploads/products/${product.image}`}
                      alt={product.name}
                      className="product-thumbnail"
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>₹{product.price}</td>
                  <td>{product.size}</td>
                  <td>{product.description}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(product._id)}>
                      <FaEdit />
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(product._id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminManageProducts;
