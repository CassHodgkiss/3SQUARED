interface TrainSchedule{
    departure?: string, /* expected departure time */
    arrival?: string,	/* expected arrival time */
    pass?: string, 	/* expected pass time */
    tiploc: string,	/* TIPLOC at location */
    location: string,	/* Name of location */
    latLong?: {	
       latitude: number,
       longitude: number
    }
  
}