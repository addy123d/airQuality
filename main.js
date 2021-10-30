 // How Do Different Pollutants Affect The Human Body?
    // PM10 gets filtered at the top of your respiratory system that is nose. 
    // PM2.5 is the hazardous of the lot. 70-80 per cent of the health issues are caused by PM2.5 only as it crosses body’s natural barriers, and enter the lungs.
    // Ozone is the second most dangerous parameter as it aggravate lung diseases such as asthma, emphysema, and chronic bronchitis, IIT Kanpur Scientist and Professor, Sachchida Nand Tripathi.
    // Resource URL : https://swachhindia.ndtv.com/air-pollution-what-is-air-quality-index-how-is-it-measured-and-its-health-impact-40387/



    // TODO : 
    //[x] Input location from users.
    //[x] Get latitude and longitude of location.
    //[x] Using latitude and longitude values, we can get air quality of that region.
    //[x] : Collect data in array or any other data structure. (We will be using arrays !)
    //[x] : Plot search history on map using leaflet.

    console.log("Air quality Project !");

    // Grab all html elements !
    // const,let - data types in javascript
    const cityName = document.querySelector("#cityName");
    const submit_button = document.querySelector("#submit");

    const airData = {};


    console.log(localStorage);

    console.log(JSON.parse(localStorage.getItem("history")));


    // Let's keep it open !


    const mymap = L.map('checkinMap').setView([0, 0], 1);
    const attribution =
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    //const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const tileUrl =
        'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png';
    const tiles = L.tileLayer(tileUrl, { attribution });
    tiles.addTo(mymap);

    getData();

    function getData() {
        const data = JSON.parse(localStorage.getItem("history"));

        console.log("Data: ",data);

        if(data === null) return;

        for (item of data) {
            const marker = L.marker([item.latitude, item.longitude]).addTo(mymap);
            let txt = `The AIR Quality at ${item.city} is ${item.airQuality}`;

       
                txt += ` Remark is ${item.remark}
                            last read on ${item.timeStamp}`;
        
            marker.bindPopup(txt);
        }
        console.log(data);
    }



    // Store data in localstorage and map data 

    function storeData(data) {
        const history_data = localStorage.getItem("history");

        let history;

        if (history_data === null) {
            history = [];
        } else {
            history = JSON.parse(history_data);
        }

        history.push(data);

        console.log("History Array: ");
        console.log(history);

        localStorage.setItem("history", JSON.stringify(history));

        // Load Map 
        getData();
    }


    function airQuality(latitude, longitude) {
        fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=`)
            .then(function (res) {
                return res.json();
            })
            .then(function (response) {
                console.log("AIR Quality Data: ");

                // We will concentrate on particulate matter 2.5 as it is the most lethal component for determining air quality.
                console.log(response.list[0].components.pm2_5);

                // Print value on page

                document.querySelector(".value").innerHTML = `<p>AQI ${response.list[0].components.pm2_5}%</p>`;

                // Call AIR Quality function !
                let airQualityData = response.list[0].components.pm2_5;

                let remark;

                // Air quality chart - https://w.ndtvimg.com/sites/3/2019/12/18122812/air_pollution_standards_cpcb.png
                // Add remark according to pm2_5 value 

                if (airQualityData >= 0 && airQualityData <= 50) {
                    // Good Remark
                    remark = "good";

                } else if (airQualityData >= 101 && airQualityData <= 200) {
                    // Moderate Remark
                    remark = "moderate";

                } else if (airQualityData >= 301 && airQualityData <= 400) {
                    // Very Poor
                    remark = "poor";

                } else {
                    // No remark set 

                    remark = "NO REMARK SET"
                }

                // Time Stamp 
                let time = new Date().toTimeString();

                // Store airqualitydata, remark, time

                airData.airQuality = airQualityData;
                airData.remark = remark;
                airData.timeStamp = time;

                console.log("Final Data: ", airData);

                // Push this Data into history array

                // historyData.push(airData);

                // console.log("History Array: ");
                // console.log(historyData);

                // 
                storeData(airData);

            })
            .catch(err => console.error("Error: ", err));
    }



    submit_button.onclick = function () {

        // Debug city name !
        console.log("City: ", cityName.value);

        // Get latitude and longitude of location.
        // Use fetch and fetch city lat and lon values !

        fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName.value.toLowerCase()}&limit=5&appid=`)
            .then(function (res) {
                return res.json()
            })
            .then(function (response) {
                console.log("Latitude: ", response[0].lat);
                console.log("Longitude: ", response[0].lon);

                // Create data Object !

                airData.city = cityName.value;
                airData.latitude = response[0].lat;
                airData.longitude = response[0].lon;

                console.log(airData);


                // Call Air Quality Function !
                airQuality(response[0].lat, response[0].lon);

            })
            .catch(err => console.log("Error: ", err));


            cityName.value = "";
    }
