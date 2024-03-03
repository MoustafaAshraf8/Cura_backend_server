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

export { patientRoute, serverRoute };
