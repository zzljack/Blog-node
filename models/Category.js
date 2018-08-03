var mongoose = require('mongoose');
var categoryiesSchema = require('../schemas/categoryies');

module.exports = mongoose.model('Category', categoryiesSchema);