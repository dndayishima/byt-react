import React, { useState } from "react";
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

const PriceEditor = props => {
  const [type, setType] = useState(_.get(props.price, "type", ""));
  const [values, setValues] = useState(_.get(props.price, "values", []));
  const [totalPlaces, setTotalPlaces] = useState(_.get(props.price, "totalPlaces", 0));
  const [alreadyTakenPlaces, setAlreadyTakenPlaces] = useState(_.get(props.price, "alreadyTakenPlaces", 0));
  const [checkExceeding, setCheckExceeding] = useState(_.get(props.price, "checkExceeding", false));

  const handleChangeNumber = number => {
    return _.isEmpty(number) ? 0 : Number(number);
  }

  const getNonUsedCurrency = prices => {
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

  const lang = _.toUpper(props.lang);

  return(
    <React.Fragment>
      <Container maxWidth="md" style={{ marginBottom: "25px" }}>
        <Grid container={true} spacing={2}>
          <Grid item={true} xs={12} sm={4} md={4}>
            <TextField
              fullWidth={true}
              label={_.upperFirst(_.get(dictionnary, lang + ".priceType"))}
              variant="outlined"
              value={type}
              onChange={e => setType(e.target.value)}
            />
          </Grid>
          <Grid item={true} xs={12} sm={4} md={4}>
            <TextField
              fullWidth={true}
              label={_.upperFirst(_.get(dictionnary, lang + ".totalPlaces"))}
              variant="outlined"
              type="number"
              value={totalPlaces}
              onChange={e => setTotalPlaces(handleChangeNumber(e.target.value))}
            />
          </Grid>
          <Grid item={true} xs={12} sm={4} md={4}>
            <TextField
              fullWidth={true}
              label={_.upperFirst(_.get(dictionnary, lang + ".alreadyTakenPlaces"))}
              variant="outlined"
              type="number"
              value={alreadyTakenPlaces}
              onChange={e => setAlreadyTakenPlaces(handleChangeNumber(e.target.value))}
            />
          </Grid>

          {/* currencies */}
          <Grid item={true} xs={12}>
            <Typography variant="h6" style={{ marginTop: "25px", marginBottom: "15px", textAlign: "center" }}>
              <strong>{_.upperFirst(_.get(dictionnary, lang + ".currencies"))}</strong>
            </Typography>
          </Grid>
          <Grid container={true} spacing={2}>
            {_.map(values, (value, index) =>
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
                      let vs = _.cloneDeepWith(values);
                      vs[index] = v;
                      setValues(vs);
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
                        let nonUsedCurrency = getNonUsedCurrency(values);
                        if (_.isEmpty(nonUsedCurrency)) {
                          return;
                        }
                        if (e.target.value === nonUsedCurrency.currency) {
                          let vs = values;
                          let v = value;
                          v.currency = e.target.value;
                          vs[index] = v;
                          setValues(vs);
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
                      let vs = values;
                      vs.splice(index, 1);
                      setValues(vs);
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
                    let nonUsedCurrency = getNonUsedCurrency(values);
                    if (_.isEmpty(nonUsedCurrency)) {
                      return;
                    }
                    obj.currency = nonUsedCurrency.currency;
                    obj.value = 0;
                    let vs = _.cloneDeepWith(values);
                    vs.push(obj);
                    setValues(vs);
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
                    _.isNull(checkExceeding)
                      ? false : checkExceeding
                  }
                  color="primary"
                  onChange={() => setCheckExceeding(!checkExceeding)}
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
                  if (props.onCancel) {
                    props.onCancel();
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
                  if (props.onChange) {
                    if (checkExceeding) {
                      if (parseInt(totalPlaces) < parseInt(alreadyTakenPlaces)) {
                        return;
                      }
                    }
                    let obj = {};
                    obj.id = props.price.id ? props.price.id : null;
                    obj.checkExceeding = checkExceeding;
                    obj.alreadyTakenPlaces = alreadyTakenPlaces;
                    obj.totalPlaces = totalPlaces;
                    obj.type = type;
                    obj.values = values;

                    if (_.isEmpty(obj.values)) {
                      return;
                    }

                    props.onChange(obj);
                  }
                }}
              >
                {_.isEmpty(props.price)
                  ? _.upperFirst(_.get(dictionnary, lang + ".save"))
                  : _.upperFirst(_.get(dictionnary, lang + ".modify"))
                }
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
}

PriceEditor.propTypes = {
  lang: PropTypes.string,
  price: PropTypes.object,
  onCancel: PropTypes.func,
  onChange: PropTypes.func
};

PriceEditor.defaultProps = {
  lang: "fr",
  price: null
};

export default PriceEditor;