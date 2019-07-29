const getJWTPayload = jwt => { // gérer les cas d'erreurs
  let userBase64 = jwt.split(".")[1];
  let u = JSON.parse(atob(userBase64));
  return u;
};

const imageHasPrefix = base64 => {
  let regex = /^(data:image\/[a-z]+;base64,)/;
  return (regex.test(base64));
};

export { getJWTPayload, imageHasPrefix };