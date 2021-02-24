/* Magic Mirror
    * Module: MMM-Nascar
    *
    * By Cowboysdude
    * 
    */
const NodeHelper = require('node_helper');
const request = require('request');
const moment = require('moment');


module.exports = NodeHelper.create({
	  
    start: function() {
    	console.log("Starting module: " + this.name);
    },
    
    getNascar: function(url) {
		var year =  moment().format('YYYY'); 
        
		request({
            url: "http://www.nascar.com/cacher/"+year+"/1/points-feed.json",
            method: 'GET'
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var result = JSON.parse(body);
                this.sendSocketNotification('NASCAR_RESULT', result); 
            }
        });
    },

    //Subclass socketNotificationReceived received.
    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_NASCAR') {
                this.getNascar(payload);
            }
         }  
    });
