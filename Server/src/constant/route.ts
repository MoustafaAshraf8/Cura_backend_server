const serverRoute = {
  baseUrl: "/api",
};

const patientRoute = {
  baseUrl: `${serverRoute.baseUrl}/patient`,
  root: "/",
  signin: "/signin",
  signup: "/signup",
  emr: "/emr",
  allergy: "/allergy",
  allergyFileWithId: "/allergy/file/:id",
  chronicIllness: "/chronicIllness",
  chronicIllnessFileWithId: "/chronicIllness/file/:id",
  timeslotWithId: "/timeslot/:id",
  schedule: "/schedule",
  payOnline: "/payOnline",
};

const doctorRoute = {
  baseUrl: `${serverRoute.baseUrl}/doctor`,
  root: "/",
  login: "/login",
  signup: "/signup",
  mySchedule: "/schedule",
  scheduleWithId: "/schedule/:id",
  timeSlot: "/timeslot",
  timeSlotWithId: "/timeslot/:id",
  profile: "/profile/:id",
  reserved: "/schedule/reserved",
};

export { patientRoute, serverRoute, doctorRoute };
