var map = L.map('leafletmap').setView([55, 0], 7);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

L.tileLayer('https://tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openrailwaymap.org/">OpenRailWayMap</a>'
}).addTo(map);



var markers = new Array()

//train_id: schedule
var scheduleDict = {}

var currentLiveSchedule = new Array()

function GetTrainSchedule(trainId){
  return new Promise(function(_callback){
    if(trainId in scheduleDict){
      _callback(scheduleDict[trainId])
    } else {
      getData(api_trainschedule + "/" + trainId)
        .then((json) => {
          scheduleDict[trainId] = json
          _callback(scheduleDict[trainId])
        })
        .catch(err => console.log("Error: " + err));
    }
  })
}

function DisplayTrainRoute(trainId) {
  GetTrainSchedule(trainId).then(function (schedule) {
    for (let marker of markers){
      map.removeLayer(marker)
    }
    for (const station of schedule) {
      if (station.latLong) {
        const lat = station.latLong.latitude
        const long = station.latLong.longitude
        markers.push(L.marker([lat, long], { icon: blueIcon }).addTo(map))
      }
    }
  })
}

function DisplaySideBarRoute(trainId){
  GetTrainSchedule(trainId).then(function (schedule) {
    for (const station of schedule) {
      //display on sidebar
    }
  })
}

//display last location
function DisplayLastLocation(schedule) {
  let trainId = `${schedule.activationId}/${schedule.scheduleId}`
  getData(api_livetrain + "/" + trainId)
    .then((json) => {
      const lastUpdate = json[json.length - 1]
      if (lastUpdate) {
        if (lastUpdate.latLong) {
          const lat = lastUpdate.latLong.latitude
          const long = lastUpdate.latLong.longitude
          L.marker([lat, long], { icon: redIcon }).addTo(map).on('click', function() { OnTrainClicked(trainId) })
        }
      }
    })
    .catch(err => console.log("Error: " + err));  
}

function OnTrainClicked(trainId){
  let sidebar = document.getElementById("sidebar")
  if (sidebar.style.display === "none") {
    sidebar.style.display = "block"
  } else {
    sidebar.style.display = "block"
  }
  DisplayTrainRoute(trainId)
  DisplaySideBarRoute(trainId)
}

// blue = route
var blueIcon = L.icon({
  iconUrl: '/icons/Blue.png',
  iconSize: [15, 15], // size of the icon
});
// red = stations
var redIcon = L.icon({
  iconUrl: '/icons/Red.png',
  iconSize: [50, 50], // size of the icon
});

async function getData(url) {
  const response = await fetch(url);
  const json = await response.json();
  return json;
}

//this is the progress button
//button2
const button2 = document.getElementById("button-Progress");
const label2 = document.getElementById("hide-train");

button2.addEventListener("click", function () {
  if (label2.style.display === "block") {
    label2.style.display = "none"
  }
  else {
    label2.style.display = "block"
    label.style.display = "none"
    displayTrainInfo();
  }
})

//this is the notes button
//button
const button = document.getElementById("button-Notes");
const label = document.getElementById("hide");

button.addEventListener("click", function () {
  if (label.style.display === "block") {
    label.style.display = "none"

  }
  else {
    label.style.display = "block"
    label2.style.display = "none"
  }
});


//Display Trains

let api_schedule = "http://localhost:3000/api/schedule";
let api_trainschedule = "http://localhost:3000/api/trainschedule";
let api_livetrain = "http://localhost:3000/api/livetrain";

getData(api_schedule)
  .then((json) => {
    currentLiveSchedule = json
    for (let schedule of json) {
      DisplayLastLocation(schedule)
    }
  })
  .catch(err => console.log("Error: " + err));
