const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');


require('dotenv').config();


const router = express.Router(); 


projectData = {};


const OWM_APIKEY = '&appid=' + process.env.OWM_APIKEY;
const OWM_URL = '';


router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


router.route('/weather')
    .get((req, res) => {
        const zip = req.query.zip;
       
        if(!zip) return res.send({error: 'n'})
        request({
            method: 'GET',
            uri: OWM_URL+'zip=' + zip + OWM_APIKEY      
        }, (error, response, body) => {
            if(!error && response.statusCode === 200) {
               
                projectData['weather'] = JSON.parse(body);

            
                return res.send(body);
            } 
            else if (!error) {
               
                return res.send(body);
            }
            else {
             
                return res.send(error);
            }
        });
    });

router.route('/postdata')
    .post((req, res) => {
        
        projectData = {...projectData, ...req.body}
        return res.send(projectData);
    });


module.exports = router;
