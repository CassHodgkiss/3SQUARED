interface LiveTrain{
    location: string,
    tiploc: string,
    eventType: string,	/* Pass, Arrival or Departure */
    planned: string,	/* Expected time of event */
    actual: string,	/* Actual time of event */
    variation: number,	/* difference between expected and actual in minutes */
    actualArrival: string,
    plannedArrival: string,
    plannedDeparture: string,
    actualDeparture: string,
    latLong: {
        latitude: number,
        longitude: number
    }
}