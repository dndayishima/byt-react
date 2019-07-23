import React from "react";
import PropTypes from "prop-types";

import {
  AppBar,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem, 
  Toolbar,
  Typography 
} from "@material-ui/core";

//import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuIcon from "@material-ui/icons/Menu";
import { AccountCircle, Person, PowerSettingsNew } from "@material-ui/icons";

import { MenuDrawer } from "../../lib";
//import { dictionnary } from "../Langs/langs";


export default class Main extends React.Component {
  static propTypes = {
    client: PropTypes.any.isRequired,
    lang: PropTypes.string
  };
  static defaultProps = {
    lang: "fr"
  };

  state = {
    anchorEl: null,
    page: "allEvents",
    openAccountMenu: false
  };

  componentDidMount() {
    let jwt = localStorage.getItem("jwt");
    this.props.client.Event.readAll(
      jwt,
      {name:"t"},
      result => {
        console.log(result);
      },
      error => {
        console.log(error);
      }
    )
  };

  render() {
    const menuAccount = (
      <Menu
        anchorEl={this.state.anchorEl}
        open={this.state.openAccountMenu}
        onClose={() => this.setState({ anchorEl: null, openAccountMenu: false })}
      >
        <MenuItem>
          <ListItemIcon><Person /></ListItemIcon>
          <ListItemText primary="Profile"/>
        </MenuItem>
        <MenuItem>
          <ListItemIcon><PowerSettingsNew /></ListItemIcon>
          <ListItemText primary="Déconnexion"/>
        </MenuItem>
      </Menu>
    );
    return (
      <React.Fragment>
        <AppBar position="sticky">
          <Toolbar>
            <IconButton color="inherit">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Buy Your Ticket
            </Typography>
            <div style={{ marginRight: "1%" }}>
              <IconButton
                edge="end"
                color="inherit"
                onClick={e => this.setState({ anchorEl: e.currentTarget, openAccountMenu: true })}
              >
                <AccountCircle />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {menuAccount}
        
        {/* Barre de Menu qui s'ouvre à gauche */}
        <MenuDrawer 
          open={true}
        />
      </React.Fragment>
    );
  }
}