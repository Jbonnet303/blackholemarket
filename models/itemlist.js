const mongoose = require('mongoose');

const itemlistSchema = new mongoose.Schema({
  name: String,
  img: String,
  qty: Number,
  price: Number
});

const Itemlist = mongoose.model('Itemlist', itemlistSchema);

module.exports = Itemlist;
