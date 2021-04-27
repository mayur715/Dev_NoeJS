const mongoose = require('mongoose');

const Patient_Appointment_TblSchema = new mongoose.Schema({
  appointment_id: {
    type: String,
    required: true
  },
  patient_id: {
    type: String,
    required: true
  },
  appointment_date_time: {
    type: Date,
    require:true
  },
  insert_date_time: {
    type: Date,
    default: Date.now
  }
});

const Patient_Appointment_Tbl = mongoose.model('Patient_Appointment_Tbl', Patient_Appointment_TblSchema);

module.exports = Patient_Appointment_Tbl;
