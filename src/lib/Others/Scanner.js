import React from "react";
import PropTypes from "prop-types";

import {
  Badge,
  Button,
  Card,
  CardHeader,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Typography
} from "@material-ui/core";

import {
  Money,
  QueryBuilder
} from "@material-ui/icons";

import QrReader from "react-qr-reader";

import { ModalMessage } from "../../lib";

import _ from "lodash";
import { dictionnary } from "../Langs/langs";
import { displayDate, displayTime, priceValuePrinting, signOut } from "../Helpers/Helpers";

const styles = {
  cardHeader: {
    backgroundColor: "#EEEEEE"
  }
}

/**
 * Codes erreur :
 * 401 - authentification
 * 419 - erreur sur l'opération
 * 1 - error network
 * 2 - no event found
 * 3 - not your event
 */

export default class Scanner extends React.Component {
  static propTypes = {
    client: PropTypes.any.isRequired,
    lang: PropTypes.string,
    user: PropTypes.object,
    jwt: PropTypes.string
  };

  static defaultProps = {
    lang: "fr"
  };

  state = {
    ticket: {},
    loading: false,
    // erreurs
    errorStatus: null,
    errorMessage: ""
  };

  isTicket = obj => {
    return (
      !_.isUndefined(obj.id) &&
      !_.isUndefined(obj.ticketNumber) &&
      !_.isUndefined(obj.code) &&
      !_.isUndefined(obj.eventCode) &&
      !_.isUndefined(obj.seller) &&
      !_.isUndefined(obj.user) &&
      !_.isUndefined(obj.price) &&
      !_.isUndefined(obj.createdAt) &&
      !_.isUndefined(obj.valide) &&
      !_.isUndefined(obj.valideStatusChangedAt)
    );
  };

  handleScan = result => {
    //console.log(result);
    if (!_.isNull(result)) {
      try {
        let data = JSON.parse(result);
        if (this.isTicket(data)) {
          this.setState({ ticket: data });
        }
      } catch (e) {
        return;
      }
    }
  };

  ticketOperation = operation => {
    let onSuccess = result => {
      this.setState({
        ticket: result.data.ticket,
        loading: false
      });
    };

    let onError = error => {
      this.setState({
        errorStatus: _.isUndefined(error)
          ? 1
          : error.status,
        errorMessage: _.isUndefined(error)
          ? _.upperFirst(_.get(dictionnary, lang + ".errorMessageNetwork"))
          : error.status === 401
            ? _.upperFirst(_.get(dictionnary, lang + ".errorMessageAuthentication"))
            : _.upperFirst(_.get(dictionnary, lang + ".errorOccurredMessage")),
        loading: false,
      });
    };

    this.setState({ loading: true });
    let lang = _.toUpper(this.props.lang);

    if (operation === "VALIDATION") {
      this.props.client.Ticket.validation(
        this.props.jwt,
        this.state.ticket.ticketNumber,
        result => onSuccess(result),
        error => onError(error)
      );
    } else if (operation === "PAUSE") {
      this.props.client.Ticket.pause(
        this.props.jwt,
        this.state.ticket.ticketNumber,
        result => onSuccess(result),
        error => onError(error)
      );
    }
  };

  render() {
    //console.log(this.state.ticket);
    let lang = _.toUpper(this.props.lang);
    return (
      <React.Fragment>
        <Container>            
          {_.isEmpty(this.state.ticket)
            ? <Grid container={true} style={{ textAlign: "center" }}>
                <Grid item={true} xs={12}>
                  <QrReader 
                    onError={error => console.log(error)}
                    onScan={result => this.handleScan(result)}
                    showViewFinder={false}
                    style={{ maxWidth: "400px" }}
                  />
                </Grid>
              </Grid>
            : <React.Fragment>
                <Grid container={true} spacing={2}>
                  <Grid item={true} xs={12} md={4}>
                    <Card>
                      <CardHeader 
                        title={
                          <Badge
                            color={
                              this.state.ticket.valide ? "primary" : "error"
                            }
                            overlap="circle"
                            badgeContent=" "
                          >
                            &nbsp;
                          </Badge>
                        }
                        titleTypographyProps={{ align: "center" }}
                        style={styles.cardHeader}
                      />
                      <CardContent style={{ textAlign: "center" }}>
                        <Typography variant="body2" color="textSecondary">
                          {this.state.ticket.ticketNumber}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item={true} xs={12} md={4}>
                    <Card>
                      <CardHeader 
                        title={
                          <Money 
                            color="primary"
                            style={{ fontSize: 25 }}
                          />
                        }
                        titleTypographyProps={{ align: "center" }}
                        style={styles.cardHeader}
                      />
                      <CardContent style={{ textAlign: "center" }}>
                        <Typography variant="body2" color="textSecondary">
                          {priceValuePrinting(this.state.ticket.price.value, this.props.lang) + " " + this.state.ticket.price.currency}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item={true} xs={12} md={4}>
                    <Card>
                      <CardHeader 
                        title={
                          <QueryBuilder 
                            color={this.state.ticket.valide ? "primary" : "error"}
                            style={{ fontSize: 25 }}
                          />
                        }
                        titleTypographyProps={{ align: "center" }}
                        style={styles.cardHeader}
                      />
                      <CardContent style={{ textAlign: "center" }}>
                        <Typography variant="body2" color="textSecondary">
                          {this.state.ticket.valide && _.isNull(this.state.ticket.valideStatusChangedAt)
                            ? displayDate(this.state.ticket.createdAt, this.props.lang) +
                              " - " + displayTime(this.state.ticket.createdAt, this.props.lang)
                            : displayDate(this.state.ticket.valideStatusChangedAt, this.props.lang) +
                              " - " + displayTime(this.state.ticket.valideStatusChangedAt, this.props.lang)
                          }
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* loader qui apparaît quand on clique sur valider */}
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

                {/* différents boutons */}
                <Grid container={true} spacing={1} style={{ marginTop: "25px" }} justify="center">
                  <Grid item={true} xs={12} sm={6}>
                    <Button
                      fullWidth={true}
                      variant="contained"
                      onClick={() => this.setState({ ticket: {} })}
                    >
                      {_.upperFirst(_.get(dictionnary, lang + ".cancel"))}
                    </Button>
                  </Grid>

                  <Grid item={true} xs={12} sm={6}>
                    <Button
                      color="primary"
                      fullWidth={true}
                      variant="contained"
                      onClick={() => {
                        if (this.state.ticket.valide) {
                          this.ticketOperation("VALIDATION");
                        } else {
                          this.ticketOperation("PAUSE");
                        }
                      }}
                    >
                      {this.state.ticket.valide
                        ? _.isNull(this.state.ticket.valideStatusChangedAt)
                          ? _.upperFirst(_.get(dictionnary, lang + ".validate"))
                          : _.upperFirst(_.get(dictionnary, lang + ".revalidate"))
                        : _.upperFirst(_.get(dictionnary, lang + ".ticketPause"))
                      }
                    </Button>
                  </Grid>
                  
                </Grid>
              </React.Fragment>
          }
        </Container>

        {/* Popup message */}
        <ModalMessage 
          open={!_.isNull(this.state.errorStatus)}
          title={_.upperFirst(_.get(dictionnary, lang + ".scan"))}
          type="error"
          message={this.state.errorMessage}
          onAction={() => {
            if (this.state.errorStatus === 401) {
              // déconnexion
              signOut();
            } else {
              this.setState({
                ticket: {},
                errorStatus: null,
                errorMessage: ""
              });
            }
          }}
        />
      </React.Fragment>
    );
  }
}