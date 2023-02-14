interface Schedule{
    originTiploc: string,		/* Starting location */
    destinationTiploc: string,	/* Terminating location */
    toc_Name: string,			/* Name of operator */
    sector_Code: number,		/* Unique ID of operator */
    activationId: number,		/* null if not confirmed running */
    scheduleId: number,			/* ID of this schedule */
    headCode: string,			/* Non-unique identifier for train */
    trainId: string,			/* Non-unique identifier for train */ 
    trainUid: string,			/* Non-unique identifier for train */
    trainServiceCode: string,		
    activatedDeparture: string,
    originLocation: string,		/* Name of starting location */
    scheduledDeparture: string,	/* Planned departure time from origin */
    scheduledArrival: string,		/* Planned arrival time at destination */
    destinationLocation: string,	/* Name of termination location */
    lastReportedDelay: number,	/* Current lateness in minutes */
    lastReportedLocation: string,	/* Last known location on the route */
    lastReportedType: string,
    cancelled: Boolean,			/* True if train is cancelled */
    cancelledAtOrigin: Boolean,	/* Train cancelled before leaving? */
    cancelledImmediatly: Boolean,
    cancelledEnRoute: Boolean,	/* Train cancelled after leaving? */
    cancelledOutOfPlan: Boolean,
    cancelledTimestamp: string,	/* When cancelled */
    scheduleCancelled: Boolean,	/* Whole schedule cancelled */
    scheduleJustForToday: Boolean,
    hasSchedule: Boolean,
    shouldHaveDepartedException: Boolean,
    offRoute: Boolean		
}