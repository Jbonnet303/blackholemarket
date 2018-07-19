const mongoose = require('mongoose');
//Schema for an item
const itemlistSchema = new mongoose.Schema({
  name: String,
  img: String,
  qty: Number,
  price: Number
});

const Itemlist = mongoose.model('Itemlist', itemlistSchema);

module.exports = Itemlist;
