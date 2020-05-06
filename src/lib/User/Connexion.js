import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Link,
  Paper,
  Snackbar,
  TextField,
  Typography
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import _ from "lodash";
import logo from "../../images/logo/byt-logo.jpg";
import { dictionnary } from "../Langs/langs";
import { localStorageCleanInfosUser } from "../Helpers/Helpers";
import { basename } from "../Helpers/Settings";

const Connexion = props => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorageCleanInfosUser();
    /*document.addEventListener("keydown", connexionShortcut);
    return () => {
      document.removeEventListener("keydown", connexionShortcut);
    }*/
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const valideForm = () => {
    return (!_.isEmpty(login) && !_.isEmpty(password));
  };

  /*const connexionShortcut = event => {
    // au clic sur ENTER
    if (event.keyCode === 13) {
      connexion();
    }
  };*/

  const connexion = () => {
    let lang = _.toUpper(props.lang);
    setLoading(true);
    if (!valideForm()) {
      let errorMessage = _.get(dictionnary, lang + ".errorMessageLogin");
      setError(true);
      setErrorMessage(_.upperFirst(errorMessage));
      setOpenSnackBar(true);
      setLoading(false);
      return;
    }

    props.client.User.login(
      login,
      password,
      result => {
        if (props.onSuccess) {
          props.onSuccess(result.data);
        }
      },
      error => {
        setError(true);
        setErrorMessage(
          _.isUndefined(error)
            ? _.upperFirst(_.get(dictionnary, lang + ".errorMessageLogin3"))
            : _.upperFirst(_.get(dictionnary, lang + ".errorMessageLogin2"))
        );
        setOpenSnackBar(true);
        setLoading(false);
      }
    );
  };

  const lang = _.toUpper(props.lang);
  return (
    <React.Fragment>
      <Container
        justify="center"
        maxWidth="sm"
        style={{ marginTop: "70px" }}
      >
        <Paper
          elevation={2}
          style={{ paddingLeft: "7px", paddingRight: "7px", paddingBottom: "20px" }}
        >
          <Grid container={true}>
            <Grid item={true} xs={12} style={{ textAlign: "center" }}>
              <img src={logo} height={90} width="auto" alt="logo" />
            </Grid>
          </Grid>
          <Grid container={true} spacing={2}>
            <Grid item={true} xs={12}>
              <TextField
                autoFocus={true}
                error={error}
                fullWidth={true}
                label={_.upperFirst(_.get(dictionnary, lang + ".login"))}
                name="login"
                onChange={e => setLogin(e.target.value)}
                required={true}
                value={login}
                variant="outlined"
              />
            </Grid>
            <Grid item={true} xs={12}>
              <TextField
                error={error}
                fullWidth={true}
                label={_.upperFirst(_.get(dictionnary, lang + ".password"))}
                name="password"
                onChange={e => setPassword(e.target.value)}
                required={true}
                type="password"
                value={password}
                variant="outlined"
              />
            </Grid>
          </Grid>

          {/* loader */}
          {loading
            ? <Grid container={true} style={{ marginTop: "7px" }}>
                <Grid item={true} xs={12} style={{ textAlign: "center" }}>
                  <CircularProgress
                    size={25}
                  />
                </Grid>
              </Grid>
            : null
          }

          {/* boutons */}
          <Grid container={true} spacing={1} style={{ marginTop: "15px" }}>
            <Grid item={true} xs={12}>
              <Button
                color="primary"
                fullWidth={true}
                onClick={connexion}
                size="large"
                variant="contained"
              >
                {_.upperFirst(_.get(dictionnary, lang + ".signIn"))}
              </Button>
            </Grid>
            <Grid item={true} xs={12}>
              <Button
                fullWidth={true}
                onClick={() => {
                  if (props.onClickRegister) {
                    props.onClickRegister();
                  }
                }}
                size="large"
                variant="contained"
              >
                {_.upperFirst(_.get(dictionnary, lang + ".createAccount"))}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <div style={{ position: "fixed", bottom: 30, left: 0, width: "100%", textAlign: "center" }}>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            <Link
              href={`${basename}/#/about`}
              variant="body2"
            >
              {_.upperFirst(_.get(dictionnary, lang + ".knowMoreAboutUs"))}
            </Link>
          </Typography>
        </div>
      </Container>

      <Snackbar 
        anchorOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
        open={openSnackBar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackBar(false)}
        message={errorMessage}
        variant="warning"
        action={
          <IconButton
            key="close"
            aria-label="Close"
            onClick={() => setOpenSnackBar(false)}
            color="inherit"
          >
            <CloseIcon />
          </IconButton>
        }
      />
    </React.Fragment>
  )
};

Connexion.propTypes = {
  client: PropTypes.any.isRequired,
  lang: PropTypes.string,
  onSuccess: PropTypes.func,
  onClickRegister: PropTypes.func
};

Connexion.defaultProps = {
  lang: "fr"
};

export default Connexion;