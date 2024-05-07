const serverRoute = {
  baseUrl: "/api",
};

const patientRoute = {
  baseUrl: `${serverRoute.baseUrl}/patient`,
  root: "/",
  login: "/signin",
  signup: "/signup",
  emr: "/emr",
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
