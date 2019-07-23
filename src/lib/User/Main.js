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

import MenuIcon from "@material-ui/icons/Menu";
import { AccountCircle, Person, PowerSettingsNew } from "@material-ui/icons";

import { ModalMessage } from "../../lib";

import _ from "lodash";

import { MenuDrawer } from "../../lib";
import { dictionnary } from "../Langs/langs";
import { getJWTPayload } from "../Helpers/Helpers";


export default class Main extends React.Component {
  static propTypes = {
    client: PropTypes.any.isRequired,
    jwt: PropTypes.string,
    lang: PropTypes.string
  };
  static defaultProps = {
    lang: "fr"
  };

  state = {
    anchorEl: null,
    errorType: null, // 1 : session expirée - 2 : connexion
    errorTitle: "",
    errorMessage: "",
    page: "allEvents",
    openAccountMenu: false,
    openDrawerMenu: false,
    user: {},
    eventsObj: {} // events + informations of pagination
  };

  componentDidMount() {
    this.setState({ user: getJWTPayload(this.props.jwt).data });
    this.props.client.Event.readAll(
      this.props.jwt,
      {},
      result => {
        console.log(result);
        this.setState({ eventsObj: result.data });
      },
      error => {
        let lang = _.toUpper(this.props.lang);
        if (_.isUndefined(error)) {
          this.setState({
            errorType: 2,
            errorTitle: _.upperFirst(_.get(dictionnary, lang + ".authentication")),
            errorMessage: _.upperFirst(_.get(dictionnary, lang + ".errorMessageNetwork"))
          });
        } else {
          this.setState({
            errorType: 1,
            errorTitle: _.upperFirst(_.get(dictionnary, lang + ".authentication")),
            errorMessage: _.upperFirst(_.get(dictionnary, lang + ".errorMessageAuthentication"))
          });
        }
        //console.log(error);
      }
    )
  };

  signOut = () => {
    localStorage.setItem("jwt", "");
    window.location.reload();
  };

  render() {
    console.log(this.state.user);
    let lang = _.toUpper(this.props.lang);
    const menuAccount = (
      <Menu
        anchorEl={this.state.anchorEl}
        open={this.state.openAccountMenu}
        onClose={() => this.setState({ anchorEl: null, openAccountMenu: false })}
      >
        <MenuItem>
          <ListItemIcon><Person /></ListItemIcon>
          <ListItemText
            primary={_.upperFirst(_.get(dictionnary, lang + ".profile"))}
          />
        </MenuItem>
        <MenuItem onClick={this.signOut}>
          <ListItemIcon><PowerSettingsNew /></ListItemIcon>
          <ListItemText
            primary={_.upperFirst(_.get(dictionnary, lang + ".signOut"))}
          />
        </MenuItem>
      </Menu>
    );
    return (
      <React.Fragment>
        <AppBar position="sticky">
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={() => this.setState({ openDrawerMenu: true })}
            >
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
        {!_.isEmpty(this.state.user)
          ? <MenuDrawer 
              open={this.state.openDrawerMenu}
              onClose={() => this.setState({ openDrawerMenu: false })}
              roles={this.state.user.roles}
            />
          : null
        }
        
        {/* Modal Session expired */}
        <ModalMessage 
          open={!_.isNull(this.state.errorType)}
          title={this.state.errorTitle}
          message={this.state.errorMessage}
          type="error"
          onAction={this.signOut}
        />

        {/* Events List */}
        {(this.state.page === "allEvents" && !_.isEmpty(this.state.eventsObj))
          ? null // ici l'event list en lui passant en paramètres les events et les infos
          : null
        }

        {/* Mettre ici autre chose */}
      </React.Fragment>
    );
  }
}