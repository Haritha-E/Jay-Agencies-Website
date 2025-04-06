import express from "express";
import upload from "../middleware/upload.js";
import { addProduct, getAllProducts, deleteProduct, updateProduct } from "../controllers/productController.js";

const router = express.Router();

router.post("/add", upload.single("image"), addProduct);
router.get("/", getAllProducts); // 👈 new route
router.delete("/:id", deleteProduct);
router.put("/edit/:id", upload.single("image"), updateProduct);

export default router;
