var express  = require('express');
var router = express.Router();
var Hero = require('../models/hero');

// Index
router.get('/',
  function(req, res, next){
    var query = {};
    if(req.query.name) query.name = {$regex:req.query.name, $options:'i'};

    Hero.find(query)
      .sort({id: 1})
      .exec(function(err, heroes){
        if(err) {
          res.status(500);
          res.json({success:false, message:err});
        }
        else {
          res.json({success:true, data:heroes});
        }
      });
  }
);

// Show
router.get('/:id',
  function(req, res, next){
    Hero.findOne({id:req.params.id})
      .exec(function(err, hero){
        if(err) {
          res.status(500);
          res.json({success:false, message:err});
        }
        else if(!hero){
          res.json({success:false, message:'hero not found'});
        }
        else {
          res.json({success:true, data:hero});
        }
      });
  }
);

// Create
router.post('/',
  function(req, res, next){
    Hero.findOne({})
      .sort({id: -1})
      .exec(function(err, hero){
        if(err) {
          res.status(500);
          return res.json({success:false, message:err});
        }
        else {
          res.locals.lastId = hero?hero.id:0;
          next();
        }
      });
  },
  function(req, res, next){
    var newHero = new Hero(req.body);
    newHero.id = res.locals.lastId + 1;
    newHero.save(function(err, hero){
      if(err) {
        res.status(500);
        res.json({success:false, message:err});
      }
      else {
        res.json({success:true, data:hero});
      }
    });
  }
);

// Update
router.put('/:id',
  function(req, res, next){
    Hero.findOneAndUpdate({id:req.params.id}, req.body)
      .exec(function(err, hero){
        if(err) {
          res.status(500);
          res.json({success:false, message:err});
        }
        else if(!hero){
          res.json({success:false, message:'hero not found'});
        }
        else {
          res.json({success:true});
        }
      });
  }
);

// Destroy
router.delete('/:id',
  function(req, res, next){
    Hero.findOneAndRemove({id:req.params.id})
      .exec(function(err, hero){
        if(err) {
          res.status(500);
          res.json({success:false, message:err});
        }
        else if(!hero){
          res.json({success:false, message:'hero not found'});
        }
        else {
          res.json({success:true});
        }
      });
  }
);

module.exports = router;
