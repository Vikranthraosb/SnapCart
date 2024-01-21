// const mongoose = require('mongoose');
// const plm = require("passport-local-mongoose")

// mongoose.connect("mongodb://127.0.0.1:27017/dummy");

// const userSchema = mongoose.Schema({
//   username: String,
//   name: String,
//   email: String,
//   password: String,
//   dateOfBirth: Date,
//   age: Number,
//   mobile: String,
//   city: String,
//   boards: {
//     type: Array,
//     default: []
//   },
//   posts: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "post"
//   }]
// });

// userSchema.plugin(plm);

// module.exports = mongoose.model("user", userSchema);

const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/version_3");

const userSchema = mongoose.Schema({
  username: String,
  name: String,
  email: String,
  salt: String, 
  hash: String, 
  dateOfBirth: Date,
  age: Number,
  mobile: String,
  city: String,
  boards: {
    type: Array,
    default: []
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "post"
  }]
});

userSchema.statics.generateSalt = async function () {
  const crypto = require('crypto');
  return crypto.randomBytes(16).toString('hex');
};

userSchema.statics.hashPassword = async function (password, salt) {
  const crypto = require('crypto');
  const hash = crypto.createHmac('sha256', salt).update(password).digest('hex');
  return hash;
};

userSchema.plugin(plm);

module.exports = mongoose.model("user", userSchema);
