import React from "react";
import PropTypes from "prop-types";

import {
  Button,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography
} from "@material-ui/core";

import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";

import _ from "lodash";

import { dictionnary } from "../Langs/langs";

import { getAllCurrencies } from "../Helpers/Helpers";

export default class PriceEditor extends React.Component {
  static propTypes = {
    lang: PropTypes.string,
    price: PropTypes.object,
    onCancel: PropTypes.func,
    onChange: PropTypes.func
  };

  static defaultProps = {
    lang: "fr",
    price: null
  };

  state = {
    type: _.get(this.props.price, "type", ""),
    values: _.get(this.props.price, "values", []),
    totalPlaces: _.get(this.props.price, "totalPlaces", 0),
    alreadyTakenPlaces: _.get(this.props.price, "alreadyTakenPlaces", 0),
    checkExceeding: _.get(this.props.price, "checkExceeding", false)
  };

  /*validationPrices = prices => {
    return false;
  }*/

  handleChangeNumber = number => {
    return _.isEmpty(number) ? 0 : Number(number);
  }

  getNonUsedCurrency = prices => {
    let currencies = getAllCurrencies();
    for (let i = 0; i < currencies.length; i++) {
      let index = _.findIndex(prices, price => 
        currencies[i].currency === price.currency
      );
      if (index === -1) {
        return currencies[i];
      }
    }
    return {};
  }

  render() {
    let lang = _.toUpper(this.props.lang);
    //console.log(this.props.price);
    console.log(this.state.alreadyTakenPlaces);
    return(
      <React.Fragment>
        <Container maxWidth="md" style={{ marginBottom: "25px" }}>
          <Grid container={true} spacing={2}>
            <Grid item={true} xs={12} sm={4} md={4}>
              <TextField
                fullWidth={true}
                label={_.upperFirst(_.get(dictionnary, lang + ".priceType"))}
                variant="outlined"
                value={this.state.type}
                onChange={e => this.setState({ type: e.target.value })}
              />
            </Grid>
            <Grid item={true} xs={12} sm={4} md={4}>
              <TextField
                fullWidth={true}
                label={_.upperFirst(_.get(dictionnary, lang + ".totalPlaces"))}
                variant="outlined"
                type="number"
                value={parseInt(this.state.totalPlaces)}
                onChange={e => this.setState({ totalPlaces: e.target.value })}
              />
            </Grid>
            <Grid item={true} xs={12} sm={4} md={4}>
              <TextField
                fullWidth={true}
                label={_.upperFirst(_.get(dictionnary, lang + ".alreadyTakenPlaces"))}
                variant="outlined"
                type="number"
                value={this.state.alreadyTakenPlaces}
                onChange={e => this.setState({ alreadyTakenPlaces: e.target.value })}
              />
            </Grid>

            {/* currencies */}
            <Grid item={true} xs={12}>
              <Typography variant="h6" style={{ marginTop: "25px", marginBottom: "15px", textAlign: "center" }}>
                <strong>{_.upperFirst(_.get(dictionnary, lang + ".currencies"))}</strong>
              </Typography>
            </Grid>
            <Grid container={true} spacing={2}>
              {_.map(this.state.values, (value, index) =>
                <React.Fragment key={index}>
                  <Grid item={true} xs={6}>
                    <TextField
                      fullWidth={true}
                      label={_.upperFirst(_.get(dictionnary, lang + ".price"))}
                      variant="outlined"
                      type="number"
                      value={value.value}
                      onChange={e => {
                        let v = value;
                        v.value = e.target.value;
                        let values = this.state.values;
                        values[index] = v;
                        this.setState({ values: values });
                      }}
                    />
                  </Grid>

                  {/* select */}
                  <Grid item={true} xs={3}>
                    <FormControl variant="outlined">
                      <Select
                        style={{ minWidth: "90px" }}
                        value={value.currency}
                        onChange={e => {
                          let nonUsedCurrency = this.getNonUsedCurrency(this.state.values);
                          if (_.isEmpty(nonUsedCurrency)) {
                            return;
                          }
                          if (e.target.value === nonUsedCurrency.currency) {
                            let values = this.state.values;
                            let v = value;
                            v.currency = e.target.value;
                            values[index] = v;
                            this.setState({ values: values });
                          }
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
                      style={{ marginLeft: "8px" }}
                      onClick={() => {
                        let values = this.state.values;
                        values.splice(index, 1);
                        this.setState({ values: values });
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Grid>
                </React.Fragment>
              )}
            </Grid>

            {/* Button add devise */}
            <Grid item={true} xs={12} style={{ marginTop: "10px" }}>
              <span style={{ textAlign: "center" }}>
                <Typography variant="body1" gutterBottom={true}>
                  {_.upperFirst(_.get(dictionnary, lang + ".price"))}
                  <IconButton
                    style={{ marginLeft: "8px" }}
                    onClick={() => {
                      let obj = {};
                      let nonUsedCurrency = this.getNonUsedCurrency(this.state.values);
                      if (_.isEmpty(nonUsedCurrency)) {
                        return;
                      }
                      obj.currency = nonUsedCurrency.currency;
                      obj.value = 0;
                      let values = this.state.values;
                      values.push(obj);
                      this.setState({ values: values });
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Typography>
              </span>
            </Grid>

            {/* Autorisation dépassement */}
            <Grid item={true} xs={12}>
              <FormControlLabel 
                control={
                  <Switch 
                    checked={
                      _.isNull(this.state.checkExceeding)
                        ? false : this.state.checkExceeding
                    }
                    color="primary"
                    onChange={() => this.setState({ checkExceeding: !this.state.checkExceeding })}
                  />
                }
                label={_.upperFirst(_.get(dictionnary, lang + ".checkExceeding"))}
                labelPlacement="end"
                style={{ marginTop: "15px", marginBottom: "15px" }}
              />
            </Grid>

            {/* Buttons Annuler - Enregistrer - Modifier */}
            <Grid container={true} spacing={1}>
              <Grid item={true} xs={12} md={6}>
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
              <Grid item={true} xs={12} md={6}>
                <Button 
                  variant="contained"
                  fullWidth={true}
                  color="primary"
                  size="large"
                  onClick={() => {
                    if (this.props.onChange) {
                      if (this.state.checkExceeding) {
                        if (parseInt(this.state.totalPlaces) < parseInt(this.state.alreadyTakenPlaces)) {
                          return;
                        }
                      }
                      let obj = {};
                      obj.id = this.props.price.id ? this.props.price.id : null;
                      obj.checkExceeding = this.state.checkExceeding;
                      obj.alreadyTakenPlaces = this.state.alreadyTakenPlaces;
                      obj.totalPlaces = this.state.totalPlaces;
                      obj.type = this.state.type;
                      obj.values = this.state.values;

                      if (_.isEmpty(obj.values)) {
                        return;
                      }

                      this.props.onChange(obj);
                    }
                  }}
                >
                  {_.isEmpty(this.props.price)
                    ? _.upperFirst(_.get(dictionnary, lang + ".save"))
                    : _.upperFirst(_.get(dictionnary, lang + ".modify"))
                  }
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </React.Fragment>
    )
  }
}