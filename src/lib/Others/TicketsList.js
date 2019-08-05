import React from "react";
import PropTypes from "prop-types";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogActions,
  Grid,
  Typography
} from "@material-ui/core";

import _ from "lodash";
import moment from "moment";

import { ModalMessage } from "../../lib";

import QRCode from "qrcode.react";

import emptyIcon from "../../empty-events.png";

import { dictionnary } from "../Langs/langs";

export default class TicketsList extends React.Component {
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