import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProducts, updateProduct } from "../api";
import "./EditProduct.css"; // 👈 Import the new CSS file

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [productData, setProductData] = useState({
    name: "",
    price: "",
    size: "",
    description: "",
    image: null,
  });

  const [existingImage, setExistingImage] = useState("");
  const [toast, setToast] = useState({ message: "", type: "" }); // 👈 Move it here

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProducts();
        const product = res.data.find((p) => p._id === id);
        if (product) {
          setProductData({
            name: product.name,
            price: product.price,
            size: product.size,
            description: product.description,
            image: null,
          });
          setExistingImage(product.image);
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setProductData({ ...productData, image: files[0] });
    } else {
      setProductData({ ...productData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", productData.name);
      formData.append("price", productData.price);
      formData.append("size", productData.size);
      formData.append("description", productData.description);
      if (productData.image) {
        formData.append("image", productData.image);
      }

      await updateProduct(id, formData);
      setToast({ message: "Product updated successfully!", type: "success" });

      setTimeout(() => {
        navigate("/admin/products");
      }, 2000); // Wait before redirecting
    } catch (err) {
      console.error("Error updating product:", err);
      setToast({ message: "Failed to update product.", type: "error" });
    }
  };

  const handleCloseToast = () => {
    setToast({ message: "", type: "" }); // Close toast manually
  };

  return (
    <div className="edit-container">
      <h2>Edit Product</h2>

      {/* Toast Notification */}
      {toast.message && (
        <div className={`toast-container`}>
          <div className={`toast ${toast.type}`}>
            <span>{toast.message}</span>
            <button className="close-toast" onClick={handleCloseToast}>
              ×
            </button>
          </div>
        </div>
      )}

      <form className="edit-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <label>
          Product Name:
          <input type="text" name="name" value={productData.name} onChange={handleChange} required />
        </label>

        <label>
          Price:
          <input type="number" name="price" value={productData.price} onChange={handleChange} required />
        </label>

        <label>
          Size:
          <input type="text" name="size" value={productData.size} onChange={handleChange} required />
        </label>

        <label>
          Description:
          <textarea name="description" value={productData.description} onChange={handleChange} required />
        </label>

        <label>
          Existing Image:
          {existingImage && (
            <div className="image-preview">
              <img src={`http://localhost:5000/uploads/${existingImage}`} alt="Existing" />
            </div>
          )}
        </label>

        <label>
          Upload New Image:
          <input type="file" name="image" onChange={handleChange} />
        </label>

        <button type="submit">Update Product</button>
      </form>
    </div>
  );
};

export default EditProduct;
