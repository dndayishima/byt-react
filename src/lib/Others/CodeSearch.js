import React from "react";
import PropTypes from "prop-types";

import {
  Button,
  CircularProgress,
  Container,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Grid,
  IconButton,
  TextField,
  Typography
} from "@material-ui/core";

import {
  ExpandMore,
  PersonOutline,
  Search
} from "@material-ui/icons";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  //KeyboardDateTimePicker
} from "@material-ui/pickers";

import ModalMessage from "./ModalMessage";
import CodeViewer from "./CodeViewer";
import bytImage from "../../favicon_byt.jpg";

import _ from "lodash";
import moment from "moment";
import DateFnsUtils from "@date-io/date-fns";
import frLocale from "date-fns/locale/fr";
import enLocale from "date-fns/locale/en-US";

import { dictionnary } from "../Langs/langs";

export default class CodeSearch extends React.Component {
  static propTypes = {
    client: PropTypes.any.isRequired,
    jwt: PropTypes.string,
    lang: PropTypes.string,
    user: PropTypes.object,
    onSignOut: PropTypes.func
  };

  static defaultProps = {
    lang: "fr"
  };

  state = {
    createdBy: "",
    createdAt: null,
    usedBy: "",
    usedAt: null,
    loading: false,
    codes: [],
    // erreurs
    errorType: null, // 401 c'est auth. - 3 Network
    errorTitle: "",
    errorMessage: ""
  };

  search = () => {
    this.setState({ loading: true });
    let params = {};
    params.createdBy = _.isEmpty(this.state.createdBy) ? null : this.state.createdBy;
    // created at on prend le jour pas les heures : 2019-11-03 (par exemple)
    params.createdAt = _.isEmpty(this.state.createdAt)
      ? null
      : moment(this.state.createdAt).format("YYYY-MM-DD");
    params.usedBy = _.isEmpty(this.state.usedBy) ? null : this.state.usedBy;
    params.usedAt = _.isEmpty(this.state.usedAt)
      ? null
      : moment(this.state.usedAt).format("YYYY-MM-DD");
    this.props.client.Code.readAll(
      this.props.jwt,
      params,
      result => {
        //console.log(result); // bien regarder la structure de l'objet pour faire la pagination
        this.setState({ codes: result.results.content, loading: false })
      },
      error => {
        //console.log(error);
        let lang = _.toUpper(this.props.lang);
        this.setState({ loading: false });
        if (_.isUndefined(error)) {
          this.setState({
            errorType: 3,
            errorTitle: _.upperFirst(_.get(dictionnary, lang + ".code")),
            errorMessage: _.upperFirst(_.get(dictionnary, lang + ".errorMessageNetwork"))
          });
        }
        if (error.status === 419) {
          this.setState({
            errorType: 0,
            errorMessage: _.upperFirst(_.get(dictionnary, lang + ".errorOccurredMessage")),
            errorTitle: _.upperFirst(_.get(dictionnary, lang + ".code")),
          });
        }
        if (error.status === 401) {
          this.setState({
            errorType: 401,
            errorMessage: _.upperFirst(_.get(dictionnary, lang + ".errorMessageAuthentication")),  
            errorTitle: _.upperFirst(_.get(dictionnary, lang + ".authentication")),
          });
        }
      }
    );
  };

  render () {
    let lang = _.toUpper(this.props.lang);
    return (
      <React.Fragment>
        <Container>
          <ExpansionPanel square={true}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMore />}
            >
              <Typography variant="body1" color="textSecondary">
                {_.upperFirst(_.get(dictionnary, lang + ".search"))}
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              {/* Inputs de paramètres */}
              <Grid container={true} spacing={1}>
                <Grid item={true} xs={12} sm={6} container={true} spacing={1}>
                  <Grid item={true} xs={10}>
                    <TextField 
                      fullWidth={true}
                      label={_.upperFirst(_.get(dictionnary, lang + ".createdBy"))}
                      value={this.state.createdBy}
                      onChange={e => this.setState({ createdBy: e.target.value })}
                    />
                  </Grid>
                  <Grid item={true} xs={2}>
                    <IconButton
                      onClick={() => {
                        this.setState({ createdBy: this.props.user.code });
                      }}
                    >
                      <PersonOutline />
                    </IconButton>
                  </Grid>
                </Grid>

                {/* Created at */}
                <MuiPickersUtilsProvider
                  utils={DateFnsUtils}
                  locale={this.props.lang === "en" ? enLocale : frLocale}
                >
                  <Grid item={true} xs={12} sm={6}>
                    <KeyboardDatePicker 
                      fullWidth={true}
                      autoOk={true}
                      //format={this.props.lang === "en" ? "MM/dd/yyyy" : "dd/MM/yyyy"}
                      format="dd/MM/yyyy"
                      label={_.upperFirst(_.get(dictionnary, lang + ".createdAt")) + " >="}
                      value={_.isNull(this.state.createdAt) ? null : this.state.createdAt.toDate()}
                      onChange={date => {
                        if (!_.isNull(date) && !_.isNaN(date.getDay())) {
                          let selectedDay = moment(date);
                          this.setState({ createdAt: selectedDay });
                        }
                      }}
                    />
                  </Grid>
                </MuiPickersUtilsProvider>

                {/* used by - used at */}
                <Grid item={true} xs={12} sm={6}>
                  <TextField 
                    fullWidth={true}
                    label={_.upperFirst(_.get(dictionnary, lang + ".usedBy"))}
                    value={this.state.usedBy}
                    onChange={e => this.setState({ usedBy: e.target.value })}
                  />
                </Grid>
                <MuiPickersUtilsProvider
                  utils={DateFnsUtils}
                  locale={this.props.lang === "en" ? enLocale : frLocale}
                >
                  <Grid item={true} xs={12} sm={6}>
                    <KeyboardDatePicker 
                      fullWidth={true}
                      autoOk={true}
                      //format={this.props.lang === "en" ? "MM/dd/yyyy" : "dd/MM/yyyy"}
                      format="dd/MM/yyyy"
                      label={_.upperFirst(_.get(dictionnary, lang + ".usedAt")) + " >="}
                      value={_.isNull(this.state.usedAt) ? null : this.state.usedAt.toDate()}
                      onChange={date => {
                        if (!_.isNull(date) && !_.isNaN(date.getDay())) {
                          let selectedDay = moment(date);
                          this.setState({ usedAt: selectedDay });
                        }
                      }}
                    />
                  </Grid>
                </MuiPickersUtilsProvider>

                {/* Button search */}
                <Grid item={true} xs={12}>
                  <Button
                    variant="contained"
                    fullWidth={true}
                    color="primary"
                    size="large"
                    onClick={() => this.search()}
                  >
                    <Search />
                  </Button>
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>

          {/* codes proprement parlé */}
          {this.state.loading
            ? <Grid container={true} style={{ marginTop: "25px", marginBottom: "25px" }}>
                <Grid item={true} xs={12} style={{ textAlign: "center" }}>
                  <CircularProgress
                    size={25}
                  />
                </Grid>
              </Grid>
            : null
          }

          {_.isEmpty(this.state.codes)
            ? <Grid container={true} style={{ marginTop: "25px", marginBottom: "25px" }}>
                <Grid item={true} xs={12} style={{ textAlign: "center" }}>
                  <img src={bytImage} alt="no codes" />
                </Grid>
              </Grid>
            : <Grid container={true} style={{ marginTop: "25px", marginBottom: "25px" }} spacing={2}>
                {_.map(this.state.codes, (code, index) => 
                  <Grid item={true} xs={12} sm={4} key={index}>
                    <CodeViewer 
                      lang={this.props.lang}
                      code={code}
                    />
                  </Grid>     
                )}
              </Grid>
          }

        </Container>

        {/* Message en cas d'erreur */}
        <ModalMessage 
          open={!_.isNull(this.state.errorType)}
          title={this.state.errorTitle}
          message={this.state.errorMessage}
          type="error"
          onAction={() => {
            if (this.state.errorType === 401) {
              if (this.props.onSignOut) {
                this.props.onSignOut();
              }
            } else {
              this.setState({
                erroType: null,
                errorMessage: "",  
                errorTitle: "",
              });
            }
          }}
        />
      </React.Fragment>
    );
  }
}