import React from "react";
import PropTypes from "prop-types";

import {
  Button,
  Divider, 
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography
} from "@material-ui/core";

import _ from "lodash";

import { ModalMessage } from "../../lib";

import { dictionnary } from "../Langs/langs";

export default class BuyTicket extends React.Component {
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