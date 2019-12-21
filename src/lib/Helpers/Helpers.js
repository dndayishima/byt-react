import _ from "lodash";
import moment from "moment";
import { currencies, codesMarchands } from "./Settings";

const getJWTPayload = jwt => { // gérer les cas d'erreurs
  let userBase64 = jwt.split(".")[1];
  let u = JSON.parse(atob(userBase64));
  return u;
}; // n'est plus utilisé

const imageHasPrefix = base64 => {
  let regex = /^(data:image\/[a-z]+;base64,)/;
  return (regex.test(base64));
};

const truncateString = (str, num) => {
  if (str.length <= num) {
    return str
  }
  return str.slice(0, num) + "..."
};

const getAllCurrencies = () => {
  return currencies;
};

const getCurrencySymbol = strCurrency => {
  for (let i = 0; i < currencies.length; i++) {
    if (currencies[i].currency === strCurrency) {
      return currencies[i].symbol;
    }
  }
  return "";
};

const getValueOfOptionalString = str => {
  if (_.isNull(str) || _.isUndefined(str)) {
    return "";
  }
  return str;
};

const displayDate = (date, lang) => {
  if (lang === "en") {
    return moment(date).format("MM/DD/YYYY");
  }
  return moment(date).format("DD/MM/YYYY")
};

const displayTime = (date, lang) => {
  if (lang === "en") {
    return moment.parseZone(date).format("LT");
  }
  return moment.parseZone(date).format("HH:mm"); // attention à ce qui est retourné ici
};

const priceValuePrinting = (priceValue, lang) => {
  if (lang === "en") {
    return Number(priceValue).toLocaleString("en-EN");
  }
  return Number(priceValue).toLocaleString("fr-FR");
};

const signOut = () => {
  localStorage.setItem("jwt", "");
  localStorage.setItem("userCode", "");
  // ici il faudra gérer le changement d'URL si besoin
  window.location.reload();
};

const getAllCodesMarchands = () => {
  return codesMarchands;
};

export {
  displayDate,
  displayTime,
  getJWTPayload,
  imageHasPrefix,
  truncateString,
  getAllCodesMarchands,
  getAllCurrencies,
  getCurrencySymbol,
  getValueOfOptionalString,
  priceValuePrinting,
  signOut
};