const serverRoute = {
  baseUrl: "/api",
};

const patientRoute = {
  baseUrl: `${serverRoute.baseUrl}/patient`,
  root: "/",
  signin: "/signin",
  signup: "/signup",
  emr: "/emr",
  reserveTimeSlot: "/reserveTimeSlot",
  schedule: "/schedule",
  payOnline: "/payOnline",
};

const doctorRoute = {
  baseUrl: `${serverRoute.baseUrl}/doctor`,
  root: "/",
  login: "/login",
  signup: "/signup",
  mySchedule: "/schedule",
  schedule: "/schedule/:id",
  timeSlot: "/timeslot",
  profile: "/profile/:id",
};

export { patientRoute, serverRoute, doctorRoute };
