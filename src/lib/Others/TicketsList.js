import React from "react";
import PropTypes from "prop-types";

import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  DialogActions,
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
  EventNote,
  ExpandMore,
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

import emptyIcon from "../../empty-events.png";
import bytImage from "../../favicon_byt.jpg";

import { dictionnary } from "../Langs/langs";
import { displayDate, displayTime, priceValuePrinting } from "../Helpers/Helpers";

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
    tab: "all"
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
        console.log(result);
        this.setState({
          loading: false,
          tickets: result.data.results.content
        });
      },
      error => {
        console.log(error);
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
                        label="Event code"
                        value={this.state.eventCode}
                        onChange={e => this.setState({ eventCode: e.target.value })}
                      />
                    </Grid>
                    <Grid item={true} xs={12} sm={6}>
                      <TextField 
                        fullWidth={true}
                        label="Seller"
                        value={this.state.seller}
                        onChange={e => this.setState({ seller: e.target.value })}
                      />
                    </Grid>
                    <Grid item={true} xs={12} sm={6}>
                      <TextField 
                        fullWidth={true}
                        label="User"
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
                          format={this.props.lang === "en" ? "MM/dd/yyyy" : "dd/MM/yyyy"}
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
                  ticket={this.state.selectedTicket}
                  lang={this.props.lang}
                />
              : null
          }          
        </Container>
      </React.Fragment>
    );
  }
}

class TicketsListttt extends React.Component {
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
    tickets: [],
    loading: true,
    selectedTicket: {},
    errorStatus: null,
    errorMessage: ""
  };

  reload = () => {
    this.props.client.Ticket.readAll(
      this.props.jwt,
      { user: this.props.user.login },
      result => {
        //console.log(result);
        this.setState({
          tickets: result.data.data,
          loading: false,
          selectedTicket: {}
        });
      },
      error => {
        //console.log(error);
        let lang = _.toUpper(this.props.lang);
        this.setState({
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
  }

  componentDidMount() {
    this.reload();
  }

  render() {
    let lang = _.toUpper(this.props.lang);
    let tickets = (
      <Grid
        container={true}
        justify="space-between"
      >
        {_.map(this.state.tickets, (ticket, index) =>
          <div 
            key={index} 
            style={{ 
              marginTop: "10px", 
              marginBottom: "10px",
              marginRight: "3px",
              marginLeft: "3px"
            }}
          >
            <Ticket 
              ticket={ticket}
              onSelection={ticket => this.setState({ selectedTicket: ticket })}
              lang={this.props.lang}
            />
          </div>
        )}
      </Grid>
    );

    return(
      <React.Fragment>
        {this.state.loading && _.isNull(this.state.errorStatus)
          ? <div style={{ textAlign: "center", marginTop: "40px" }}>
              <CircularProgress />
            </div>
          : _.isEmpty(this.state.tickets)
            ? <div style={{ textAlign: "center", marginTop: "40px", marginBottom: "40px" }}>
                <img src={emptyIcon} alt="no events" height="80" width="auto" />
              </div>
            : _.isEmpty(this.state.selectedTicket)
              ? tickets
              : <TicketView
                  ticket={this.state.selectedTicket}
                  lang={this.props.lang}
                  client={this.props.client}
                  jwt={this.props.jwt}
                  onCancel={this.reload}
                />
        }

        {/* Message d'erreur */}
        {!_.isNull(this.state.errorStatus)
          ? <ModalMessage 
              open={true}
              title={_.upperFirst(_.get(dictionnary, lang + ".tickets"))}
              type="error"
              message={this.state.errorMessage}
              onAction={() => {
                if (this.state.errorStatus === 401) {
                  // déconnexion
                  localStorage.setItem("jwt", "");
                  window.location.reload();
                } else {
                  this.props.onError();
                }
              }}
            />
          : null
        }       
      </React.Fragment>
    )
  }
}

class Ticket extends React.Component {
  render () {
    let lang = _.toUpper(this.props.lang);
    return (
      <React.Fragment>
        <Card
          raised={true}
          onClick={() => this.props.onSelection(this.props.ticket)}
        >
          <CardContent style={{ textAlign: "center" }}>
            <Badge
              color="error"
              badgeContent={_.upperFirst(_.get(dictionnary, lang + ".ticketUsed"))}
              invisible={this.props.ticket.valide}
              style={{ marginRight: "7px", marginBottom: "5px" }}
            >
              <QRCode 
                value={JSON.stringify(this.props.ticket)}
                size={200}
              />
            </Badge>
            <Typography color="textSecondary">
              <strong>N° : {this.props.ticket.numero}</strong>
            </Typography>
          </CardContent>
        </Card>
      </React.Fragment>
    )
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
                  color={this.props.ticket.valide ? "inherit" : "error" }
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
    event: {}
  };
  render() {
    return (
      <React.Fragment>
        <Container>
          {/* chargement */}
          {_.isEmpty(this.state.event)
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
        </Container>
      </React.Fragment>
    )
  }
}

class TicketView extends React.Component {
  static defaultProps = {
    lang: "fr"
  };

  state = {
    loading: true,
    event: {},
    openModalQRCode: false,
    errorStatus: null,
    errorMessage: ""
  };

  componentDidMount() {
    this.reload();
  };

  reload = () => {
    this.props.client.Event.readAll(
      this.props.jwt,
      { code: this.props.ticket.event },
      result => {
        //console.log(result);
        this.setState({
          event: _.isEmpty(result.data.data) ? {} : result.data.data[0],
          loading: false
        });
      },
      error => {
        //console.log(error);
        let lang = _.toUpper(this.props.lang);
        this.setState({
          errorStatus: _.isUndefined(error)
            ? 1
            : error.status,
          errorMessage: _.isUndefined(error)
            ? _.upperFirst(_.get(dictionnary, lang + ".errorMessageNetwork"))
            : error.status === 401
              ? _.upperFirst(_.get(dictionnary, lang + ".errorMessageAuthentication"))
              : _.upperFirst(_.get(dictionnary, lang + ".errorOccurredMessage")),
          loading: false
        });
      }
    );
  };

  render() {
    //console.log(this.props.ticket);
    let lang = _.toUpper(this.props.lang);
    return (
      <React.Fragment>
        {this.state.loading
          ? <div style={{ textAlign: "center", marginTop: "40px" }}>
              <CircularProgress />
            </div>
          : _.isEmpty(this.state.event)
            ? <Typography variant="h4" color="error">
                <strong>{_.upperFirst(_.get(dictionnary, lang + ".noTicketEventFound"))}</strong>
              </Typography>
            : <div>
                <Typography variant="h5" color="primary" gutterBottom={true}>
                  <strong>{_.upperFirst(_.get(dictionnary, lang + ".eventDetail"))}</strong>
                </Typography>
                
                {!_.isEmpty(this.state.event.photo)
                  ? <div style={{ marginBottom: "15px" }}>
                      <img 
                        src={"data:image/png;base64," + this.state.event.photo}
                        alt="Affiche"
                        height="150" 
                        width="auto"
                      />
                    </div>
                  : null
                }
                
                <Typography variant="body1" color="textSecondary" gutterBottom={true}>
                  <strong>{_.toUpper(this.state.event.name)}</strong>
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom={true}>
                  <strong>{this.state.event.code}</strong>
                </Typography>
                {!_.isEmpty(this.state.event.description)
                  ? <Typography variant="body1" color="textSecondary">
                      {this.state.event.description}
                    </Typography>
                  : null
                }
                <Typography variant="body1" color="textSecondary" gutterBottom={true}>
                  <strong>
                    {_.upperFirst(_.get(dictionnary, lang + ".price"))}
                  </strong> : 
                  {this.props.lang === "en"
                    ? Number(this.state.event.price).toLocaleString("en-EN")
                    : Number(this.state.event.price).toLocaleString("fr-FR")
                  }
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom={true}>
                  <strong>{_.upperFirst(_.get(dictionnary, lang + ".date"))}</strong> :&nbsp;
                  {this.props.lang === "en"
                    ? moment(this.state.event.date).format("MM/DD/YYYY")
                    : moment(this.state.event.date).format("DD/MM/YYYY")
                  }
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom={true}>
                  <strong>{_.upperFirst(_.get(dictionnary, lang + ".time"))}</strong> :&nbsp;
                  {this.props.lang === "en"
                    ? moment(this.state.event.date).format("LT")
                    : moment(this.state.event.date).format("HH:mm")
                  }
                </Typography>
                {!_.isEmpty(this.state.event.venue)
                  ? <Typography variant="body1" color="textSecondary" gutterBottom={true}>
                      <strong>{_.upperFirst(_.get(dictionnary, lang + ".venue"))}</strong> :&nbsp;
                      {this.state.event.venue}
                    </Typography>
                  : null
                }
              </div>
        }
        <div
          style={{
            textAlign: "center",
            marginTop: "10px",
            marginBottom: "10px"
          }}
          onClick={() => this.setState({ openModalQRCode: true })}
        >
          <Badge
              color="error"
              badgeContent={_.upperFirst(_.get(dictionnary, lang + ".ticketUsed"))}
              invisible={this.props.ticket.valide}
              style={{ marginRight: "7px", marginBottom: "5px" }}
            >
              <QRCode 
                value={JSON.stringify(this.props.ticket)}
                size={220}
              />
            </Badge>
        </div>

        <div style={{ textAlign: "center" }}>
          <Button
            variant="contained"
            onClick={() => {
              this.props.onCancel();
            }}
          >
            {_.get(dictionnary, lang + ".cancel")}
          </Button>
        </div>

        {/* Modal QRCode */}
        <Dialog open={this.state.openModalQRCode}>
          <DialogContent>
            <Badge
              color="error"
              badgeContent={_.upperFirst(_.get(dictionnary, lang + ".ticketUsed"))}
              invisible={this.props.ticket.valide}
              style={{ marginRight: "7px" }}
            >
              <QRCode 
                value={JSON.stringify(this.props.ticket)}
                size={200}
              />
            </Badge>
          </DialogContent>
          <DialogActions>
            {/*<Button
              style={{ color: "white", backgroundColor: "red" }}
            >
              {_.get(dictionnary, lang + ".delete")}
            </Button>*/}
            <Button 
              color="primary"
              onClick={() => {
                this.setState({ openModalQRCode: false });
              }}
              variant="contained"
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal Message Erreur */}
        <ModalMessage 
          open={!_.isNull(this.state.errorStatus)}
          title={_.upperFirst(_.get(dictionnary, lang + ".tickets"))}
          message={this.state.errorMessage}
          type="error"
          onAction={() => {
            if (this.state.errorStatus === 401) {
              // déconnexion
              localStorage.setItem("jwt", "");
              window.location.reload();
            } else {
              this.setState({
                errorMessage: "",
                errorStatus: null
              })
            }
          }}
        />
      </React.Fragment>
    )
  }
}