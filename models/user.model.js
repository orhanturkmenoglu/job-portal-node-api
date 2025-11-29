const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Name is Require!"],
      minLenght : [2,"Name must be at least 2 characters! "]

    },
    lastName: {
      type: String,
      required: [true, "LastName is Require!"],
    },
    email: {
      type: String,
      required: [true, "Email is Require!"],
      unique: true,
      validate : {
        validator : validator.isEmail,
        message : "Please enter a valid email!"
      }
    },
    password: {
      type: String,
      required: [true, "Password is Require!"],
      select : true // geri dönüşlerde sql sorgusuna dahil edilmez
    },
    location: {
      type: String,
      default: "TURKIYE",
    },
  },
  { timestamps: true }
);


/* userSchema.pre("save",async function (){
  const salt = bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password,salt);
})
 */
module.exports = mongoose.model("User", userSchema);
