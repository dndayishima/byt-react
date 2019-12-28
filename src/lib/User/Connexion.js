import React from "react";
import PropTypes from "prop-types";

import {
  Button,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  TextField
} from "@material-ui/core";

import CloseIcon from "@material-ui/icons/Close";

import _ from "lodash";

import logo from "../../byt-logo.jpg";
import { dictionnary } from "../Langs/langs";

export default class Connexion extends React.Component {
  static propTypes = {
    client: PropTypes.any.isRequired,
    lang: PropTypes.string,
    onSuccess: PropTypes.func,
    onClickRegister: PropTypes.func
  }

  static defaultProps = {
    lang: "fr"
  };

  state = {
    login: "",
    password: "",
    error: false,
    errorMessage: "",
    openSnackBar: false,
    loading: false
  };

  valideForm = () => {
    return (!_.isEmpty(this.state.login) && !_.isEmpty(this.state.password));
  };

  connexion = () => {
    let lang = _.toUpper(this.props.lang);
    this.setState({ loading: true });
    if (!this.valideForm()) {
      let errorMessage = _.get(dictionnary, lang + ".errorMessageLogin");
      this.setState({
        error: true,
        errorMessage: _.upperFirst(errorMessage),
        openSnackBar: true,
        loading: false
      });
      return;
    }

    this.props.client.User.login(
      this.state.login,
      this.state.password,
      result => {
        if (this.props.onSuccess) {
          this.props.onSuccess(result.data);
        }
      },
      error => {
        this.setState({
          error: true,
          errorMessage: _.isUndefined(error)
            ? _.upperFirst(_.get(dictionnary, lang + ".errorMessageLogin3"))
            : _.upperFirst(_.get(dictionnary, lang + ".errorMessageLogin2")),
          openSnackBar: true,
          loading: false
        });
      }
    );
  };

  render () {
    const lang = _.toUpper(this.props.lang);
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
                  error={this.state.error}
                  fullWidth={true}
                  label={_.upperFirst(_.get(dictionnary, lang + ".login"))}
                  name="login"
                  onChange={e => this.setState({ login: e.target.value })}
                  required={true}
                  value={this.state.login}
                  variant="outlined"
                />
              </Grid>
              <Grid item={true} xs={12}>
                <TextField
                  error={this.state.error}
                  fullWidth={true}
                  label={_.upperFirst(_.get(dictionnary, lang + ".password"))}
                  name="password"
                  onChange={e => this.setState({ password: e.target.value })}
                  required={true}
                  type="password"
                  value={this.state.password}
                  variant="outlined"
                />
              </Grid>
            </Grid>

            {/* loader */}
            {this.state.loading
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
                  onClick={() => this.connexion()}
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
                    if (this.props.onClickRegister) {
                      this.props.onClickRegister();
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
        </Container>

        <Snackbar 
          anchorOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
          open={this.state.openSnackBar}
          autoHideDuration={2000}
          onClose={() => this.setState({ openSnackBar: false })}
          message={this.state.errorMessage}
          variant="warning"
          action={
            <IconButton
              key="close"
              aria-label="Close"
              onClick={() => this.setState({ openSnackBar: false })}
              color="inherit"
            >
              <CloseIcon />
            </IconButton>
          }
        />
      </React.Fragment>
    )
  }
}