import React from 'react';

import { Client, Connexion, Main, Register } from "./lib";

import { authUrl, apiUrl } from "./lib/Helpers/Settings";

import _ from "lodash";

const client = new Client(authUrl, apiUrl);

export default class App extends React.Component {
  state = {
    jwt: _.get(localStorage, "jwt", ""),
    user: null,
    page: "connexion",
    lang: _.get(localStorage, "lang", "fr")
  };

  componentDidMount() {
    this.reloadUser();
  };

  reloadUser = () => {
    let userCode = _.get(localStorage, "userCode", "");
    if (_.isEmpty(userCode)) {
      return;
    }
    client.User.readByCode(
      userCode,
      result => {
        this.setState({ user: result.data.user });
      },
      error => {
        this.setState({ user: null });
      }
    );
  };

  onChangeLanguage = lang => {
    localStorage.setItem("lang", lang);
    this.setState({ lang: lang });
  };

  render() {
    return (
      <React.Fragment>
        {_.isEmpty(this.state.jwt)
          ? this.state.page === "connexion"
            ? <React.Fragment>
                <Connexion 
                  client={client}
                  lang={this.state.lang}
                  onSuccess={data => {
                    localStorage.setItem("jwt", data.jwt);
                    localStorage.setItem("userCode", data.user.code);
                    this.setState({ jwt: data.jwt, user: data.user });
                  }}
                  onClickRegister={() => this.setState({ page: "register" })}
                />
              </React.Fragment>
            : this.state.page === "register"
              ? <React.Fragment>
                  <Register 
                    client={client}
                    lang={this.state.lang}
                    edition={false}
                    user={this.state.user}
                    onCancel={() => this.setState({ page: "connexion" })}
                    onRegistration={() => this.setState({ page: "connexion" })}
                  />
                </React.Fragment>
              : null
          : <Main
              client={client}
              jwt={this.state.jwt}
              user={this.state.user}
              lang={this.state.lang}
              onChangeLanguage={lang => this.onChangeLanguage(lang)}
              onRelogin={(jwt, user) => {
                localStorage.setItem("jwt", jwt);
                localStorage.setItem("userCode", user.code);
                this.setState({ jwt: jwt, user: user });
              }}
            />
        }
      </React.Fragment>
    );
  }
}
