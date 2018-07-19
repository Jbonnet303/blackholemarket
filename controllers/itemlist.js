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
      if(err){
        //Failure to delete item
        console.log('Failure to delete item:', err)
        res.status(500).json({
          status: 500,
          message: 'Failed to delete item with id:' + request.params.id
        })
      } else {
          res.json(deletedItem);
      }
    });
});
//Creates new item
router.post('/', (req, res)=>{
    Itemlist.create(req.body, (err, createdItem)=>{
      if(err){
        //Failure to create item
        console.log('Failure to create item:', err)
        res.status(500).json({
          status: 500,
          message: 'Failed to create item with id:' + request.params.id
        })
      } else {
          res.json(createdItem);
      }
    });
});
//Updates item
router.put('/:id', (req, res)=>{
    Itemlist.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedItem)=>{
      if(err){
        //Failure to post item
        console.log('Failure to update item:', err)
        res.status(500).json({
          status: 500,
          message: 'Failed to update item with id:' + request.params.id
        })
      } else {
          res.json(updatedItem);
      }
    });
});

module.exports = router;
