import mongoose from "mongoose";
import joi from "joi";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    userId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);


const validateProduct = (product)=>{
  const schema = joi.object({
    name : joi.string().required().min(3),
    quantity : joi.number().required(),
    price : joi.number().required(),
    image : joi.string().optional(),
  })
  return schema.validate(product)
  }


const product = mongoose.model("Product", productSchema);

export {product, validateProduct};