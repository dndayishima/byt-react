import React from 'react';

import { Button, Paper } from "@material-ui/core";

import { Client, Connexion, Register/*, SettingsView*/, Title } from "./lib";

import { authUrl, apiUrl } from "./lib/Helpers/Settings";

import _ from "lodash";

import logo from "./byt-logo.jpeg";

import { dictionnary } from "./lib/Langs/langs";

const client = new Client(authUrl, apiUrl);

const styles = {
  connexion: {
    paddingTop: "20px",
    paddingLeft: "10px",
    paddingRight: "10px",
    margin: "0 auto",
    maxWidth: "600px",
    display: "flex",
    flexDirection: "column",
    width: "Auto"
  }
};

export default class App extends React.Component {
  state = {
    jwt: _.get(localStorage, "jwt", ""),
    page: "connexion",
    lang: _.get(localStorage, "lang", "fr")
  };

  render() {
    let lang = _.toUpper(this.state.lang);
    let createAccount = _.get(dictionnary, lang + ".createAccount");
    let cancel = _.get(dictionnary, lang + ".cancel");
    let register = _.get(dictionnary, lang + ".register");
    return (
      <React.Fragment>
        {_.isEmpty(this.state.jwt)
          ? this.state.page === "connexion"
            ? <div style={styles.connexion}>
                <Paper
                  elevation={2}
                  style={{ paddingLeft: "10px", paddingRight: "10px", paddingBottom: "25px" }}
                >
                  <div style={{ textAlign: "center" }} >
                    <img src={logo} height="120" width="auto" alt="logo"/>
                  </div>
                  <Connexion
                    client={client}
                    lang={this.state.lang}
                  />
                  <Button
                    fullWidth={true}
                    variant="contained"
                    style={{ marginTop: "15px" }}
                    onClick={() => this.setState({ page: "register" })}
                  >
                    {createAccount}
                  </Button>
                </Paper>
              </div>
            : this.state.page === "register"
              ? <div style={styles.connexion}>
                  <Title 
                    title={_.upperFirst(register)}
                  />
                  <Register 
                    client={client}
                    lang={this.state.lang}
                    onSuccess={() => this.setState({ page: "connexion" })}
                  />
                  <Button
                    fullWidth={true}
                    variant="contained"
                    style={{ marginTop: "10px" }}
                    onClick={() => this.setState({ page: "connexion" })}
                  >
                    {cancel}
                  </Button>
                </div>
              : null
          : null
        }
        {/* <Connexion 
          client={client}
          lang="ki"
        /> */}
        {/*<Register 
          client={client}
          //lang="en"
        />*/}
        {/* <div>
          <SettingsView
            lang={this.state.lang}
            onChangeLanguage={lang => {
              localStorage.setItem("lang", lang);
              this.setState({ lang: _.get(localStorage, "lang", "fr") });
            }}
          />
        </div> */}
      </React.Fragment>
    );
  }
}
