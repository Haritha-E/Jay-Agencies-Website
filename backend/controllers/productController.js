import Product from "../models/Product.js";
import fs from 'fs';

export const addProduct = async (req, res) => {
  try {
    const { name, price, size, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const newProduct = new Product({
      name,
      price,
      size,
      description,
      image: req.file.filename,
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully" });

  } catch (err) {
    console.error("❌ Error adding product:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete product image from uploads/products/
    const imagePath = `uploads/products/${product.image}`;
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, price, size, description } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // If new image uploaded, delete old one and update
    if (req.file) {
      const oldImagePath = `uploads/products/${product.image}`;
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      product.image = req.file.filename;
    }

    // Update other fields
    product.name = name;
    product.price = price;
    product.size = size;
    product.description = description;

    await product.save();
    res.status(200).json({ message: "Product updated successfully" });
  } catch (err) {
    console.error("❌ Error updating product:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    console.error("❌ Error fetching product:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Add rating and feedback for a product
export const addRating = async (req, res) => {
  const { rating, feedback } = req.body;
  const userId = req.user._id; 

  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Add new rating to the product's ratings array
    product.ratings.push({ userId, rating, feedback });

    // Save the product with the new rating
    await product.save();

    res.status(200).json({ message: "Rating added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding rating", error });
  }
};

// Get all ratings for a product
export const getAllRatings = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ ratings: product.ratings });
  } catch (error) {
    res.status(500).json({ message: "Error fetching ratings", error });
  }
};
