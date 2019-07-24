import React from "react";
import PropTypes from "prop-types";

import { FormControl, MenuItem, OutlinedInput, Select } from "@material-ui/core";

//import _ from "lodash";
//import { dictionnary } from "../Langs/langs";

export default class SettingsView extends React.Component {
  static propTypes = {
    lang: PropTypes.string,
    onChangeLanguage: PropTypes.func
    //client: PropTypes.any.isRequired,
    //onSuccess: PropTypes.func,
    //onError: PropTypes.func
  };
  static defaultProps = {
    lang: "fr"
  };

  state = {
    lang: this.props.lang
  };

  componentWillReceiveProps(next) {
    this.setState({ lang: next.lang });
  };

  
  render () {
    //let lang = _.toUpper(this.props.lang);
    //let language = _.get(dictionnary, lang + ".language");

    return (
      <React.Fragment>
        <FormControl variant="outlined" fullWidth={true}>
          <Select
            value={this.state.lang}
            onChange={e => {
              if (this.props.onChangeLanguage) {
                this.props.onChangeLanguage(e.target.value);
              }
            }}
            input={<OutlinedInput/>}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="fr">Français</MenuItem>
            <MenuItem value="ki">Kirundi</MenuItem>
          </Select>
        </FormControl>
      </React.Fragment>
    )
  }
}