const express = require('express');
var multer = require('multer');
var path = require('path');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
var app = express();
const Patient_Appointment = require('../models/Patient_Appointment_Tbl');
const Patient_Tbl = require('../models/Patient_Tbl');
const Counter = require('../models/Counter_Tbl');


// cb- callback
var Storage= multer.diskStorage({
  destination:"./public/uploads/",
  filename:(req,file,cb)=>{
    cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
  }
});

var upload = multer({
  storage:Storage
}).single('photo');


// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);

// Appointment
router.get('/appointment_user', ensureAuthenticated, (req, res) => {
  var data=[]
  res.render('appointment_user',{ title: 'Upload File', records:data, success:'' })
});

router.post('/appointment_user',upload,(req, res) => {
  console.log("Starts Hello World");
  const { first_name, last_name, mobile_no , gender,age,
          email_address,photo,appointment_date_time} = req.body;

        var username = req.user.name;
      console.log("USER-->",username);

      var userid = req.user.user_id;
      console.log("USER-ID-->",userid);

          var imageFile=req.file.filename;
        //  console.log("imageFile-->",imageFile);
         var success =req.file.filename+ " uploaded successfully";
         var data = [];

         data.push({'name':imageFile});


  let errors = [];

  if(!first_name || !last_name || !mobile_no )
    {
      errors.push({ msg: 'Please enter all fields' });
    } 

    //   -------------  mobile sms-----------------

   // require('dotenv').config();
    
    // const apisid = process.env.SID_ACCOUNT;
    // const authtoken = process.env.AUTH_TOKEN;
    // const client = require('twilio')(apisid,authtoken);
    // let smsResponse;
  

  if (errors.length > 0) {
    res.render('appointment_user', {
      errors,
      first_name,
      last_name,
      mobile_no
    });
  } else {
//   -------------  mobile sms-----------------
  //  asyncCall();
    // async function asyncCall() {
    //   smsResponse = await client.messages.create({
    //    body : 'Appointment Data Added Successfully',
    //    from : process.env.MY_PHONE_NUMBER,
    //    to : req.body.phone
    //    })
   
    //    console.log("MessageCode---> ",smsResponse.errorCode)
   
    //    if(smsResponse.errorCode == null){
        

    //      const newAppointment_User = new Appointment_User({
    //       first_name,
    //       last_name, dob, gender,
    //       email,phone,service,
    //       doctor_name,appointment_date,textmsg
    //     });     

    //     newAppointment_User.save().then(appointment_user => {
    //       req.flash(
    //         'success_msg',
    //         'Appointment Details Added Successfully'
    //       );
    //        res.redirect('/appointment_user');
    //     }).catch(err => console.log(err));

    //    }else
    //    {
    //      return smsResponse.errorCode
    //    }
    // }




    const newpatient_User = new Patient_Tbl({
      first_name,
      last_name, gender,age,mobile_no,
      email_address,photo
    });  
    
    
    const newAppointment_User = new Patient_Appointment({
      appointment_date_time
    });

              Counter.findOne({ counter_id: "user" }).then(counter => {
            if (counter) {
              Counter.updateOne({counter_id: "user"}, {
                  sequence_value : parseInt(counter.sequence_value) + 1
                    }, function(err, numberAffected, rawResponse) {

                      newpatient_User.patient_id = counter.sequence_value;
                      newpatient_User.photo = imageFile;
                      console.log("Patient_ID--->",newpatient_User.patient_id);
                      newpatient_User.save().then(patient_user => {

                        Counter.findOne({ counter_id: "user" }).then(counter_appointment => {
                          if (counter_appointment) {
                            Counter.updateOne({counter_id: "user"}, {
                              sequence_value : parseInt(counter_appointment.sequence_value) + 1
                                  }, function(err, numberAffected, rawResponse) {
              
                                    newAppointment_User.appointment_id = counter.sequence_value;
                                    console.log("Appoin_ID-->",newAppointment_User.appointment_id);
                                    newAppointment_User.patient_id = newpatient_User.patient_id;
                                    console.log("Appoin_ID-->",newAppointment_User.patient_id);

                                    newAppointment_User.save().then(appointment_user => {
                                      
                                      req.flash(
                                        'success_msg',
                                        'Appointment Details Added Successfully'
                                      );
                                       res.redirect('/appointment_user');
                                    }).catch(err => console.log(err));
              
                                    })
                                }
                        });


                        
                      }).catch(err => console.log(err));

                      })
                  }
          });


    

   
  }
});


module.exports = router;
