import React from "react";
import PropTypes from "prop-types";

import {
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Tabs,
  Tab,
  TextField,
  Typography,
  CardHeader
} from "@material-ui/core";

import {
  AddBox,
  SaveAlt,
  Search
} from "@material-ui/icons";

import MuiDialogTitle from "@material-ui/core/DialogTitle";

import _ from "lodash";

import { dictionnary } from "../Langs/langs";
import { getAllCurrencies, priceValuePrinting } from "../Helpers/Helpers";

const stylesss = {
  cardHeader: {
    backgroundColor: "#EEEEEE"
  }
}

export default class Code extends React.Component {
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
    code: "",
    price: 0,
    currency: "",
    tab: "add",
    errorMessage: "",
    errorType: null,
    messageType: null,
    dialogOpen: false
  };

  generateCode = () => {
    if (_.isEmpty(this.state.price) || _.isEmpty(this.state.currency)) {
      return;
    }
    this.props.client.Code.create(
      this.props.jwt,
      { value: this.state.price, currency: this.state.currency },
      result => {
        //console.log(result);
        this.setState({
          code: result.data.code.code,
          messageType: "success",
          dialogOpen: true
        });
      },
      error => {
        //console.log(error);
        let lang = _.toUpper(this.props.lang);
        if (_.isUndefined(error)) {
          this.setState({
            code: "",
            errorMessage: _.upperFirst(_.get(dictionnary, lang + ".errorMessageNetwork")),
            errorType: 1,
            messageType: "error",
            dialogOpen: true
          });
        } else if (error.status === 401) {
          this.setState({
            code: "",
            errorMessage: _.upperFirst(_.get(dictionnary, lang + ".errorMessageAuthentication")),
            errorType: 2,
            messageType: "error",
            dialogOpen: true
          });
        } else {
          this.setState({
            code: "",
            errorMessage: _.upperFirst(_.get(dictionnary, lang + ".errorMessageCodeGeneration")),
            errorType: 3,
            messageType: "error",
            dialogOpen: true
          });
        }
      }
    );
  };

  render () {
    let lang = _.toUpper(this.props.lang);

    const create = (
      <Grid container={true} spacing={2} justify="center">
        <Grid item={true} xs={6}>
          <TextField 
            fullWidth={true}
            label={_.upperFirst(_.get(dictionnary, lang + ".price"))}
            variant="outlined"
            type="number"
            value={this.state.price}
            onChange={e => this.setState({ price: e.target.value })}
          />
        </Grid>

        <Grid item={true} xs={3}>
          <FormControl variant="outlined">
            <Select
              style={{ minWidth: "90px" }}
              value={this.state.currency}
              onChange={e => {
                this.setState({ currency: e.target.value });
              }}
            >
              {_.map(getAllCurrencies(), (curr, index) =>
                <MenuItem
                  key={index}
                  value={curr.currency}
                >
                  {curr.currency}
                </MenuItem>
              )}
            </Select>
          </FormControl>
        </Grid>

        <Grid item={true} xs={3}>
          <IconButton
            style={{ marginLeft: "10px" }}
            onClick={() => this.generateCode()}
          >
            <strong>
            <SaveAlt 
              color="primary"
            />
            </strong>
          </IconButton>
        </Grid>
      </Grid>
    );

    return (
      <React.Fragment>
        <Container maxWidth="md">
          <Paper style={{ flexGrow: 1, marginBottom: "25px" }} elevation={0}>
            <Tabs
              value={this.state.tab}
              onChange={(e, tab) => this.setState({ tab: tab })}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab 
                label={
                  <AddBox />
                }
                value="add"
              />
              <Tab
                label={
                  <Search />
                }
                value="search"
              />
            </Tabs>
          </Paper>

          {/* contenu */}
          {this.state.tab === "add"
            ? create
            : null
          }
        </Container>

        <Dialog open={this.state.dialogOpen} fullWidth={true}>
          <MuiDialogTitle disableTypography={true}>
            <Typography
              variant="h6"
              color={this.state.messageType === "success" ? "primary" : "error"}
            >
              {_.upperFirst(_.get(dictionnary, lang + ".code"))}
            </Typography>
          </MuiDialogTitle>
          <DialogContent>
            {this.state.messageType === "success"
              ? <React.Fragment>
                  <Grid container={true} spacing={2}>
                    <Grid item={true} xs={12}>
                      <Card>
                        <CardHeader 
                          title={_.upperFirst(_.get(dictionnary, lang + ".price"))}
                          titleTypographyProps={{ align: "center" }}
                          style={stylesss.cardHeader}
                        />
                        <CardContent style={{ textAlign: "center" }}>
                        <Typography variant="body1" color="textSecondary">
                          {priceValuePrinting(this.state.price, lang) + " " + this.state.currency}
                        </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item={true} xs={12}>
                      <Card>
                        <CardContent style={{ textAlign: "center" }}>
                          <Typography variant="body1" color="textSecondary">
                            {this.state.code}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </React.Fragment>
              : this.state.errorMessage
            }
          </DialogContent>
          <DialogActions>
            <Button
              color={this.state.messageType === "success" ? "primary" : "default" }
              onClick={() => {
                if (this.state.errorType === 2) {
                  // déconnexion
                  localStorage.setItem("jwt", "");
                  localStorage.setItem("userCode", "");
                  window.location.reload();
                } else {
                  this.setState({
                    errorMessage: "",
                    errorType: null,
                    code: "",
                    messageType: null,
                    dialogOpen: false
                  });
                }
              }}
            >
              <strong> OK </strong>
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}