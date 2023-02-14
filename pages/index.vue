<template>
    <div id="map-container">
        <div id="sidebar">
            <h1>Train Information</h1>
            <p> Schdeule</p>
            <p> Notes</p>
        </div>

        <!-- this is the map -->
        <div id="leafletmap"></div>
    </div>
    <!-- this is the footer -->
    <footer>
        <p>Copyright &copy; 2023 3Squared</p>
    </footer>
</template>

<script setup lang="ts">




const url_schedules = "https://traindata-stag-api.railsmart.io/api/trains/tiploc/CREWEMD,WLSDEUT,LOWFRMT,WLSDRMT,CARLILE,MOSEUPY,STAFFRD,DONCIGB,THMSLGB,FLXSNGB/2023-02-14 00:00:00/2023-02-14 23:59:59";
const url_trainSchedules = "https://traindata-stag-api.railsmart.io/api/ifmtrains/schedule/"
const url_liveTrain = "https://traindata-stag-api.railsmart.io/api/ifmtrains/movement/"

let code = ""

await useFetch(url_schedules, {
    headers: {
        'X-ApiVersion': '1',
        'X-ApiKey': useRuntimeConfig().apiKey
    },
    onResponse({ response }) {

        const scheduleJSON = JSON.parse(JSON.stringify(response._data)) as Array<Schedule>

        console.log(scheduleJSON)

        scheduleJSON.forEach(async s => {
            let scheduleId = s.scheduleId
            let activationId = s.activationId

            let url = url_trainSchedules + activationId + "/" + scheduleId 

            await useFetch(url, {
                headers: {
                    "X-ApiVersion": "1",
                    "X-ApiKey": useRuntimeConfig().apiKey,
                },
                onResponse({ response }) {
                    const trainSchedulesJSON = JSON.parse(JSON.stringify(response._data)) as Array<TrainSchedule>
            
                    trainSchedulesJSON.forEach(ts => {
                        if(ts.latLong)
                            code += 'L.marker([' + ts.latLong?.latitude + ', ' + ts.latLong?.longitude + ']).addTo(map);'
                    })
                }
            })
        })
    }
})





useHead({
    title: '3Squared',
    link: [
        {
            rel: 'stylesheet',
            integrity: 'sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI=',
            href: 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.css',
            crossorigin: ''
        }
    ],
    script: [
        {
            src: 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.js',
            integrity: 'sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM=',
            crossorigin: '',
        },
        {
            src: '/leafletmap.js',
            body: true
        },
        {
            children: code
        }
    ],
    
})

</script>

<style scoped>
html,body {height:100%} 
footer {
    background-color: #f9f9f9;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #000;
    font-size: 1.2em;
    font-family: Arial, sans-serif;
    color: #333;
}
/*test */

/*Sidebar*/ 
#sidebar {
    width: 200px;
    background-color: #e6f0f5;
    float: left;
    padding-left: 20px;
    height: 500px;
    border-right: 4px solid rgb(255, 255, 255);
    display: none;
}

/*map*/ 
#leafletmap {
    height: 600px;
    width: calc(100%-300px);
    float: center;
    padding-left: 20px;
    
}

/*nav*/ 
nav {
    background-color: #f0f5f5;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #3282b8;
    width: 100%;
}

nav a {
    color: #3282b8;
    text-decoration: none;
    font-size: 1.4em;
    margin-right: 20px;
    position: relative;
    transition: all 0.3s ease-in-out;
}

nav ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
}

nav li {
    margin: 0 10px;
}


nav a:before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #3282b8;
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.3s ease-in-out;
}

nav a:hover:before {
    transform: scaleX(1);
    transform-origin: left;
}
</style>