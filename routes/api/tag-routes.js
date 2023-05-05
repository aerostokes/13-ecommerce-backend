const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  Tag.findAll({
    include: [Product],
  }).then(tags => {
    if (tags.length===0) {
      return res.status(404).json({msg: "No Tags found"});
    } else {
      return res.json(tags);
    };
  }).catch(err => {
    console.log(err);
    res.status(500).json({msg: "Error Occurred", err});
  });
});

router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  Tag.findByPk(req.params.id, {
    include: [Product],
  }).then(tag => {
    if (!tag) {
      return res.status(404).json({msg: "No Tag with that id found"});
    } else {
      return res.json(tag);
    };
  }).catch(err => {
    console.log(err);
    res.status(500).json({msg: "Error Occurred", err});
  });
});

router.post('/', (req, res) => {
  // create a new tag
  /* req.body should look like this...
    {
      "tag_name": "silver",
      "productIds": [2, 3, 6]
    }
  */
    Tag.create(req.body)
    .then((tag) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.productIds.length) {
        const productTagIdArr = req.body.productIds.map((product_id) => {
          return {
            tag_id: tag.id,
            product_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(tag);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  Tag.update({
    tag_name: req.body.tag_name,
  }, {
    where: {
      id: req.params.id,
    }
  }).then(editTag => {
    if (!editTag[0]) {
      return res.status(404).json({msg: "No Tag updated"});
    } else {
      return res.json({msg: "Successfully updated"})
    };
  }).catch(err => {
    console.log(err);
    res.status(500).json({msg: "Error Occurred", err});
  });
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
  Tag.destroy({
    where: {
      id: req.params.id,
    }
  }).then(deleteTag => {
    if (!deleteTag) {
      return res.status(404).json({msg: "No Tag with that id found"}); 
    } else {
      res.json({msg: "Successfully deleted"})
    };
  }).catch(err => {
    console.log(err);
    res.status(500).json({msg: "Error Occurred", err});
  });
});

module.exports = router;
