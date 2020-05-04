import _ from "lodash";
import moment from "moment";
import { basename, currencies, codesMarchands } from "./Settings";

const imageHasPrefix = base64 => {
  let regex = /^(data:image\/[a-z]+;base64,)/;
  return (regex.test(base64));
};

/*const truncateString = (str, num) => {
  if (str.length <= num) {
    return str
  }
  return str.slice(0, num) + "..."
};*/

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
    return moment(date).format("YYYY-MM-DD");
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

const localStorageCleanInfosUser = () => {
  localStorage.setItem("jwt", "");
  localStorage.setItem("userCode", "");
};

const signOut = () => {
  localStorageCleanInfosUser();
  // ici il faudra gérer le changement d'URL si besoin
  let a = document.createElement("a");
  a.href = `${basename}/#/login`;
  a.click();
};

const getAllCodesMarchands = () => {
  return codesMarchands;
};

const userIsAdmin = arrayRoles => {
  return _.includes(arrayRoles, "ADMIN");
};

const userIsSeller = arrayRoles => {
  return _.includes(arrayRoles, "SELLER");
};

const userIsTech = arrayRoles => {
  return _.includes(arrayRoles, "TECH");
};

const userIsAuthenticated = () => {
  if (
    _.isEmpty(_.get(localStorage, "jwt", "")) ||
    _.isEmpty(_.get(localStorage, "userCode", ""))
  ) {
    return false;
  }
  return true;
};

/*const changeLocationURL = location => {
  let a = document.createElement("a");
  a.href = location;
  a.click();
};*/

export {
  //changeLocationURL,
  displayDate,
  displayTime,
  imageHasPrefix,
  //truncateString,
  getAllCodesMarchands,
  getAllCurrencies,
  getCurrencySymbol,
  getValueOfOptionalString,
  localStorageCleanInfosUser,
  priceValuePrinting,
  signOut,
  userIsAdmin,
  userIsAuthenticated,
  userIsSeller,
  userIsTech
};