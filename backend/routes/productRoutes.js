import express from "express";
import upload from "../middleware/upload.js";
import { addProduct, getAllProducts, deleteProduct, updateProduct } from "../controllers/productController.js";

const router = express.Router();

router.post("/add", upload.single("productImage"), addProduct);
router.get("/", getAllProducts); // 👈 new route
router.delete("/:id", deleteProduct);
router.put("/edit/:id", upload.single("productImage"), updateProduct);

export default router;
