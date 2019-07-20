import React from 'react';

import { Client, Connexion/*, Register*/ } from "./lib";

const client = new Client("http://localhost:8000", "");
export default class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Connexion 
          client={client}
          lang="ki"
        />
        {/*<Register 
          client={client}
          //lang="en"
        />*/}
      </React.Fragment>
    );
  }
}
