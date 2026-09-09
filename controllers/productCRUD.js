
import { validateProduct , product} from "../models/productModel.js";

export const createProduct = async (req, res) => {
      try {
    const { error } = validateProduct(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const Product = await product.create({
        ...req.body,
        userId: req.user,
    });
    res.status(201).json({ Product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const findAllProducts = async (req, res) => {
    try{
      const Product = await product.find({userId: req.user});
      res.status(200).json({ Product });
    }
    catch (error) {
      res.status(500).json({ message: error.message });
    }
};

export const findAllPublicProducts = async (req, res) => {
        try {
            const Product = await product.find().populate("userId", "username");
            res.status(200).json({ Product });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
};

export const findPublicProductById = async (req, res) => {
    try {
        const Product = await product.findById(req.params.id).populate("userId", "username");
        if(!Product){
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ Product });
    }
    catch (error) {
        res.status(404).json({ message: "Product not found" });
    }
};

export const findProductById = async (req,res)=>{
    try{
        const productId = req.params.id;
        const Product = await product.findById(productId);
        if(!Product){
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ Product });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateProduct = async (req,res)=>{
    try{
        const productId = req.params.id;
        const { error } = validateProduct(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const existingProduct = await product.findById(productId);
        if(!existingProduct){
            return res.status(404).json({ message: "Product not found" });
        }
        if(existingProduct.userId.toString() !== req.user){
            return res.status(403).json({ message: "You are not authorized to update this product" });
        }
        const updatedProduct = await product.findByIdAndUpdate(productId, req.body, { new: true }).populate("userId", "username");
        if(!updatedProduct){
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ updatedProduct });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteProduct = async (req,res)=>{
    try{
        const id = req.params.id;
        const Product = await product.findById(id);
        if(!Product){
            return res.status(404).json({ message: "Product not found" });
        }
        if(Product.userId.toString()!== req.user){
            return res.status(403).json({ message: "You are not authorized to delete this product" });
        }
        await product.findByIdAndDelete(id);
        res.status(200).json({ message: "Product deleted successfully" });
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
}