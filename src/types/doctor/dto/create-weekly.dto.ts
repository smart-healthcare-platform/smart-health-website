export interface WeeklyAvailabilityDto {
    day_of_week: DayOfWeek;
    start_time: string;
    end_time: string;
}

export enum DayOfWeek {
    MON = "MON",
    TUE = "TUE",
    WED = "WED",
    THU = "THU",
    FRI = "FRI",
    SAT = "SAT",
    SUN = "SUN",
}
export interface WeeklyAvailabilityUI extends WeeklyAvailabilityDto {
    selected: boolean; 
}
