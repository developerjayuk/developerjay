const express = require('express');
const router = express.Router();

// @route   GET api/blog/test
// @desc    Tests blog route
// @access  Public
router.get('/test', (req, res) => res.json({
  msg: "Blog works!"
}));

module.exports = router;