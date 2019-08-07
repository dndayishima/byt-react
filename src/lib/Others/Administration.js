import React from "react";
import PropTypes from "prop-types";

import {
  Button,
  CircularProgress,
  FormControl,
  FormGroup,
  FormControlLabel,
  Grid,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Switch,
  TextField,
  Typography
} from "@material-ui/core";

import { ModalMessage } from "../../lib";

import _ from "lodash";
import moment from "moment";

import { dictionnary } from "../Langs/langs";

export default class Administration extends React.Component {
  static propTypes = {
    client: PropTypes.any.isRequired,
    lang: PropTypes.string,
    user: PropTypes.object
  };

  static defaultProps = {
    lang: "fr"
  };
  
  state = {
    userList: [],
    selectedUser: {},
    emptyResult: false,
    loading: false,
    role: "USER",
    lastname: "",
    firstname: "",
    message: ""
  };

  search = () => {
    let params = {};
    if (!_.isEmpty(this.state.lastname)) {
      params.lastname = this.state.lastname;
    }
    if (!_.isEmpty(this.state.firstname)) {
      params.firstname = this.state.firstname;
    }
    params.roles = this.state.role;
    this.props.client.User.readAll(
      params,
      result => {
        //console.log(result);
        this.setState({
          userList: result.data.data,
          loading: false,
          emptyResult: _.isEmpty(result.data.data),
          selectedUser: {}
        });
      },
      error => {
        //console.log(error);
        let lang = _.toUpper(this.props.lang);
        this.setState({
          loading: false,
          emptyResult: false,
          selectedUser: {},
          message: _.upperFirst(_.get(dictionnary, lang + ".errorOccurredMessage"))
        });
      }
    );
  };

  render() {
    let lang = _.toUpper(this.props.lang);
    return(
      <React.Fragment>
        <Typography variant="h6" gutterBottom={true} color="textSecondary">
          <strong>{_.upperFirst(_.get(dictionnary, lang + ".userSearch"))}</strong>
        </Typography>
        <Grid container={true} spacing={2}>
          <Grid item={true} md={4} xs={12}>
            <FormControl variant="outlined" fullWidth={true}>
              <Select
                value={this.state.role}
                input={<OutlinedInput />}
                onChange={e => {
                  this.setState({ role: e.target.value });
                }}
              >
                <MenuItem value="USER">USER</MenuItem>
                <MenuItem value="SELLER">SELLER</MenuItem>
                <MenuItem value="TECH">TECH</MenuItem>
                <MenuItem value="ADMIN">ADMIN</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item={true} md={4} xs={12}>
            <TextField 
              label={_.upperFirst(_.get(dictionnary, lang + ".lastname"))}
              variant="outlined"
              fullWidth={true}
              value={this.state.lastname}
              onChange={e => this.setState({ lastname: e.target.value })}
            />
          </Grid>
          <Grid item={true} md={4} xs={12}>
            <TextField 
              label={_.upperFirst(_.get(dictionnary, lang + ".firstname"))}
              variant="outlined"
              fullWidth={true}
              value={this.state.firstname}
              onChange={e => this.setState({ firstname: e.target.value })}
            />
          </Grid>
        </Grid>

        <Grid container={true} justify="center" style={{ marginTop: "15px" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              this.setState({ loading: true });
              this.search();
            }}
          >
            {_.get(dictionnary, lang + ".search")}
          </Button>
        </Grid>

        {this.state.loading
          ? <div style={{ textAlign: "center", marginTop: "40px" }}>
              <CircularProgress color="primary"/>
            </div>
          : null
        }
        {this.state.emptyResult
          ? <Typography
              gutterBottom={true} 
              variant="h6"
              color="error"
              style={{ marginTop: "10px", textAlign: "center" }}
            >
              <strong>{_.upperFirst(_.get(dictionnary, lang + ".noUserFound"))}</strong>
            </Typography>
          : null
        }

        {!_.isEmpty(this.state.userList)
          ? <div>
              {_.map(this.state.userList, (user, index) => 
                <Paper 
                  key={index} 
                  style={{
                    marginTop: "10px",
                    marginBottom: "10px",
                    padding: "5px",
                  }}
                  onClick={() => {
                    this.setState({
                      selectedUser: user,
                      userList: [],
                      emptyResult: false
                    });
                  }}
                >
                  <Typography color="textSecondary" gutterBottom={true}>
                    <strong>{_.toUpper(user.lastname)}</strong>
                  </Typography>
                  <Typography color="textSecondary" gutterBottom={true}>
                    <strong>{user.firstname}</strong>
                  </Typography>
                  <Typography color="textSecondary" gutterBottom={true}>
                    {_.upperFirst(_.get(dictionnary, lang + ".birthday"))}
                    &nbsp;:&nbsp;
                    {this.props.lang === "en"
                      ? moment(user.birthday).format("MM/DD/YYYY")
                      : moment(user.birthday).format("DD/MM/YYYY")
                    }
                  </Typography>
                  <Typography color="textSecondary" gutterBottom={true}>
                    {_.upperFirst(_.get(dictionnary, lang + ".login"))}
                    &nbsp;:&nbsp;
                    {user.login}
                  </Typography>
                </Paper>
              )}
            </div>
          : null
        }

        {!_.isEmpty(this.state.selectedUser)
          ? <div>
              <User 
                user={this.state.selectedUser}
                lang={this.props.lang}
                onCancel={() => {
                  this.setState({
                    selectedUser: {},
                    userList: [],
                    emptyResult: false
                  })
                }}
                client={this.props.client}
              />
            </div>
          : null
        }

        {/* Message d'erreur */}
        <ModalMessage 
          open={!_.isEmpty(this.state.message)}
          title={_.upperFirst(_.get(dictionnary, lang + ".administration"))}
          type="error"
          message={this.state.message}
          onAction={() => {
            this.setState({ message: "" })
          }}
        />
      </React.Fragment>
    )
  }
}

class User extends React.Component {
  static defaultProps = {
    lang: "fr"
  };

  state = {
    roles: this.props.user.roles,
    message: "",
    messageType: ""
  };

  onChangeRole = role => {
    let r = this.state.roles;
    if(_.includes(r, role)) {
      let i = _.findIndex(r, rl => rl === role);
      r.splice(i, 1);
    } else {
      r.push(role);
    }
    this.setState({ roles: r });
  };

  updateUser = () => {
    let params = {
      roles: this.state.roles
    };
    let lang = _.toUpper(this.props.lang);
    this.props.client.User.update(
      this.props.user.id,
      params,
      result => {
        //console.log(result);
        this.setState({
          messageType: "success",
          message: _.upperFirst(_.get(dictionnary, lang + ".userUpdateSuccess"))
        });
      },
      error => {
        this.setState({
          messageType: "error",
          message: _.upperFirst(_.get(dictionnary, lang + ".errorOccurredMessage"))
        });
      }
    );
  };

  render() {
    let lang = _.toUpper(this.props.lang);
    return(
      <React.Fragment>
        <Typography color="textSecondary" gutterBottom={true}>
          <strong>{_.toUpper(this.props.user.lastname)}</strong>
        </Typography>
        <Typography color="textSecondary" gutterBottom={true}>
          <strong>{this.props.user.firstname}</strong>
        </Typography>
        <Typography color="textSecondary" gutterBottom={true}>
          {_.upperFirst(_.get(dictionnary, lang + ".birthday"))}
          &nbsp;:&nbsp;
          {this.props.lang === "en"
            ? moment(this.props.user.birthday).format("MM/DD/YYYY")
            : moment(this.props.user.birthday).format("DD/MM/YYYY")
          }
        </Typography>
        <Typography color="textSecondary" gutterBottom={true}>
          {_.upperFirst(_.get(dictionnary, lang + ".login"))}
          &nbsp;:&nbsp;
          {this.props.user.login}
        </Typography>

        <FormControl component="fieldset">
          <FormGroup>
            <FormControlLabel 
              control={
                <Switch
                  checked={_.includes(this.state.roles, "SELLER")}
                  onChange={() => this.onChangeRole("SELLER")}
                />
              }
              label="SELLER"
            />
            <FormControlLabel 
              control={
                <Switch
                  checked={_.includes(this.state.roles, "TECH")}
                  onChange={() => this.onChangeRole("TECH")}
                />
              }
              label="TECH"
            />
          </FormGroup>
        </FormControl>
        <Grid
          container={true}
          justify="center"
          style={{ marginTop: "10px", marginBottom: "10px" }}
        >
          <Button
            variant="contained"
            style={{ marginRight: "3px" }}
            onClick={() => {
              this.props.onCancel();
            }}
          >
            {_.get(dictionnary, lang + ".cancel")}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              this.updateUser();
            }}
          >
            {_.get(dictionnary, lang + ".modify")}
          </Button>
        </Grid>

        {/* message modal retour utilisateur */}
        <ModalMessage 
          open={!_.isEmpty(this.state.message)}
          title={_.upperFirst(_.get(dictionnary, lang + ".administration"))}
          type={this.state.messageType}
          message={this.state.message}
          onAction={() => {
            this.props.onCancel();
          }}
        />
      </React.Fragment>
    )
  }
}