/* Magic Mirror
    * Module: MMM-Nascar
    *
    * By cowboysdude
    * 
    */
   
Module.register("MMM-Nascar", {
       
        requiresVersion: "2.1.0",
       
       // Module config defaults.
       defaults: {
           updateInterval: 60*1000, // every 10 minutes
           animationSpeed: 10,
           initialLoadDelay: 4950, // 0 seconds delay
           retryDelay: 1500,
           maxWidth: "100%",
           fadeSpeed: 11,
           rotateInterval: 20 * 1000, //20 seconds
           header: false,
           
           driverTable: {
            "Jamie McMurray":"1",
            "Danica Patrick":"10",
            "Denny Hamlin":"11",
            "Ty Dillon":"13",
			"Clint Bowyer":"14",
			"Michael Waltrip":"15",
			"Reed Sorenson":"40",
			"D.J. Kennington":"15",
			"Kevin O'Connell":"15",
			"Ross Chastain":"15",
			"Joey Gase":"15",
			"Ricky Stenhouse Jr":"17",
			"Kyle Busch":"18",
			"Daniel Suarez"	:"19",
			"Brad Keselowski":"2",
			"Matt Kenseth":"20",
			"Ryan Blaney":"21",
			"Joey Logano":"22",
			"Ryan Sieg":"83",
			"Corey LaJoie":"23",
			"Gray Gaulding":"15",
			"Alon Day":"23",
			"Chase Elliott":"24",
			"Paul Menard":"27",
			"Austin Dillon":"3",
			"Ryan Newman":"31",
			"Matt DiBenedetto":"83",
			"Boris Said":"33",
			"Jeffrey Earnhardt":"32",
			"Landon Cassill":"38",
			"Chris Buescher":"34",
			"David Ragan":"23",
			"Kevin Harvick":"4",
			"Kurt Busch":"41",
			"Kyle Larson":"42",
			"Regan Smith":"7",
			"Aric Almirola":"43",
			"Billy Johnson":"43",
			"Darrell Wallace Jr":"43",
			"AJ Allmendinger":"47",
			"Jimmie Johnson":"48",
			"Kasey Kahne":"5",
			"B.J. McLeod":"51",
			"Timmy Hill":"66",
			"Cody Ware":"51",		
			"Josh Bilicki":"51",
			"Derrike Cope":"55",
			"Tommy Regan":"55",
			"Trevor Bayne":"6",
			"Carl Long":"66",
			"Elliott Sadler":"7",
			"J.J. Yeley":"7",
			"Cole Whitt":"98",
			"Brendan Gaughan":"75",
			"Erik Jones":"77",
			"Martin Truex Jr":"78",
			"Dale Earnhardt Jr.":"88",
			"Alex Bowman":"88",
			"Michael McDowell":"95"
        }
           
       },
       
       // Define required scripts.
       getScripts: function() {
           return ["moment.js"];
       },
       
       getStyles: function() {
           return ["MMM-Nascar.css"];
       },

       // Define start sequence.
       start: function() {
           Log.info("Starting module: " + this.name);
           
           requiresVersion: "2.1.1",
           
           // Set locale.
           this.url = "http://www.nascar.com/cacher/2017/1/points-feed.json";
           this.nascar = {};
           this.today = "";
           this.activeItem = 0;
           this.rotateInterval = null;
           this.scheduleUpdate();
       },
       
    processNascar: function(data) {
         this.nascar = data;
         this.loaded = true;
     },
     
    scheduleCarousel: function() {
       		console.log("Scheduling Nascar items");
	   		this.rotateInterval = setInterval(() => {
				this.activeItem++;
				this.updateDom(this.config.animationSpeed);
			}, this.config.rotateInterval);
	   },
     
     scheduleUpdate: function() {
         setInterval(() => {
             this.getNascar();
         }, this.config.updateInterval);
         this.getNascar(this.config.initialLoadDelay);
         var self = this;
     },

     getNascar: function() {
         this.sendSocketNotification('GET_NASCAR', this.url);
     },

     socketNotificationReceived: function(notification, payload) {
         if (notification === "NASCAR_RESULT") {
             this.processNascar(payload);
             if(this.rotateInterval == null){
			   	this.scheduleCarousel();
			   }
               this.updateDom(this.config.animationSpeed);
         }
         this.updateDom(this.config.initialLoadDelay);
     },

      getDom: function() {

         var humordiv = document.createElement("div");
           humordiv.classList.add("light", "xsmall");
           humordiv.style.maxWidth = this.config.maxWidth;
           
           var today = moment().format('M-D-YYYY');
          var wrapper = document.createElement("div");
          wrapper.classList.add("open");
          if (this.config.header == true){
		   var header = document.createElement("header");
          header.innerHTML = "<img src=modules/MMM-Nascar/images/nascar.png> as of "+today;
          wrapper.appendChild(header);	
		  }
		  
          if (!this.loaded) {
             wrapper.classList.add("wrapper", "open");
             wrapper.innerHTML = "Nascar speeding up...";
             wrapper.className = "bright light small";
             return wrapper;
			}  

          var keys = Object.keys(this.nascar);
              if (keys.length > 0) {
            if (this.activeItem >= keys.length) {
                this.activeItem = 0;
           }
           var nascar = this.nascar[keys[this.activeItem]];
          
          
            var nascarTable = document.createElement("table");
            nascarTable.setAttribute('style', 'table-layout:fixed;');
           
            var locationRow = document.createElement("tr");
            
            var dposition = document.createElement("th"); 
			dposition.classList.add("xsmall","bright");
			dposition.innerHTML = "Position";
			locationRow.appendChild(dposition);
			nascarTable.appendChild(locationRow);
			
			var driver = document.createElement("th"); 
			driver.classList.add("xsmall","bright");
			driver.innerHTML = "Driver";
			locationRow.appendChild(driver);
			nascarTable.appendChild(locationRow);

	        var Tpoints = document.createElement("th"); 
			Tpoints.classList.add("xsmall","bright");
			Tpoints.innerHTML = "Points";
			locationRow.appendChild(Tpoints);
			nascarTable.appendChild(locationRow);

			var playpoints = document.createElement("th"); 
			playpoints.classList.add("xsmall","bright");
			playpoints.innerHTML = "Playoff PTS";
			locationRow.appendChild(playpoints);
			nascarTable.appendChild(locationRow);
			
			var playrank = document.createElement("th"); 
			playrank.classList.add("xsmall","bright");
			playrank.innerHTML = "Playoff Rank";
			locationRow.appendChild(playrank);
			nascarTable.appendChild(locationRow);
			
			var bonusPTS = document.createElement("th"); 
			bonusPTS.classList.add("xsmall","bright");
			bonusPTS.innerHTML = "Bonus PTS";
			locationRow.appendChild(bonusPTS);
			nascarTable.appendChild(locationRow);
			
			var starts = document.createElement("th"); 
			starts.classList.add("xsmall","bright");
			starts.innerHTML = "Starts";
			locationRow.appendChild(starts);
			nascarTable.appendChild(locationRow);
			
			var wins = document.createElement("th"); 
			wins.classList.add("xsmall","bright");
			wins.innerHTML = "Wins";
			locationRow.appendChild(wins);
			nascarTable.appendChild(locationRow);
			
			var top5wins = document.createElement("th"); 
			top5wins.classList.add("xsmall","bright");
			top5wins.innerHTML = "Top 5 Wins";
			locationRow.appendChild(top5wins);
			nascarTable.appendChild(locationRow);
			
			var top10wins = document.createElement("th"); 
			top10wins.classList.add("xsmall","bright");
			top10wins.innerHTML = "Top 10 Wins";
			locationRow.appendChild(top10wins);
			nascarTable.appendChild(locationRow);
			
			var nfinish = document.createElement("th"); 
			nfinish.classList.add("xsmall","bright");
			nfinish.innerHTML = "DNF";
			locationRow.appendChild(nfinish);
			nascarTable.appendChild(locationRow);
			
			var npoles = document.createElement("th"); 
			npoles.classList.add("xsmall","bright");
			npoles.innerHTML = "Poles";
			locationRow.appendChild(npoles);
			nascarTable.appendChild(locationRow);
			
			
			humordiv.appendChild(nascarTable);
			wrapper.appendChild(humordiv);
			
			var row = document.createElement("tr");
			
		    var dposition = document.createElement("td");
			dposition.classList.add("xsmall","bright");
	        dposition.innerHTML = nascar.position;	
			row.appendChild(dposition);
			nascarTable.appendChild(row);
			
			
			var ddriver = document.createElement("td");
			ddriver.classList.add("xsmall","bright");
			if (this.config.driverTable[nascar.driver_name] != undefined){
			ddriver.innerHTML = "#"+this.config.driverTable[nascar.driver_name] + " - " + nascar.driver_name;	
			} else {
			ddriver.innerHTML = nascar.driver_name;	
			}	
			row.appendChild(ddriver);
			nascarTable.appendChild(row);
			
			var pts = document.createElement("td");
			pts.classList.add("xsmall","bright");
	        pts.innerHTML = nascar.points;	
			row.appendChild(pts);
			nascarTable.appendChild(row);
			
			var ppts = document.createElement("td");
			ppts.classList.add("xsmall","bright");
	        ppts.innerHTML = nascar.playoff_points;	
			row.appendChild(ppts);
			nascarTable.appendChild(row);
			
			var prank = document.createElement("td");
			prank.classList.add("small","bright");
	        prank.innerHTML = nascar.playoff_rank;	
			row.appendChild(prank);
			nascarTable.appendChild(row);
			
			var bpts = document.createElement("td");
			bpts.classList.add("xsmall","bright");
	        bpts.innerHTML = nascar.bonus_points;	
			row.appendChild(bpts);
			nascarTable.appendChild(row);
			
			var dstarts = document.createElement("td");
			dstarts.classList.add("xsmall","bright");
	        dstarts.innerHTML = nascar.starts;	
			row.appendChild(dstarts);
			nascarTable.appendChild(row);
			
			var dwins = document.createElement("td");
			dwins.classList.add("xsmall","bright");
	        dwins.innerHTML = nascar.wins;	
			row.appendChild(dwins);
			nascarTable.appendChild(row);
			
			var dtop5 = document.createElement("td");
			dtop5.classList.add("xsmall","bright");
	        dtop5.innerHTML = nascar.top_5;	
			row.appendChild(dtop5);
			nascarTable.appendChild(row);
			
			
			var dtop10 = document.createElement("td");
			dtop10.classList.add("xsmall","bright");
	        dtop10.innerHTML = nascar.top_10;	
			row.appendChild(dtop10);
			nascarTable.appendChild(row);
			
			var dNotF = document.createElement("td");
			dNotF.classList.add("xsmall","bright");
	        dNotF.innerHTML = nascar.dnf;	
			row.appendChild(dNotF);
			nascarTable.appendChild(row);
			
			var dpole = document.createElement("td");
			dpole.classList.add("xsmall","bright");
	        dpole.innerHTML = nascar.poles;	
			row.appendChild(dpole);
			nascarTable.appendChild(row);
           
			}
			return wrapper;
			},
     
     
 });
