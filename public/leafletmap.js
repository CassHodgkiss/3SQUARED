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
var trainScheduleDict = {}
var liveScheduleDict = {}
var filtered_liveScheduleDict = {}


function GetTrainSchedule(trainId){
  return new Promise(function(_callback){
    if(trainId in trainScheduleDict){
      _callback(trainScheduleDict[trainId])
    } else {
      getData(api_trainschedule + "/" + trainId)
        .then((json) => {
          trainScheduleDict[trainId] = json
          _callback(trainScheduleDict[trainId])
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
    console.log(schedule)
    console.log(filtered_liveScheduleDict[trainId])
    for (const station of schedule) {
      if (station.latLong) {
        const lat = station.latLong.latitude
        const long = station.latLong.longitude
        const liveData = filtered_liveScheduleDict[trainId]
        let variation = liveData.get(station.tiploc)?.variation
        if(!variation){
          markers.push(L.marker([lat, long], { icon: futureIcon }).addTo(map))
        } else {
          if(variation > 0) {
            markers.push(L.marker([lat, long], { icon: lateIcon }).addTo(map))
          }
          else{
            markers.push(L.marker([lat, long], { icon: earlyIcon }).addTo(map))
          }
        }

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
function DisplayLiveTrainPositions(trainId) {
  getData(api_livetrain + "/" + trainId)
    .then((json) => {
      liveScheduleDict[trainId] = json
      filtered_liveScheduleDict[trainId] = FilterLiveTrainData(json)
      const lastUpdate = json[json.length - 1]
      if (lastUpdate) {
        let schedule = scheduleDict[trainId]
        if (lastUpdate.latLong) {
          if(!(lastUpdate.tiploc == schedule.destinationTiploc)) {
            const lat = lastUpdate.latLong.latitude
            const long = lastUpdate.latLong.longitude
            L.marker([lat, long], { icon: trainIcon }).addTo(map).on('click', function() { OnTrainClicked(trainId) })
          }
        }
      }
    })
    .catch(err => console.log("Error: " + err));  
}

function FilterLiveTrainData(trainData){
  var dict = new Map()
  for (let data of trainData){
    dict.set(data.tiploc, data)
  }
  return dict
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

var earlyIcon = L.icon({
  iconUrl: '/icons/Early.png',
  iconSize: [20, 20],
});
var lateIcon = L.icon({
  iconUrl: '/icons/Late.png',
  iconSize: [20, 20],
});
var futureIcon = L.icon({
  iconUrl: '/icons/Future.png',
  iconSize: [20, 20],
});
var noReportIcon = L.icon({
  iconUrl: '/icons/NoReport.png',
  iconSize: [20, 20],
});
var trainIcon = L.icon({
  iconUrl: '/icons/Train.png',
  iconSize: [50, 50],
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
    for (let schedule of json) {
      let trainId = `${schedule.activationId}/${schedule.scheduleId}`
      scheduleDict[trainId] = schedule
      DisplayLiveTrainPositions(trainId)
    }
  })
  .catch(err => console.log("Error: " + err));
