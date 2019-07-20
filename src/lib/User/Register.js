import React from "react";
import PropTypes from "prop-types";

import { Button, Divider, FormControlLabel, IconButton, Switch, TextField, Typography } from "@material-ui/core";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";

import _ from "lodash";
import DateFnsUtils from "@date-io/date-fns";

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
    telephones: ["coucu", "kaka"],
    email: "",
    roles: ["USER"]
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
    return (
      <React.Fragment>
        <form noValidate={true} autoComplete="off" style={{ marginLeft: "20px", marginRight: "20px" }}>
          <div style={styles.input}>
            <TextField
              autoFocus={true}
              fullWidth={true}
              label={_.upperFirst(lastname)}
              name="lastname"
              onChange={() => {}}
              required={true}
              variant="outlined"
            />
          </div>
          <div style={styles.input}>
            <TextField 
              fullWidth={true}
              label={_.upperFirst(firstname)}
              name="firstname"
              onChange={() => {}}
              required={true}
              variant="outlined"
            />
          </div>
          <div style={styles.input}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                autoOk={true}
                inputVariant="outlined"
                format={this.props.lang === "en" ? "MM/dd/yyyy" : "dd/MM/yyyy"}
                label={_.upperFirst(birthday)}
                fullWidth={true}
                value={null} // type Date
                required={true}
                onChange={date => {}}
              />
            </MuiPickersUtilsProvider>
          </div>
          <div style={styles.input}>
            <TextField 
              fullWidth={true}
              label={_.upperFirst(email)}
              name="email"
              onChange={() => {}}
              variant="outlined"
            />
          </div>
          {_.map(this.state.telephones, (tel, index) => 
            <div style={styles.input} key={index}>
              <div style={{ display: "flex" }}>
                <TextField
                  fullWidth={true}
                  label={_.upperFirst(phone) + " " + (index + 1)}
                  name="phone"
                  onChange={() => {}}
                  variant="outlined"
                />
                <IconButton style={{ marginLeft: "8px" }}>
                  <DeleteIcon />
                </IconButton>
              </div>
            </div>  
          )}
          <div style={styles.input}>
            <span style={{ textAlign: "center" }}>
              <Typography variant="body1" gutterBottom={true}>
                {_.upperFirst(phone)}
                <IconButton style={{ marginLeft: "8px" }}>
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
              onChange={() => {}}
              variant="outlined"
              required={true}
            />
          </div>
          <div style={styles.input}>
            <TextField 
              fullWidth={true}
              label={_.upperFirst(password)}
              name="password"
              onChange={() => {}}
              variant="outlined"
              required={true}
            />
          </div>
          <div style={styles.input}>
            <TextField 
              fullWidth={true}
              label={_.upperFirst(confirmPassword)}
              name="confirmation"
              onChange={() => {}}
              variant="outlined"
              required={true}
            />
          </div>
          <FormControlLabel 
            control={
              <Switch 
                //checked
                color="primary"
              />
            }
            label={_.upperFirst(seller)}
            labelPlacement="end"
          />
          <div style={styles.input}>
            <Button 
              color="primary"
              fullWidth={true}
              onClick={() => {}}
              size="large"
              variant="contained"
            >
              {_.upperFirst(createAccount)}
            </Button>
          </div>
        </form>
      </React.Fragment>
    )
  }
}

