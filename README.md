# PROJET BUY YOUR TICKET (FRONT-END WEB)

Application web `React JS` de la plateforme de billetterie événementiel en ligne `BYT`. Ce projet est basé sur un [Create React App](https://github.com/facebook/create-react-app), l'outil de création d'une application React.

Avant de lancer `byt-react`, il faudra s'assurer que les différentes applications Back-End exposant les APIs BYT soient en cours d'exécution.

Une version de démonstration de cette application est disponible en ligne sur [https://demo.bytpayment.com](https://demo.bytpayment.com).

## Quelques librairies utilisées

- [Axios](https://www.npmjs.com/package/axios), un client HTTP JavaScript, est utilisé pour effectuer des requêtes AJAX. Toutes les requêtes sont paramétrés dans le fichier [Client.js](https://github.com/dndayishima/byt-react/blob/master/src/lib/Helpers/Client.js) et les configurations des liens des APIs à consommer sont faites dans [Settings.js](https://github.com/dndayishima/byt-react/blob/master/src/lib/Helpers/Settings.js)
- [Material-UI](https://material-ui.com/) est la librairie utilisée pour les widgets graphiques
- [Lodash](https://lodash.com/) est utilisé comme utilitaire de fonctions standards JavaScript
- [Moment.js](https://momentjs.com/) est utilisé pour la manipulations des dates
- [react-router-dom](https://reactrouter.com/web/guides/quick-start) est utilisé pour la manipulation des URLs et correspondances `URL-Composant`

D'autres modules sont utilisés (voir [package.json](https://github.com/dndayishima/byt-react/blob/master/package.json)) par exemple pour afficher les graphiques, lire les QR codes, etc.

## Installation et test en mode développement

Dans un premier temps, il faut s'assurer d'avoir `Node.js` et `npm` installés sur le poste, [voir la documentation d'installation sur ubuntu](https://doc.ubuntu-fr.org/nodejs).

```bash
# Installation de la version 12.x (LTS support jusqu'à Novembre 2021)
wget -qO- https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Récupération des sources sur Github et exécution de l'application

```bash
git clone https://github.com/dndayishima/byt-react.git
cd byt-react

# basculement sur une branche souhaitée
git checkout master

# installation des dépendances
npm install

# lancement du serveur de développement (localhost)
npm start
```

## Guide de déploiement d'une application React
[Documentation officielle create-react-app](https://facebook.github.io/create-react-app/docs/deployment)

## Organisation du code source

Les sources JavaScript de ce projet se trouvent dans le répertoire [`./src/`](https://github.com/dndayishima/byt-react/tree/master/src) et les sources des composants `React` se trouvent dans [`./src/lib/`](https://github.com/dndayishima/byt-react/tree/master/src/lib).

Ces composants sont groupés selon leurs utilités : par exemple dans le groupe [`./src/lib/Event`](https://github.com/dndayishima/byt-react/tree/master/src/lib/Event), nous retrouvons les différents composants graphiques permettant d'afficher ou manipuler les évènements.

Le répertoire [`./src/lib/Helpers`](https://github.com/dndayishima/byt-react/tree/master/src/lib/Helpers) contient le paramétrage des requêtes AJAX (`Client.js`), la configuration du site (`Settings.js`) et quelques fonctions JavaScript utilisées un peu partout dans l'application (`Helpers.js`).

Le répertoire [`./src/lib/Langs`](https://github.com/dndayishima/byt-react/tree/master/src/lib/Langs) contient les fichiers de traduction de l'application dans d'autres langues.

Le point d'entrée de l'application React est le fichier [`index.js`](https://github.com/dndayishima/byt-react/blob/master/src/index.js) se trouvant dans `./src/`.

## Utilisation du localStorage JavaScript

Certaines informations sont stockées dans le [`localStorage`](https://developer.mozilla.org/fr/docs/Web/API/Window/localStorage), par exemple la langue à utiliser et la clé [JWT](https://jwt.io/) d'un utilisateur authentifié.