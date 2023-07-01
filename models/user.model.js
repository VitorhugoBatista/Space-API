import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    id: {
      type: Number,
      
    }
    ,
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    fname: {
      type: String,
      required: true,
    },
    lname: {
      type: String,
      required: true,
    },
    following: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = model('User', userSchema);

export default User;
