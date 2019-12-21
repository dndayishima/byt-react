import React from "react";
import PropTypes from "prop-types";

import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  FormControl,
  Grid,
  MenuItem,
  OutlinedInput,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography
} from "@material-ui/core";

import {
  Close,
  CreditCard,
  ExpandMore,
  PhoneIphone
} from "@material-ui/icons";

import _ from "lodash";

import { ModalMessage } from "../../lib";

import { dictionnary } from "../Langs/langs";
import { getAllCodesMarchands, priceValuePrinting } from "../Helpers/Helpers";

import econet from "../../econet.png";
import lumitel from "../../lumitel.png";
import smart from "../../smart.png";
import finbank from "../../finbank.jpg";
import bancobu from "../../bancobu.jpg";
import bytImage from "../../favicon_byt.jpg"

export default class BuyTicket extends React.Component {
  static propTypes = {
    client: PropTypes.any.isRequired,
    jwt: PropTypes.string,
    lang: PropTypes.string,
    event: PropTypes.object,
    price: PropTypes.object,
    onCancel: PropTypes.func
  };

  static defaultProps = {
    lang: "fr"
  };

  state = {
    tab: "manual",
    code: ""
  };

  getPriceByCurrency = (prices, currency) => {
    return _.filter(prices, price => price.currency === currency);
  };

  getTicketByCode = () => {
    if (_.isEmpty(this.state.code)) {
      return;
    }
    let params = {};
    params.code = this.state.code;
    params.priceId = this.props.price.id;
    params.eventCode = this.props.event.code;
    this.props.client.Ticket.createByCode(
      this.props.jwt,
      params,
      result => {
        console.log(result);
      },
      error => {
        console.log(error);
      }
    );
  }

  render () {
    let lang = _.toUpper(this.props.lang);
    return (
      <React.Fragment>
        <Container maxWidth="md">
          <Grid container={true}>
            <Grid item={true} xs={12}>
              <Typography variant="h6" align="center" style={{ marginBottom: "15px" }}>
                <strong>{_.upperFirst(_.get(dictionnary, lang + ".buyTicket"))}</strong>
              </Typography>
            </Grid>
          </Grid>

          {/* sections */}
          <Tabs
            value={this.state.tab}
            onChange={(e, tab) => this.setState({ tab: tab })}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            style={{ marginBottom: "15px" }}
          >
            <Tab 
              label={_.upperFirst(_.get(dictionnary, lang + ".code"))}
              value="manual"
            />
            <Tab 
              label={
                <PhoneIphone />
              }
              value="mobilemoney"
              disabled={true}
            />
            <Tab 
              label={
                <CreditCard />
              }
              value="cb"
              disabled={true}
            />
            <Tab 
              label="PayPal"
              value="paypal"
              disabled={true}
            />
          </Tabs>

          {/* contenu des tabs */}
          {this.state.tab === "manual"
            ? <React.Fragment>
                <Grid container={true} spacing={2}>
                  <Grid item={true} xs={12}>
                    <ExpansionPanel square={true}>
                      <ExpansionPanelSummary
                        expandIcon={<ExpandMore />}
                      >
                        <Typography variant="body1" color="textSecondary">
                          {_.upperFirst(_.get(dictionnary, lang + ".manualPayment"))}
                        </Typography>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                        <Typography variant="body1" color="textSecondary">
                          {_.upperFirst(_.get(dictionnary, lang + ".buyTicketDescriptionMessage"))}
                        </Typography>
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                  </Grid>
                </Grid>

                {/* Affichage des opérateur + codes marchands */}
                <Grid container={true} spacing={2}>
                  {_.map(getAllCodesMarchands(), (cm, i) =>
                    <Grid item={true} xs={12} sm={4} key={i}>
                      <Card>
                        <CardHeader 
                          avatar={
                            <Avatar
                              aria-label="cm"
                              variant="square"
                              src={
                                cm.idPhoto === 0
                                  ? econet
                                  : cm.idPhoto === 1
                                    ? lumitel
                                    : cm.idPhoto === 2
                                      ? smart
                                      : cm.idPhoto === 3
                                        ? finbank
                                        : cm.idPhoto === 4
                                          ? bancobu
                                          : bytImage

                              }
                            />
                          }
                          title={cm.operator}
                          subheader={_.toUpper(cm.country)}
                        />
                        <CardContent>
                          <Typography variant="body1" color="textSecondary" align="center">
                            <PhoneIphone
                              fontSize="small"
                            />  
                            <strong>{cm.codeMarchand}</strong>
                          </Typography>
                          <Typography variant="body2" color="textSecondary" align="center">
                              {_.isEmpty(this.getPriceByCurrency(this.props.price.values, cm.currency))
                                ? <Close />
                                : priceValuePrinting(
                                    this.getPriceByCurrency(this.props.price.values, cm.currency)[0].value,
                                    this.props.lang
                                  ) + " " + cm.currency
                              }
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                </Grid>

                {/* input pour le code */}
                <Grid container={true} style={{ marginTop: "25px", marginBottom: "25px" }}>
                  <Grid item={true} xs={12}>
                    <TextField 
                      label={_.upperFirst(_.get(dictionnary, lang + ".code"))}
                      fullWidth={true}
                      variant="outlined"
                      value={this.state.code}
                      onChange={e => this.setState({ code: e.target.value })}
                    />
                  </Grid>
                </Grid>

                {/* Buttons - Annuler - Get ticket */}
                <Grid container={true} spacing={1}>
                  <Grid item={true} xs={12} sm={6}>
                    <Button 
                      variant="contained"
                      fullWidth={true}
                      size="large"
                      onClick={() => {
                        if (this.props.onCancel) {
                          this.props.onCancel();
                        }
                      }}
                    >
                      {_.upperFirst(_.get(dictionnary, lang + ".cancel"))}
                    </Button>
                  </Grid>
                  <Grid item={true} xs={12} sm={6}>
                    <Button
                      color="primary"
                      variant="contained"
                      fullWidth={true}
                      size="large"
                      onClick={() => {
                        this.getTicketByCode();
                      }}
                    >
                      {_.upperFirst(_.get(dictionnary, lang + ".getTicket"))}
                    </Button>
                  </Grid>
                </Grid>
              </React.Fragment>
            : null
          }
        </Container>
      </React.Fragment>
    );
  }
}

class BuyTickettttt extends React.Component {
  static propTypes = {
    client: PropTypes.any.isRequired,
    jwt: PropTypes.string,
    lang: PropTypes.string,
    event: PropTypes.object,
    user: PropTypes.object
  };

  static defaultProps = {
    lang: "fr"
  };

  state = {
    selectedMode: _.isEmpty(this.props.event.codesMarchands) ? "" : "manual",
    code: "",
    message: "",
    titleMessage: "",
    typeMessage: "",
    errorStatus: null
  };

  getTicket = () => {
    let lang = _.toUpper(this.props.lang);
    let params = {};
    params.code = this.state.code;
    params.seller = this.props.event.seller;
    params.user = this.props.user.login;
    params.event = this.props.event.code;
    params.price = this.props.event.price

    this.props.client.Ticket.create(
      this.props.jwt,
      params,
      result => {
        //console.log(result);
        this.setState({
          typeMessage: "success",
          message: _.upperFirst(_.get(dictionnary, lang + ".createTicketMessageSuccess")),
          titleMessage: _.upperFirst(_.get(dictionnary, lang + ".tickets")),
          errorStatus: null
        });
      },
      error => {
        //console.log(error);
        if (_.isUndefined(error)) {
          this.setState({
            typeMessage: "error",
            message: _.upperFirst(_.get(dictionnary, lang + ".errorMessageNetwork")),
            titleMessage: _.upperFirst(_.get(dictionnary, lang + ".tickets")),
            errorStatus: null
          });
        }
        if (error.status === 419) {
          this.setState({
            typeMessage: "error",
            message: _.upperFirst(_.get(dictionnary, lang + ".errorMessageTicketCreateWithCode")),
            titleMessage: _.upperFirst(_.get(dictionnary, lang + ".tickets")),
            errorStatus: 419
          });
        }
        if (error.status === 401) {
          this.setState({
            typeMessage: "error",
            message: _.upperFirst(_.get(dictionnary, lang + ".errorMessageAuthentication")),  
            titleMessage: _.upperFirst(_.get(dictionnary, lang + ".tickets")),
            errorStatus: 401
          });
        }
      }
    );
  };

  render() {
    //console.log(this.props.event);
    //console.log(this.props.user);
    //console.log(this.state.selectedMode);
    let lang = _.toUpper(this.props.lang);
    return (
      <React.Fragment>
        <FormControl variant="outlined" fullWidth={true}>
          <Select
            value={this.state.selectedMode}
            onChange={e => {
              this.setState({ selectedMode: e.target.value });
            }}
            input={<OutlinedInput />}
          >
            <MenuItem value="manual" disabled={_.isEmpty(this.props.event.codesMarchands)}>
              {_.upperFirst(_.get(dictionnary, lang + ".manualPayment"))}
            </MenuItem>
            <MenuItem value="mobilemoney" disabled={true}>
              Mobile money
            </MenuItem>
            <MenuItem value="cb" disabled={true}>
              {_.upperFirst(_.get(dictionnary, lang + ".bankCard"))}
            </MenuItem>
            <MenuItem value="paypal" disabled={true}>
              PayPal
            </MenuItem>
          </Select>
        </FormControl>

        {this.state.selectedMode === "manual"
          ? <div style={{ marginTop: "30px", marginBottom: "30px" }}>
              <Typography variant="subtitle1" gutterBottom={true}>
                {_.upperFirst(_.get(dictionnary, lang + ".buyTicketDescriptionMessage"))}
              </Typography>
              <Typography color="textSecondary">
                <strong>
                  {_.upperFirst(_.get(dictionnary, lang + ".price"))}
                  &nbsp;:&nbsp;
                  {this.props.lang === "en"
                    ? Number(this.props.event.price).toLocaleString("en-EN")
                    : Number(this.props.event.price).toLocaleString("fr-FR")
                  }
                </strong>
              </Typography>
              {_.map(this.props.event.codesMarchands, (cm, index) => 
                <div key={index} style={{marginTop: "20px" }}>
                  <Typography variant="body2" gutterBottom={true}>
                    <strong>
                      {_.upperFirst(_.get(dictionnary, lang + ".operator"))}
                    </strong> : {cm.operator}
                  </Typography>
                  <Typography variant="body2" gutterBottom={true}>
                    <strong>
                      {_.upperFirst(_.get(dictionnary, lang + ".numero"))}  
                    </strong> : {cm.numero}
                  </Typography>
                </div>
              )}

              <Divider style={{ marginTop: "20px", marginBottom: "20px" }}/>
              
              <TextField 
                style={{ marginBottom: "20px" }}
                label={_.upperFirst(_.get(dictionnary, lang + ".code"))}
                fullWidth={true}
                variant="outlined"
                value={this.state.code}
                onChange={e => this.setState({ code: e.target.value })}
              />

              <Button
                variant="contained"
                color="primary"
                style={{
                  margin: "0 auto", 
                  display: "flex",
                  flexDirection: "column",
                  width: "Auto"
                }}
                onClick={() => {
                  if (!_.isEmpty(this.state.code)) {
                    this.getTicket();
                  }
                }}
              >
                {_.get(dictionnary, lang + ".getTicket")}
              </Button>
            </div>
          : null
        }

        {/* Message résultat achat ticket */}
        <ModalMessage 
          open={!_.isEmpty(this.state.message)}
          title={this.state.titleMessage}
          message={this.state.message}
          type={this.state.typeMessage}
          onAction={() => {
            if (this.state.errorStatus === 419 || _.isNull(this.state.errorStatus)) {
              this.setState({
                titleMessage: "",
                message: "",
                typeMessage: "",
                errorStatus: null,
                code: ""
              });
            }
            if (this.state.errorStatus === 401) {
              localStorage.setItem("jwt", "");
              window.location.reload();
            }
          }}
        />
      </React.Fragment>
    )
  }
}