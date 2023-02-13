<template>

<p>Map</p>
<div id="leafletmap"></div>
<p v-for="s in json">{{ s }}</p>

</template>

<script setup lang="ts">

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
        }
    ],
    
})

const url = 'https://traindata-stag-api.railsmart.io/api/trains/tiploc/CREWEMD,WLSDEUT,LOWFRMT,WLSDRMT,CARLILE,MOSEUPY,STAFFRD,DONCIGB,THMSLGB,FLXSNGB/2023-02-13 00:00:00/2023-02-13 23:59:59'

let { data: schedule } = await useFetch<string>(
    url, {
    headers: {
        'X-ApiVersion': '1',
        'X-ApiKey': useRuntimeConfig().apiKey
    }
})

let json = JSON.stringify(schedule);

var latlongs = [[51, -1], [51, 0], [51, 1]]

var js = document.createElement('script');
js.setAttribute('type', 'text/javascript');

latlongs.forEach(latlong => {   
    js.appendChild(document.createTextNode('L.marker([' + latlong[0] + ', ' + latlong[1] + ']).addTo(map);'))
})

document.getElementsByTagName('head').item(0).appendChild(js)


</script>

<style scoped>
    #leafletmap { height: 500px; }
</style>