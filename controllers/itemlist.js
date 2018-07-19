const express = require('express');
const router = express.Router();
const Shoplist = require('../models/itemlist.js');

//Shows all items
router.get('/', (req, res)=>{
    Itemlist.find({}, (err, foundItemlist)=>{
        res.json(foundItemlist);
    });
});
//Deletes the item
router.delete('/:id', (req, res)=>{
    Itemlist.findByIdAndRemove(req.params.id, (err, deletedItem)=>{
        res.json(deletedItem);
    });
});
//Creates new item
router.post('/', (req, res)=>{
    Itemlist.create(req.body, (err, createdItem)=>{
        res.json(createdItem);
    });
});
//Adds item to list of items
router.put('/:id', (req, res)=>{
    Itemlist.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedItem)=>{
        res.json(updatedItem);
    });
});

module.exports = router;
