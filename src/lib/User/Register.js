import React from "react";
import PropTypes from "prop-types";

import { Button, Divider, FormControlLabel, IconButton, Snackbar, Switch, TextField, Typography } from "@material-ui/core";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import CloseIcon from "@material-ui/icons/Close";

import _ from "lodash";
import DateFnsUtils from "@date-io/date-fns";
import frLocale from "date-fns/locale/fr";
import enLocale from "date-fns/locale/en-US";

import moment from "moment";

import { dictionnary } from "../Langs/langs";

const styles = {
  input: {
    marginTop: "10px",
    marginBottom: "10px"
  }
};

export default class Register extends React.Component {
  static propTypes = {
    client: PropTypes.any.isRequired,
    onSuccess: PropTypes.func,
    onError: PropTypes.func
  };
  static defaultProps = {
    lang: "fr"
  };

  state = {
    login: "",
    password: "",
    confirmPassword: "",
    firstname: "",
    lastname: "",
    birthday: null,
    telephones: [],
    email: "",
    roles: ["USER"],
    error: false,
    errorMessage: "",
    openSnackBar: false
  };

  // l'index sera défini au moment où on voudra modifier 
  // le numéro de téléphone
  handleChangeInput = (event, name, index) => {
    if (!_.isUndefined(index)) { // on est sur les téléphones
      let tel = this.state.telephones;
      tel[index] = event.target.value;
      this.setState({ telephones: tel });
    } else {
      let state = this.state;
      _.set(state, name, event.target.value);
      this.setState({...state});
    }
  };

  changeSellerRole = () => {
    let roles = this.state.roles;
    let sellerIndex = _.findIndex(roles, role => role === "SELLER");
    if (sellerIndex === -1) {
      roles.push("SELLER");
    } else {
      roles.splice(sellerIndex, 1);
    }
    this.setState({ roles: roles });
  };

  emailValidity = () => {
    let regex = /\S+@\S+\.\S+/;
    return (_.isEmpty(this.state.email) || regex.test(this.state.email));
  };

  // numéros du burundi seulement
  phoneValidity = phone => {
    let regex = new RegExp("^(\\+|00|[0-9])[0-9]+$");
    return (_.isEmpty(phone) || (phone.length >= 8 && phone.length <= 13 && regex.test(phone)));    
  };

  checkPhones = () => {
    let bool = true;
    _.forEach(this.state.telephones, tel => {
      if (!this.phoneValidity(tel)) {
        bool = false;
      }
    });
    return bool;
  };


  checkValidity = () => {
    return (
      !_.isEmpty(this.state.lastname) &&
      !_.isEmpty(this.state.firstname) &&
      !_.isNull(this.state.birthday) &&
      !_.isEmpty(this.state.login) &&
      !_.isEmpty(this.state.password) &&
      (this.state.password === this.state.confirmPassword) &&
      this.emailValidity() &&
      this.checkPhones()
    );
  };

  register = () => {
    if (!this.checkValidity()) {
      let lang = _.toUpper(this.props.lang);
      let invalidForm = _.get(dictionnary, lang + ".invalidForm");
      this.setState({ openSnackBar: true, error: true, errorMessage: _.upperFirst(invalidForm) });
      return;
    }
    let params = {
      login: this.state.login,
      password: this.state.password,
      lastname: this.state.lastname,
      firstname: this.state.firstname,
      birthday: moment(this.state.birthday).format("YYYY-MM-DD"),
      telephones: this.state.telephones,
      email: this.state.email,
      roles: this.state.roles
    };
    this.props.client.User.register(
      params,
      result => {
        console.log("success");
        console.log(result);
      },
      error => {
        console.log("error");
        console.log(error);
      }
    )
  };

  render() {
    let lang = _.toUpper(this.props.lang);
    let lastname = _.get(dictionnary, lang + ".lastname");
    let firstname = _.get(dictionnary, lang + ".firstname");
    let birthday = _.get(dictionnary, lang + ".birthday");
    let email = _.get(dictionnary, lang + ".email");
    let phone = _.get(dictionnary, lang + ".phone");
    let login = _.get(dictionnary, lang + ".login");
    let password = _.get(dictionnary, lang + ".password");
    let confirmPassword = _.get(dictionnary, lang + ".confirmPassword");
    let seller = _.get(dictionnary, lang + ".seller");
    let createAccount = _.get(dictionnary, lang + ".createAccount");
    
    //console.log(_.isNull(this.state.birthday) ? "null" : moment(this.state.birthday).format("YYYY-MM-DD"));
    //console.log(this.state.birthday.getDate());
    return (
      <React.Fragment>
        <form noValidate={true} autoComplete="off" style={{ marginLeft: "20px", marginRight: "20px" }}>
          <div style={styles.input}>
            <TextField
              autoFocus={true}
              fullWidth={true}
              label={_.upperFirst(lastname)}
              name="lastname"
              onChange={e => {
                this.handleChangeInput(e, "lastname");
              }}
              value={this.state.lastname}
              required={true}
              variant="outlined"
            />
          </div>
          <div style={styles.input}>
            <TextField 
              fullWidth={true}
              label={_.upperFirst(firstname)}
              name="firstname"
              onChange={e => this.handleChangeInput(e, "firstname")}
              value={this.state.firstname}
              required={true}
              variant="outlined"
            />
          </div>
          <div style={styles.input}>
            <MuiPickersUtilsProvider
              locale={this.props.lang === "en" ? enLocale : frLocale}
              utils={DateFnsUtils}
            >
              <KeyboardDatePicker
                autoOk={true}
                inputVariant="outlined"
                format={this.props.lang === "en" ? "MM/dd/yyyy" : "dd/MM/yyyy"}
                label={_.upperFirst(birthday)}
                fullWidth={true}
                value={this.state.birthday}
                required={true}
                onChange={date => {
                  if (!_.isNull(date) && !_.isNaN(date.getDay())) {
                    this.setState({ birthday: date });
                  }
                }}
                invalidDateMessage=""
              />
            </MuiPickersUtilsProvider>
          </div>
          <div style={styles.input}>
            <TextField
              error={!this.emailValidity()}
              fullWidth={true}
              label={_.upperFirst(email)}
              name="email"
              value={this.state.email}
              onChange={e => this.handleChangeInput(e, "email")}
              variant="outlined"
            />
          </div>
          {_.map(this.state.telephones, (tel, index) => 
            <div style={styles.input} key={index}>
              <div style={{ display: "flex" }}>
                <TextField
                  error={!this.phoneValidity(tel)}
                  fullWidth={true}
                  label={_.upperFirst(phone) + " " + (index + 1)}
                  name="phone"
                  onChange={e => {
                    this.handleChangeInput(e, "telephones", index);
                  }}
                  value={this.state.telephones[index]}
                  variant="outlined"
                />
                <IconButton
                  style={{ marginLeft: "8px" }}
                  onClick={() => {
                    let tel = this.state.telephones;
                    tel.splice(index, 1);
                    this.setState({ telephones: tel });
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </div>  
          )}
          <div style={styles.input}>
            <span style={{ textAlign: "center" }}>
              <Typography variant="body1" gutterBottom={true}>
                {_.upperFirst(phone)}
                <IconButton
                  style={{ marginLeft: "8px" }}
                  onClick={() => {
                    let tel = this.state.telephones;
                    tel.push("");
                    this.setState({ telephones: tel });
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Typography>
            </span>
          </div>
          <Divider light={true} variant="middle" style={{ marginTop: "20px", marginBottom: "20px" }}/>
          <div style={styles.input}>
            <TextField 
              fullWidth={true}
              label={_.upperFirst(login)}
              name="login"
              onChange={e => this.handleChangeInput(e, "login")}
              value={this.state.login}
              variant="outlined"
              required={true}
            />
          </div>
          <div style={styles.input}>
            <TextField 
              fullWidth={true}
              label={_.upperFirst(password)}
              name="password"
              onChange={e => this.handleChangeInput(e, "password")}
              value={this.state.password}
              variant="outlined"
              required={true}
              type="password"
            />
          </div>
          <div style={styles.input}>
            <TextField
              error={
                !_.isEmpty(this.state.confirmPassword) &&
                this.state.confirmPassword !== this.state.password
              }
              fullWidth={true}
              label={_.upperFirst(confirmPassword)}
              name="confirmation"
              onChange={e => this.handleChangeInput(e, "confirmPassword")}
              value={this.state.confirmPassword}
              variant="outlined"
              required={true}
              type="password"
            />
          </div>
          <FormControlLabel 
            control={
              <Switch 
                checked={_.includes(this.state.roles, "SELLER")}
                color="primary"
                onChange={() => this.changeSellerRole()}
              />
            }
            label={_.upperFirst(seller)}
            labelPlacement="end"
          />
          <div style={styles.input}>
            <Button 
              color="primary"
              fullWidth={true}
              onClick={this.register}
              size="large"
              variant="contained"
            >
              {_.upperFirst(createAccount)}
            </Button>
          </div>
        </form>

        {/* message d'erreur */}
        <Snackbar 
          anchorOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
          open={this.state.openSnackBar}
          autoHideDuration={2000}
          onClose={() => this.setState({ openSnackBar: false })}
          message={this.state.errorMessage}
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

