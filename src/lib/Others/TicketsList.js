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
  CenterFocusStrong,
  DateRange,
  EventNote,
  EventSeat,
  ExpandMore,
  Place,
  Search
} from "@material-ui/icons";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import DateFnsUtils from "@date-io/date-fns";
import frLocale from "date-fns/locale/fr";
import enLocale from "date-fns/locale/en-US";

import _ from "lodash";
import moment from "moment";

import { ModalMessage } from "../../lib";

import QRCode from "qrcode.react";

import bytImage from "../../images/favicon/favicon_byt.jpg";

import { dictionnary } from "../Langs/langs";
import { displayDate, displayTime, priceValuePrinting, signOut } from "../Helpers/Helpers";

const styles = {
  cardHeader: {
    backgroundColor: "#EEEEEE"
  }
};

export default class TicketsList extends React.Component {
  static propTypes = {
    client: PropTypes.any.isRequired,
    jwt: PropTypes.string,
    lang: PropTypes.string,
    user: PropTypes.object
  };

  static defaultProps = {
    lang: "fr"
  };

  state = {
    eventCode: "",
    seller: "",
    user: this.props.user.code,
    createdAt: null,
    loading: false,
    tickets: [],
    selectedTicket: {},
    // sections
    tab: "all",
    // gestion d'erreurs
    errorStatus: null,
    errorMessage: ""
  };

  componentDidMount() {
    let params = {};
    params.eventCode = this.state.eventCode;
    params.seller = this.state.seller;
    params.user = this.state.user;
    params.createdAt = this.state.createdAt;
    this.search(params);
  };

  search = params => {
    // perform the request here
    let p = params;
    p.eventCode = _.isEmpty(params.eventCode) ? null : params.eventCode;
    p.seller = _.isEmpty(params.seller) ? null : params.seller;
    p.user = _.isEmpty(params.user) ? null : params.user;
    p.createdAt = _.isNull(params.createdAt) ? null : moment(params.createdAt).format("YYYY-MM-DD");
    
    this.setState({ loading: true });
    this.props.client.Ticket.readAll(
      this.props.jwt,
      p,
      result => {
        //console.log(result);
        this.setState({
          loading: false,
          tickets: result.data.results.content
        });
      },
      error => {
        console.log(error);
        // Gestion d'erreurs
        let lang = _.toUpper(this.props.lang);
        this.setState({
          tickets: [],
          loading: false,
          errorStatus: _.isUndefined(error)
            ? 1
            : error.status,
          errorMessage: _.isUndefined(error)
            ? _.upperFirst(_.get(dictionnary, lang + ".errorMessageNetwork"))
            : error.status === 401
              ? _.upperFirst(_.get(dictionnary, lang + ".errorMessageAuthentication"))
              : _.upperFirst(_.get(dictionnary, lang + ".errorOccurredMessage"))
        });
      }
    );
  };

  render () {
    let lang = _.toUpper(this.props.lang);
    let customSearch =
      _.includes(this.props.user.roles, "TECH") || _.includes(this.props.user.roles, "ADMIN");
    
    const listTickets = (
      <React.Fragment>
        {_.isEmpty(this.state.tickets)
          ? <Grid container={true} style={{ marginTop: "25px", marginBottom: "25px" }}>
              <Grid item={true} xs={12} style={{ textAlign: "center" }}>
                <img src={bytImage} alt="no codes" />
              </Grid>
            </Grid>
          : <Grid container={true} style={{ marginTop: "25px", marginBottom: "25px" }} spacing={2}>
              {_.map(this.state.tickets, (ticket, index) => 
                <Grid item={true} xs={12} sm={4} key={index}>
                  <TicketSimpleView 
                    ticket={ticket}
                    lang={this.props.lang}
                    onSelection={selectedTicket => {
                      this.setState({
                        selectedTicket: selectedTicket,
                        tab: "read"
                      })
                    }}
                  />
                </Grid>     
              )}
            </Grid>
        }
      </React.Fragment>
    );
    return (
      <React.Fragment>
        <Container maxWidth="md">
          {customSearch
            ? <ExpansionPanel square={true}>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMore />}
                >
                  <Typography variant="body1" color="textSecondary">
                    {_.upperFirst(_.get(dictionnary, lang + ".search"))}
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Grid container={true} spacing={1}>
                    <Grid item={true} xs={12} sm={6}>
                      <TextField 
                        fullWidth={true}
                        label={_.upperFirst(_.get(dictionnary, lang + ".eventCode"))}
                        value={this.state.eventCode}
                        onChange={e => this.setState({ eventCode: e.target.value })}
                      />
                    </Grid>
                    <Grid item={true} xs={12} sm={6}>
                      <TextField 
                        fullWidth={true}
                        label={_.upperFirst(_.get(dictionnary, lang + ".seller"))}
                        value={this.state.seller}
                        onChange={e => this.setState({ seller: e.target.value })}
                      />
                    </Grid>
                    <Grid item={true} xs={12} sm={6}>
                      <TextField 
                        fullWidth={true}
                        label={_.upperFirst(_.get(dictionnary, lang + ".userCode"))}
                        value={this.state.user}
                        onChange={e => this.setState({ user: e.target.value })}
                      />
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

                    {/* Button search */}
                    <Grid item={true} xs={12}>
                      <Button
                        variant="contained"
                        fullWidth={true}
                        color="primary"
                        size="large"
                        onClick={() => {
                          let p = {};
                          p.eventCode = this.state.eventCode;
                          p.seller = this.state.seller;
                          p.user = this.state.user;
                          p.createdAt = this.state.createdAt;
                          this.search(p);
                        }}
                      >
                        <Search />
                      </Button>
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            : null
          }

          {/* sections */}
          <Tabs
            value={this.state.tab}
            onChange={(e, tab) => {
              let p = {};
              p.eventCode = this.state.eventCode;
              p.seller = this.state.seller;
              p.user = this.state.user;
              p.createdAt = this.state.createdAt;
              this.setState({ tab: tab, selectedTicket: {} });
              this.search(p);
            }}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            style={{ marginBottom: "10px" }}
          >
            <Tab 
              label={<EventNote />}
              value="all"
            />
            <Tab 
              label={<CenterFocusStrong />}
              value="read"
              disabled={true}
            />
          </Tabs>

          {/* listing des tickets */}
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

          {this.state.tab === "all"
            ? listTickets
            : !_.isEmpty(this.state.selectedTicket)
              ? <TicketExpandedView
                  client={this.props.client}
                  jwt={this.props.jwt}
                  ticket={this.state.selectedTicket}
                  lang={this.props.lang}
                />
              : null
          }          
        </Container>

        {/* Modal Message Erreur */}
        <ModalMessage 
          open={!_.isNull(this.state.errorStatus)}
          title={_.upperFirst(_.get(dictionnary, lang + ".tickets"))}
          message={this.state.errorMessage}
          type="error"
          onAction={() => {
            if (this.state.errorStatus === 401) {
              // déconnexion
              signOut();
            } else {
              this.setState({
                errorMessage: "",
                errorStatus: null
              })
            }
          }}
        />
      </React.Fragment>
    );
  }
}

class TicketSimpleView extends React.Component {
  render () {
    return (
      <React.Fragment>
        <Card
          onClick={() => this.props.onSelection(this.props.ticket)}
        >
          <CardHeader 
            avatar={
              <Avatar 
                aria-label="ticket"
                variant="square"
              >
                <CenterFocusStrong
                  color={
                    this.props.ticket.valide && !this.props.ticket.valideStatusChangedAt
                      ? "inherit"
                      : this.props.ticket.valide && this.props.ticket.valideStatusChangedAt
                        ? "primary"
                        : "error"
                  }
                />
              </Avatar>
            }
            title={this.props.ticket.ticketNumber}
            subheader={
              <React.Fragment>
                <Typography variant="body2" color="textSecondary">
                  {displayDate(this.props.ticket.createdAt, this.props.lang) + " - " +
                    displayTime(this.props.ticket.createdAt, this.props.lang) 
                  }
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {priceValuePrinting(this.props.ticket.price.value, this.props.lang) + " " + this.props.ticket.price.currency}
                </Typography>
              </React.Fragment>
            }
          />
          <CardContent style={{ textAlign: "center" }}>
            <QRCode 
              value={JSON.stringify(this.props.ticket)}
              size={200}
            />
          </CardContent>
        </Card>
      </React.Fragment>
    );
  }
}

class TicketExpandedView extends React.Component {
  state = {
    event: {},
    loading: true
  };

  componentDidMount() {
    this.props.client.Event.readByCodeSimple(
      this.props.jwt,
      this.props.ticket.eventCode,
      result => {
        //console.log(result);
        this.setState({
          loading: false,
          event: result.data.event
        });
      },
      error => {
        //console.log(error);
        // TODO Gérer les erreurs à ce niveau
        this.setState({
          loading: false
        });
      }
    );
  }

  render() {
    return (
      <React.Fragment>
        <Container style={{ marginBottom: "25px" }}>
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

          {/* QRCode */}
          <Grid container={true} style={{ marginBottom: "30px" }}>
            <Grid item={true} xs={12} style={{ textAlign: "center" }}>
              <QRCode 
                value={JSON.stringify(this.props.ticket)}
                size={260}
              />
            </Grid>
          </Grid>

          {/* Affichage de quelques informations de l'événement */}
          {!_.isEmpty(this.state.event)
            ? <React.Fragment>
                <Grid container={true} spacing={2}>
                  <Grid item={true} xs={12}>
                    <Card>
                      <CardHeader 
                        title={
                          <EventNote 
                            color="primary"
                            style={{ fontSize: 25 }}
                          />
                        }
                        titleTypographyProps={{ align: "center" }}
                        style={styles.cardHeader}
                      />
                      <CardContent style={{ textAlign: "center" }}>
                        <Typography variant="body1" color="textSecondary">
                          {this.state.event.name}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item={true} xs={12} sm={6}>
                    <Card>
                      <CardHeader 
                        title={
                          <DateRange 
                            color="primary"
                            style={{ fontSize: 25 }}
                          />
                        }
                        titleTypographyProps={{ align: "center" }}
                        style={styles.cardHeader}
                      />
                      <CardContent style={{ textAlign: "center" }}>
                        <Typography variant="body1" color="textSecondary">
                          {displayDate(this.state.event.date, this.props.lang) + " - " + displayTime(this.state.event.date, this.props.lang)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item={true} xs={12} sm={6}>
                    <Card>
                      <CardHeader 
                        title={
                          <EventSeat 
                            color="primary"
                            style={{ fontSize: 25 }}
                          />
                        }
                        titleTypographyProps={{ align: "center" }}
                        style={styles.cardHeader}
                      />
                      <CardContent style={{ textAlign: "center" }}>
                        <Typography variant="body1" color="textSecondary">
                          {priceValuePrinting(this.props.ticket.price.value, this.props.lang) + " " + this.props.ticket.price.currency}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* description */}
                  {!_.isEmpty(this.state.event.description)
                    ? <Grid item={true} xs={12}>
                        <Card>
                          <CardContent>
                            <Typography variant="body1" color="textSecondary">
                              {this.state.event.description}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    : null
                  }
                </Grid>

                {/* Adresse - Venue */}
                {!_.isNull(this.state.event.venue)
                  ? <React.Fragment>
                      <Grid container={true} style={{ marginTop: "10px" }}>
                        <Grid item={true} xs={12}>
                          <Card>
                            <CardHeader 
                              title={
                                <Place 
                                  color="primary"
                                  style={{ fontSize: 25 }}
                                />
                              }
                              titleTypographyProps={{ align: "center" }}
                              style={styles.cardHeader}
                            />
                            <CardContent style={{ textAlign: "center" }}>
                              <Typography variant="body1" color="textSecondary">
                                {!_.isEmpty(this.state.event.venue.number)
                                  ? "N° " + this.state.event.venue.number + ", "
                                  : null
                                }
                                {!_.isEmpty(this.state.event.venue.road)
                                  ? this.state.event.venue.road
                                  : null
                                }
                              </Typography>
                              {!_.isEmpty(this.state.event.venue.details)
                                ? <Typography variant="body1" color="textSecondary">
                                    {this.state.event.venue.details}
                                  </Typography>
                                : null
                              }
                              <Typography variant="body1" color="textSecondary">
                                {!_.isEmpty(this.state.event.venue.city)
                                  ? _.toUpper(this.state.event.venue.city) + ", "
                                  : null
                                }
                                {!_.isEmpty(this.state.event.venue.country)
                                  ? _.toUpper(this.state.event.venue.country)
                                  : null
                                }
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </React.Fragment>
                  : null
                }
              </React.Fragment>
            : null
          }
        </Container>
      </React.Fragment>
    )
  }
}