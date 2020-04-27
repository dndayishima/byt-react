import React from "react";
import PropTypes from "prop-types";

import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
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
import { getAllCodesMarchands, priceValuePrinting, signOut } from "../Helpers/Helpers";

import econet from "../../images/operateurs/econet.png";
import lumitel from "../../images/operateurs/lumitel.png";
import smart from "../../images/operateurs/smart.png";
import finbank from "../../images/operateurs/finbank.jpg";
import bancobu from "../../images/operateurs/bancobu.jpg";
import bytImage from "../../images/favicon/favicon_byt.jpg";

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
    code: "",
    loading: false,
    // retour utilisateur sur l'achat d'un ticket
    message: "",
    titleMessage: "",
    typeMessage: "",
    errorStatus: null
  };

  getPriceByCurrency = (prices, currency) => {
    return _.filter(prices, price => price.currency === currency);
  };

  getTicketByCode = () => {
    if (_.isEmpty(this.state.code)) {
      return;
    }
    this.setState({ loading: true });
    let params = {};
    let lang = _.toUpper(this.props.lang);
    params.code = this.state.code;
    params.priceId = this.props.price.id;
    params.eventCode = this.props.event.code;
    this.props.client.Ticket.createByCode(
      this.props.jwt,
      params,
      result => {
        //console.log(result);
        this.setState({
          loading: false,
          typeMessage: "success",
          message: _.upperFirst(_.get(dictionnary, lang + ".createTicketMessageSuccess")),
          titleMessage: _.upperFirst(_.get(dictionnary, lang + ".tickets")),
          errorStatus: null
        });
      },
      error => {
        //console.log(error);
        this.setState({ loading: false });
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

  getImageOperator = idPhoto => {
    let image = null;
    switch (idPhoto) {
      case 0 :
        image = econet;
        break;
      case 1 :
        image = lumitel;
        break;
      case 2 :
        image = smart;
        break;
      case 3 :
        image = finbank;
        break;
      case 4 :
        image = bancobu;
        break;
      default :
        image = bytImage;
        break;
    }
    return image;
  };

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
                              src={this.getImageOperator(cm.idPhoto)}
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

                {/* chargement */}
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
              });
            }
            if (this.state.errorStatus === 401) {
              signOut();
            }
          }}
        />
      </React.Fragment>
    );
  }
}