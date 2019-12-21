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

// codes marchands disponibles (pour le test)
const codesMarchands = [
  { 
    operator: "Econet-Leo (Ecocash)",
    codeMarchand: "55034",
    currency: "BIF",
    country: "Burundi",
    idPhoto: 0
  },
  {
    operator: "Limitel (Lumicash)",
    codeMarchand: "27049",
    currency: "BIF",
    country: "Burundi",
    idPhoto: 1
  },
  {
    operator: "Smart (Smart Pesa)",
    codeMarchand: "34015",
    currency: "BIF",
    country: "Burundi",
    idPhoto: 2
  },
  {
    operator: "Finbank (Pesa Flash)",
    codeMarchand: "44863",
    currency: "BIF",
    country: "Burundi",
    idPhoto: 3
  },
  {
    operator: "Bancobu (mcash)",
    codeMarchand: "16782",
    currency: "BIF",
    country: "Burundi",
    idPhoto: 4
  }
];

export { authUrl, apiUrl, currencies, codesMarchands };