export interface Schedule_Interface {
  Day: Enumerator<
    [
      "saturday",
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday"
    ]
  >;
  Date: Date;
}
