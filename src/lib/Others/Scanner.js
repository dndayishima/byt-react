import React from "react";
import PropTypes from "prop-types";

import {
  Button,
  CircularProgress,
  Typography
} from "@material-ui/core";

import QrReader from "react-qr-reader";

import { ModalMessage } from "../../lib";

import _ from "lodash";
import moment from "moment";
import { dictionnary } from "../Langs/langs";


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
    //event: {},
    loading: false,
    modalMessage: false,
    message: "",
    errorStatus: null
  };

  getEvent = () => {
    let lang = _.toUpper(this.props.lang);
    this.props.client.Event.readAll(
      this.props.jwt,
      { code: this.state.ticket.event },
      result => {
        //console.log(result);
        if (!_.isEmpty(result.data.data)) {
          if (result.data.data[0].seller === this.props.user.login) {
            this.ticketValidation();
          } else {
            this.setState({
              errorStatus: 3,
              message: _.upperFirst(_.get(dictionnary, lang + ".errorMessageNotYourEvent")),
              loading: false,
              modalMessage: true
            });
          }
        } else {
          this.setState({
            errorStatus: 2,
            message: _.upperFirst(_.get(dictionnary, lang + ".noTicketEventFound")),
            loading: false,
            modalMessage: true
          });
        }
      },
      error => {
        this.setState({
          errorStatus: _.isUndefined(error)
            ? 1
            : error.status,
          message: _.isUndefined(error)
            ? _.upperFirst(_.get(dictionnary, lang + ".errorMessageNetwork"))
            : error.status === 401
              ? _.upperFirst(_.get(dictionnary, lang + ".errorMessageAuthentication"))
              : _.upperFirst(_.get(dictionnary, lang + ".errorOccurredMessage")),
          loading: false,
          modalMessage: true
        });
      }
    );
  };

  ticketValidation = () => {
    let lang = _.toUpper(this.props.lang);
    this.props.client.Ticket.validation(
      this.props.jwt,
      this.state.ticket.id,
      result => {
        this.setState({
          modalMessage: true,
          message: _.upperFirst(_.get(dictionnary, lang + ".scanMessageSuccess")),
          loading: false
        });
      },
      error => {
        //console.log(error);
        this.setState({
          errorStatus: _.isUndefined(error)
            ? 1
            : error.status,
          message: _.isUndefined(error)
            ? _.upperFirst(_.get(dictionnary, lang + ".errorMessageNetwork"))
            : error.status === 401
              ? _.upperFirst(_.get(dictionnary, lang + ".errorMessageAuthentication"))
              : _.upperFirst(_.get(dictionnary, lang + ".errorOccurredMessage")),
          loading: false,
          modalMessage: true
        });
      }
    );
  };

  isTicket = obj => {
    return (
      !_.isUndefined(obj.code) &&
      !_.isUndefined(obj.dateBuy) &&
      !_.isUndefined(obj.event) &&
      !_.isUndefined(obj.numero) &&
      !_.isUndefined(obj.price) &&
      !_.isUndefined(obj.user) &&
      !_.isUndefined(obj.valide)
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

  render () {
    let lang = _.toUpper(this.props.lang);
    return (
      <React.Fragment>
        <div
          style={{
            margin: "0 auto",
            maxWidth: "600px",
            display: "flex",
            flexDirection: "column",
            width: "Auto"
          }}
        >
          {_.isEmpty(this.state.ticket)
            ? <QrReader 
                onError={error => console.log(error)}
                onScan={this.handleScan}
                showViewFinder={false}
                style={{ maxWidth: "400px" }}
              />
            : <div>
                <Typography variant="h6" gutterBottom={true} color="textSecondary">
                  <strong>N° : </strong> {this.state.ticket.numero}
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom={true}>
                  {_.upperFirst(_.get(dictionnary, lang + ".dateBuy"))}
                  &nbsp;:&nbsp;
                  {this.props.lang === "en"
                    ? moment(this.state.ticket.dateBuy).format("MM/DD/YYYY")
                    : moment(this.state.ticket.dateBuy).format("DD/MM/YYYY")
                  }
                  &nbsp;-&nbsp;
                  {this.props.lang === "en"
                    ? moment(this.state.ticket.dateBuy).format("LT")
                    : moment(this.state.ticket.dateBuy).format("HH:mm")
                  }
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom={true}>
                  {_.upperFirst(_.get(dictionnary, lang + ".price"))}
                  &nbsp;:&nbsp;
                  {this.props.lang === "en"
                    ? Number(this.state.ticket.price).toLocaleString("en-EN")
                    : Number(this.state.ticket.price).toLocaleString("fr-FR")
                  }
                </Typography>

                {!this.state.ticket.valide
                  ? <Typography variant="h6" color="error" gutterBottom={true}>
                      <strong>{_.upperFirst(_.get(dictionnary, lang + ".ticketUsed"))}</strong>
                    </Typography>
                  : null
                }

                {this.state.loading
                  ? <div style={{ textAlign: "center", marginTop: "40px" }}>
                      <CircularProgress />
                    </div>
                  : null
                }

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px",
                    marginBottom: "15px"
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={() => {
                      this.setState({ ticket: {}, loading: false });
                    }}
                  >
                    {_.upperFirst(_.get(dictionnary, lang + ".cancel"))}
                  </Button>
                  {this.state.ticket.valide
                    ? <Button
                        style={{ marginLeft: "5px" }}
                        color="primary"
                        variant="contained"
                        onClick={() => {
                          this.setState({ loading: true });
                          this.getEvent();
                        }}
                      >
                        {_.upperFirst(_.get(dictionnary, lang + ".validate"))}
                      </Button>
                    : null
                  }
                </div>
              </div>
          }
          
        </div>

        {/* Popup message */}
        <ModalMessage 
          open={this.state.modalMessage}
          title={_.upperFirst(_.get(dictionnary, lang + ".scan"))}
          type={_.isNull(this.state.errorStatus) ? "success" : "error"}
          message={this.state.message}
          onAction={() => {
            if (this.state.errorStatus === 401) {
              // déconnexion
              localStorage.setItem("jwt", "");
              window.location.reload();
            } else {
              this.setState({
                ticket: {},
                modalMessage: false,
                errorStatus: null,
                message: ""
              });
            }
          }}
        />
      </React.Fragment>
    )
  }
}