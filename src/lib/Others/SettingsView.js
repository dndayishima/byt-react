import React from "react";
import PropTypes from "prop-types";

import {
  FormControl,
  MenuItem,
  OutlinedInput,
  Select
} from "@material-ui/core";

export default class SettingsView extends React.Component {
  static propTypes = {
    lang: PropTypes.string,
    onChangeLanguage: PropTypes.func
  };
  static defaultProps = {
    lang: "fr"
  };

  state = {
    lang: this.props.lang
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.lang !== this.props.lang) {
      this.setState({ lang: this.props.lang });
    }
  };

  
  render () {
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