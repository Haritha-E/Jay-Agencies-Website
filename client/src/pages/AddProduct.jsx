import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import "./AddProduct.css";

const AddProduct = () => {
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    size: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null); // 👈 useRef for file input
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleReset = () => {
    setProductData({ name: "", price: "", size: "", description: "" });
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // 👈 reset file input manually
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image || !productData.name || !productData.price || !productData.size || !productData.description) {
      toast.error("Please fill all fields and upload an image.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", productData.name);
    formData.append("price", productData.price);
    formData.append("size", productData.size);
    formData.append("description", productData.description);

    try {
      const res = await fetch("http://localhost:5000/api/products/add", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Product added successfully!");
        handleReset(); // reset after successful submit
      } else {
        toast.error(data.message || "Failed to add product.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" name="name" value={productData.name} onChange={handleChange} placeholder="Product Name" />

        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          ref={fileInputRef} // 👈 ref added here
        />

        <input type="number" name="price" value={productData.price} onChange={handleChange} placeholder="Price (₹)" />

        <input type="text" name="size" value={productData.size} onChange={handleChange} placeholder="Capacity / Size" />

        <textarea name="description" value={productData.description} onChange={handleChange} placeholder="Product Description" />

        <div className="form-buttons">
          <button type="submit" disabled={loading}>Submit</button>
          <button type="button" onClick={handleReset}>Reset</button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
