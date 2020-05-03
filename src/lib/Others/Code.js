import React, { useState, useEffect } from "react";
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
import { useHistory } from "react-router-dom";
import CodeSearch from "./CodeSearch";
import { dictionnary } from "../Langs/langs";
import {
  getAllCurrencies,
  priceValuePrinting,
  userIsAdmin,
  userIsTech
} from "../Helpers/Helpers";

const stylesss = {
  cardHeader: {
    backgroundColor: "#EEEEEE"
  }
};

const Code = props => {
  const [code, setCode] = useState("");
  const [price, setPrice] = useState(0);
  const [currency, setCurrency] = useState("");
  const [tab, setTab] = useState("add");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorType, setErrorType] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const history = useHistory();

  useEffect(() => {
    if (
      !userIsTech(props.user.roles) &&
      !userIsAdmin(props.user.roles)
    ) {
      history.push("/plateform/events");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateCode = () => {
    if (_.isEmpty(price) || _.isEmpty(currency)) {
      return;
    }
    props.client.Code.create(
      props.jwt,
      { value: price, currency: currency },
      result => {
        //console.log(result);
        setCode(result.data.code.code);
        setMessageType("success");
        setDialogOpen(true);
      },
      error => {
        //console.log(error);
        let lang = _.toUpper(props.lang);
        if (_.isUndefined(error)) {
          setCode("");
          setErrorMessage(_.upperFirst(_.get(dictionnary, lang + ".errorMessageNetwork")));
          setErrorType(1);
          setMessageType("error");
          setDialogOpen(true);
        } else if (error.status === 401) {
          setCode("");
          setErrorMessage(_.upperFirst(_.get(dictionnary, lang + ".errorMessageAuthentication")));
          setErrorType(2);
          setMessageType("error");
          setDialogOpen(true);
        } else {
          setCode("");
          setErrorMessage(_.upperFirst(_.get(dictionnary, lang + ".errorMessageCodeGeneration")));
          setErrorType(3);
          setMessageType("error");
          setDialogOpen(true);
        }
      }
    );
  };

  const lang = _.toUpper(props.lang);

  const create = (
    <Grid container={true} spacing={2} justify="center">
      <Grid item={true} xs={6}>
        <TextField 
          fullWidth={true}
          label={_.upperFirst(_.get(dictionnary, lang + ".price"))}
          variant="outlined"
          type="number"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />
      </Grid>

      <Grid item={true} xs={3}>
        <FormControl variant="outlined">
          <Select
            style={{ minWidth: "90px" }}
            value={currency}
            onChange={e => setCurrency(e.target.value)}
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
          onClick={() => generateCode()}
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
            value={tab}
            onChange={(e, tab) => setTab(tab)}
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
        {tab === "add"
          ? create
          : <CodeSearch 
              client={props.client}
              jwt={props.jwt}
              lang={props.lang}
              user={props.user}
              onSignOut={() => {
                if (props.onSignOut) {
                  props.onSignOut();
                }
              }}
            />
        }
      </Container>

      <Dialog open={dialogOpen} fullWidth={true}>
        <MuiDialogTitle disableTypography={true}>
          <Typography
            variant="h6"
            color={messageType === "success" ? "primary" : "error"}
          >
            {_.upperFirst(_.get(dictionnary, lang + ".code"))}
          </Typography>
        </MuiDialogTitle>
        <DialogContent>
          {messageType === "success"
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
                        {priceValuePrinting(price, lang) + " " + currency}
                      </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item={true} xs={12}>
                    <Card>
                      <CardContent style={{ textAlign: "center" }}>
                        <Typography variant="body1" color="textSecondary">
                          {code}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </React.Fragment>
            : errorMessage
          }
        </DialogContent>
        <DialogActions>
          <Button
            color={messageType === "success" ? "primary" : "default" }
            onClick={() => {
              if (errorType === 2) {
                // déconnexion
                if (props.onSignOut) {
                  props.onSignOut();
                }
              } else {
                setErrorMessage("");
                setErrorType(null);
                setCode("");
                setMessageType(null);
                setDialogOpen(false);
              }
            }}
          >
            <strong> OK </strong>
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

Code.propTypes = {
  client: PropTypes.any.isRequired,
  jwt: PropTypes.string,
  lang: PropTypes.string,
  user: PropTypes.object,
  onSignOut: PropTypes.func
};

Code.defaultProps = {
  lang: "fr"
};

export default Code;