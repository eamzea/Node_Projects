import mongoose, { Schema } from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true
  },
  available: {
    type: Boolean,
    default: true
  },
  price: {
    type: Number,
    default: 0
  },
  description: {
    type: String
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

productSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,

  transform: function (doc, ret) {
    delete ret._id
  }
})

export const ProductModel = mongoose.model('Product', productSchema)
