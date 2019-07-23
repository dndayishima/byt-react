const getJWTPayload = jwt => { // gérer les cas d'erreurs
  let userBase64 = jwt.split(".")[1];
  let u = JSON.parse(atob(userBase64));
  return u;
};

export { getJWTPayload };