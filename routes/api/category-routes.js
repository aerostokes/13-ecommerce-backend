const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
  // find all categories
  // be sure to include its associated Products
  Category.findAll({
    include: [Product],
  }).then(categories => {
    if (categories.length===0) {
      return res.status(404).json({msg: "No Categories found"});
    } else {
      return res.json(categories);
    };
  }).catch(err => {
    console.log(err);
    res.status(500).json({msg: "Error Occurred", err});
  });
});

router.get('/:id', (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  Category.findByPk(req.params.id, {
    include: [Product],
  }).then(category => {
    if (!category) {
      return res.status(404).json({msg: "No Category with that id found"});
    } else {
      return res.json(category);
    };
  }).catch(err => {
    console.log(err);
    res.status(500).json({msg: "Error Occurred", err});
  });
});

router.post('/', (req, res) => {
  // create a new category
  Category.create({
    category_name: req.body.category_name
  }).then(newCategory => {
    res.json({msg: "Successfully created", newCategory})
  }).catch(err => {
    console.log(err);
    res.status(500).json({msg: "Error Occurred", err});
  });
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
  Category.update({
    category_name: req.body.category_name,
  }, {
    where: {
      id: req.params.id,
    }
  }).then(editCategory => {
    if (!editCategory[0]) {
      return res.status(404).json({msg: "No Category updated"});
    } else {
      return res.json({msg: "Successfully updated"})
    };
  }).catch(err => {
    console.log(err);
    res.status(500).json({msg: "Error Occurred", err});
  });
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
  Category.destroy({
    where: {
      id: req.params.id,
    }
  }).then(deleteCategory => {
    if (!deleteCategory) {
      return res.status(404).json({msg: "No Category with that id found"}); 
    } else {
      res.json({msg: "Successfully deleted"})
    };
  }).catch(err => {
    console.log(err);
    res.status(500).json({msg: "Error Occurred", err});
  });
});

module.exports = router;
