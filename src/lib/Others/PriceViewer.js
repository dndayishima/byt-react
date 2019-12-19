import React from "react";
import PropTypes from "prop-types";

import {
  Button,
  Card,
  CardActions,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from "@material-ui/core"

import { AddShoppingCart } from "@material-ui/icons";

import _ from "lodash";

import { getCurrencySymbol, priceValuePrinting } from "../Helpers/Helpers";
import { dictionnary } from "../Langs/langs";


const styles = {
  cardHeader: {
    backgroundColor: "#EEEEEE"
  },
  cardContent: {
    textAlign: "center"
  }
}
export default class PriceViewer extends React.Component {
  static propTypes = {
    lang: PropTypes.string,
    edition: PropTypes.bool,
    price: PropTypes.object,
    buy: PropTypes.bool,
    onClickBuy: PropTypes.func,
    onClickModification: PropTypes.func
  };

  static defaultProps = {
    lang: "fr"
  };

  state = {
    showAllCurrencies: false
  };

  render() {
    const principalPriceValue = (
      <Grid item={true} xs={8}>
        <Typography variant="h3" color="textPrimary">
          {priceValuePrinting(this.props.price.values[0].value, this.props.lang)}
        </Typography>
      </Grid>
    );

    const principalCurrencySymbol = (
      <Grid item={true} xs={4}>
        <Typography variant="h3" color="textPrimary">
          {getCurrencySymbol(this.props.price.values[0].currency)}  
        </Typography>
      </Grid>
    );

    let lang = _.toUpper(this.props.lang);
    return(
      <React.Fragment>
        <Card>
          <CardHeader 
            title={this.props.price.type}
            titleTypographyProps={{ align: "center" }}
            style={styles.cardHeader}
          />
          <CardContent style={styles.cardContent}>
            <Grid container={true} spacing={0}>
              {lang === "EN"
                ? <React.Fragment>
                    {principalCurrencySymbol}{principalPriceValue}
                  </React.Fragment>
                : <React.Fragment>
                    {principalPriceValue}{principalCurrencySymbol}
                  </React.Fragment>
              }
            </Grid>
            <Typography variant="subtitle1">
              {_.upperFirst(_.get(dictionnary, lang + ".totalPlaces"))}
              &nbsp;:&nbsp;{this.props.price.totalPlaces}
            </Typography>
            {this.props.edition
              ? <Typography variant="subtitle1">
                  {_.upperFirst(_.get(dictionnary, lang + ".alreadyTakenPlaces"))}
                  &nbsp;:&nbsp;{this.props.price.alreadyTakenPlaces}
                </Typography>
              : null
            }

            {/* Autres devises */}
            {this.state.showAllCurrencies
              ? <React.Fragment>
                  <Divider style={{ marginTop: "4px" }}/>
                  <Table size="small">
                    <TableBody>
                      {_.map(this.props.price.values, (value, index) => {
                        if (index === 0) {
                          return null;
                        }
                        return (
                          <TableRow key={index}>
                            <TableCell align="right">
                              {priceValuePrinting(value.value, this.props.lang)}
                            </TableCell>
                            <TableCell align="left">
                              {getCurrencySymbol(value.currency)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </React.Fragment>
              : null
            }
          </CardContent>

          <CardActions>
            <Grid container={true} spacing={1}>
              {this.props.price.values.length > 1
                ? <Grid item={true} xs={12}>
                    <Button
                      fullWidth={true}
                      variant="outlined"
                      onClick={() => {
                        this.setState({ showAllCurrencies: !this.state.showAllCurrencies })
                      }}
                    >
                      {_.upperFirst(_.get(dictionnary, lang + ".currencies"))}
                    </Button>
                  </Grid>
                : null
              }
              {this.props.edition
                ? <Grid item={true} xs={12}>
                    <Button
                      fullWidth={true}
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        if (this.props.onClickModification) {
                          this.props.onClickModification(this.props.price);
                        }
                      }}
                    >
                      {_.upperFirst(_.get(dictionnary, lang + ".modify"))}
                    </Button>
                  </Grid>
                : null
              }
              {this.props.buy
                ? <Grid item={true} xs={12}>
                    <Button
                      fullWidth={true}
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        // faire quelque chose ici
                        if (this.props.onClickBuy) {
                          this.props.onClickBuy(this.props.price);
                        }
                      }}
                    >
                      <AddShoppingCart />
                    </Button>
                  </Grid>
                : null
              }
            </Grid>
          </CardActions>
        </Card>
      </React.Fragment>
    )
  }
}