const {Schema, model} = require("mongoose");

const feedBackSchema = new Schema({

  isConfuse: {type: Boolean, require: true},
  isSlow: {type: Boolean, require: true},
  moreSuggestions: {type: String, require: true},
},
{
  timestamps: true,
});

module.exports = {feedBackModel: model("feedBack", feedBackSchema)};
