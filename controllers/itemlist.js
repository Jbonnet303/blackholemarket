const express = require('express');
const router = express.Router();

// Common helper functions
const securityUtils = require('../utils/securityUtils.js');

// DB connectivity
const Itemlist = require('../models/itemlist.js');

// Custom middleware to protect the create, update, and delete routes
// Makes sure that all routes except for the index route can only be used
// by users who are logged in (have the loggedInUser session object) and are admins
router.use(securityUtils.admin('loggedInUser', 'isAdmin', null, ['/']));

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
router.post('/new', (req, res)=>{
    Itemlist.create(req.body, (err, createdItem)=>{
      if(err){
        //Failure to create item
        console.log('Failure to create item:', err)
        res.status(500).json({
          status: 500,
          message: 'Failed to create item'
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
