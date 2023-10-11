const mongoose = require('mongoose');

const specialEquipmentListSchema = new mongoose.Schema({
    value: {
    type: String,
    required: true,
  },
});

const SpecialEquipmentList = mongoose.model('SpecialEquipmentList', specialEquipmentListSchema, 'special_equipment_list');

module.exports = SpecialEquipmentList;