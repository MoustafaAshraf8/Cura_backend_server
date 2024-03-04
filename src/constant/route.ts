const serverRoute = {
  baseUrl: "/api",
};

const patientRoute = {
  baseUrl: `${serverRoute.baseUrl}/patient`,
  root: "/",
  login: "/login",
  signup: "/signup",
  emr: "/emr",
};

const doctorRoute = {
  baseUrl: `${serverRoute.baseUrl}/doctor`,
  root: "/",
  login: "/login",
  signup: "/signup",
  schedule: "/schedule",
  timeSlot: "/timeslot",
};

export { patientRoute, serverRoute, doctorRoute };
