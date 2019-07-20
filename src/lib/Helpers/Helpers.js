const getJWTPayload = jwt => {
  //console.log(jwt);
  let userBase64 = jwt.split(".")[1];
  //console.log(atob(userBase64));
  let u = JSON.parse(atob(userBase64));
  console.log(u);
};

export { getJWTPayload };