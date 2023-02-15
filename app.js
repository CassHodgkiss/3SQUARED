import express, { json } from 'express';
import fetch from 'node-fetch';


const app = express();



app.use(express.static("./public"));

app.use(json())

const PORT = process.env.PORT || 3000;

app.get("/api/schedule", async function(req, resp){
    const url = `https://traindata-stag-api.railsmart.io/api/trains/tiploc/CREWEMD,WLSDEUT,LOWFRMT,WLSDRMT,CARLILE,MOSEUPY,STAFFRD,DONCIGB,THMSLGB,FLXSNGB/2023-02-14 00:00:00/2023-02-15 23:59:59`;
    const options = {
        method: 'GET',
        headers: {
            'X-ApiVersion': "1",
            'X-ApiKey': 'AA26F453-D34D-4EFC-9DC8-F63625B67F4A'
        }
    };
    const apiResp = await fetch(url, options);
    const json = await apiResp.json();

    // Return the original response from the first API call
    resp.json(json);
})

app.get("/api/trainschedule", async function (req, resp) {
    
    let trainSchedules = []

	for (const item of json) {
        const { activationId, scheduleId } = item;
        const url = `https://traindata-stag-api.railsmart.io/api/ifmtrains/schedule/${activationId}/${scheduleId}`;
        const options = {
            method: 'GET',
            headers: {
                'X-ApiVersion': "1",
                'X-ApiKey': 'AA26F453-D34D-4EFC-9DC8-F63625B67F4A'
            }
        };
        const apiResp2 = await fetch(url, options);
        const json = await apiResp2.json();

        trainSchedules.push(json)
    }

    console.log(trainSchedules)

    // Return the original response from the first API call
    resp.send(trainSchedules)
})

app.listen(PORT, () => console.log(`App listening at port ${PORT}`));
