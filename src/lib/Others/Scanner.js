import React, { useState, useEffect } from "react";
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

import { useHistory } from "react-router-dom";

import { ModalMessage } from "../../lib";

import _ from "lodash";
import { dictionnary } from "../Langs/langs";
import {
  displayDate,
  displayTime,
  priceValuePrinting,
  signOut,
  userIsAdmin,
  userIsSeller,
  userIsTech
} from "../Helpers/Helpers";

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

const Scanner = props => {
  const [ticket, setTicket] = useState({});
  const [loading, setLoading] = useState(false);
  // erreurs
  const [errorStatus, setErrorStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const history = useHistory();

  useEffect(() => {
    if (
      !userIsAdmin(props.user.roles) &&
      !userIsSeller(props.user.roles) &&
      !userIsTech(props.user.roles)
    ) {
      history.push("/plateform/events");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isTicket = obj => {
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

  const handleScan = result => {
    //console.log(result);
    if (!_.isNull(result)) {
      try {
        let data = JSON.parse(result);
        if (isTicket(data)) {
          setTicket(data);
        }
      } catch (e) {
        return;
      }
    }
  };

  const ticketOperation = operation => {
    let onSuccess = result => {
      setTicket(result.data.ticket);
      setLoading(false);
    };

    let onError = error => {
      setErrorStatus(
        _.isUndefined(error)
          ? 1
          : error.status
      );
      setErrorMessage(
        _.isUndefined(error)
          ? _.upperFirst(_.get(dictionnary, lang + ".errorMessageNetwork"))
          : error.status === 401
            ? _.upperFirst(_.get(dictionnary, lang + ".errorMessageAuthentication"))
            : _.upperFirst(_.get(dictionnary, lang + ".errorOccurredMessage"))
      );
      setLoading(false);
    };

    setLoading(true);
    let lang = _.toUpper(props.lang);

    if (operation === "VALIDATION") {
      props.client.Ticket.validation(
        props.jwt,
        ticket.ticketNumber,
        result => onSuccess(result),
        error => onError(error)
      );
    } else if (operation === "PAUSE") {
      props.client.Ticket.pause(
        props.jwt,
        ticket.ticketNumber,
        result => onSuccess(result),
        error => onError(error)
      );
    }
  };

  //console.log(this.state.ticket);
  let lang = _.toUpper(props.lang);
  return (
    <React.Fragment>
      <Container>            
        {_.isEmpty(ticket)
          ? <Grid container={true} style={{ textAlign: "center" }}>
              <Grid item={true} xs={12}>
                <QrReader 
                  onError={error => console.log(error)}
                  onScan={result => handleScan(result)}
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
                          color={ticket.valide ? "primary" : "error"}
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
                        {ticket.ticketNumber}
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
                        {priceValuePrinting(ticket.price.value, props.lang) + " " + ticket.price.currency}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item={true} xs={12} md={4}>
                  <Card>
                    <CardHeader 
                      title={
                        <QueryBuilder 
                          color={ticket.valide ? "primary" : "error"}
                          style={{ fontSize: 25 }}
                        />
                      }
                      titleTypographyProps={{ align: "center" }}
                      style={styles.cardHeader}
                    />
                    <CardContent style={{ textAlign: "center" }}>
                      <Typography variant="body2" color="textSecondary">
                        {ticket.valide && _.isNull(ticket.valideStatusChangedAt)
                          ? displayDate(ticket.createdAt, props.lang) +
                            " - " + displayTime(ticket.createdAt, props.lang)
                          : displayDate(ticket.valideStatusChangedAt, props.lang) +
                            " - " + displayTime(ticket.valideStatusChangedAt, props.lang)
                        }
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* loader qui apparaît quand on clique sur valider */}
              {loading
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
                    onClick={() => setTicket({})}
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
                      if (ticket.valide) {
                        ticketOperation("VALIDATION");
                      } else {
                        ticketOperation("PAUSE");
                      }
                    }}
                  >
                    {ticket.valide
                      ? _.isNull(ticket.valideStatusChangedAt)
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
        open={!_.isNull(errorStatus)}
        title={_.upperFirst(_.get(dictionnary, lang + ".scan"))}
        type="error"
        message={errorMessage}
        onAction={() => {
          if (errorStatus === 401) {
            // déconnexion
            signOut();
          } else {
            setTicket({});
            setErrorStatus(null);
            setErrorMessage("");
          }
        }}
      />
    </React.Fragment>
  );
};

Scanner.propTypes = {
  client: PropTypes.any.isRequired,
  lang: PropTypes.string,
  user: PropTypes.object,
  jwt: PropTypes.string
};

Scanner.defaultProps = {
  lang: "fr"
};

export default Scanner;