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
};

export { patientRoute, serverRoute, doctorRoute };
