import React, { useState, useEffect } from 'react';
import {
  Switch,
  Route,
  useHistory
} from "react-router-dom";
import { About, Client, Connexion, Main, Register } from "./lib";
import { appToken, authUrl, apiUrl } from "./lib/Helpers/Settings";
import _ from "lodash";

const client = new Client(authUrl, apiUrl);

const App = () => {
  const [jwt, setJwt] = useState(_.isEmpty(_.get(localStorage, "jwt", "")) ? appToken : localStorage.getItem("jwt"));
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState(_.get(localStorage, "lang", "fr"));

  const history = useHistory();

  useEffect(() => {
    let userCode = _.get(localStorage, "userCode", "");
    if (!_.isEmpty(userCode)) {
      client.User.readByCode(
        jwt,
        userCode,
        result => {
          setUser(result.data.user);
        },
        error => {
          setUser(null);
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Did Mount

  return (
    <React.Fragment>
      <Switch>
        {/*<Route exact={true} path="/">
          <Main
            client={client}
            jwt={jwt}
            user={user}
            lang={lang}
            onChangeLanguage={lang => setLang(lang)}
            onRelogin={(jwt, user) => {
              localStorage.setItem("jwt", jwt);
              localStorage.setItem("userCode", user.code);
              setUser(user);
              setJwt(jwt);
            }}
          />
        </Route>*/}

        <Route path="/plateform">
          <Main
            client={client}
            jwt={jwt}
            user={user}
            lang={lang}
            onChangeLanguage={lang => setLang(lang)}
            onRelogin={(jwt, user) => {
              localStorage.setItem("jwt", jwt);
              localStorage.setItem("userCode", user.code);
              setUser(user);
              setJwt(jwt);
              history.push("/plateform/events");
            }}
          />
        </Route>

        <Route path="/login">
          <Connexion 
            client={client}
            lang={lang}
            onSuccess={data => {
              localStorage.setItem("jwt", data.jwt);
              localStorage.setItem("userCode", data.user.code);
              setJwt(data.jwt);
              setUser(data.user);
              history.push("/plateform/events");
            }}
            onClickRegister={() => history.push("/register")}
          />
        </Route>

        <Route path="/register">
          <Register 
            client={client}
            lang={lang}
            edition={false}
            user={user}
            onCancel={() => {
              history.goBack();
            }}
            onRegistration={() => history.push("/login")}
          />
        </Route>

        <Route path="/about">
          <About
            logged={false}
            lang="fr"
          />
        </Route>
      </Switch>
    </React.Fragment>
  );
};

export default App;
