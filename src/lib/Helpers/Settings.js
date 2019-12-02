// Paramètres généraux de l'application
//const authUrl = "https://demoauth.bytpayment.com";
//const apiUrl = "https://demoapi.bytpayment.com";
const authUrl = "http://localhost:8080";
const apiUrl = "http://localhost:8081";

// devises disponibles
const currencies = [
  { currency: "BIF", symbol: "BIF" },
  { currency: "USD", symbol: "$"}
];

export { authUrl, apiUrl, currencies };