import mongoose from "mongoose";
import joi from "joi";
const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type: String,
        required: true,
        trim: true,
    },
    password:{
        type: String,
        required: true,
        trim: true,
        minlength: 6,
    },  
    image:{
        type: String,
        required: false,
    },
},{
    timestamps: true,
}
);

const registerValidation = (user)=>{
    const schema = joi.object({
        username: joi.string().required().trim(),
        email: joi.string().required().trim().email(),
        password: joi.string().required().trim().min(6),
        image: joi.string().optional(),
    });
    return schema.validate(user);
};

const loginValidation = (user)=>{
    const schema = joi.object({
        email: joi.string().required().trim().email(),
        password: joi.string().required().trim().min(6),
    });
    return schema.validate(user);
};

const user = mongoose.model("User", userSchema);

export {registerValidation ,loginValidation, user};