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
  //Typography 
} from "@material-ui/core";

import MenuIcon from "@material-ui/icons/Menu";
import { AccountCircle, Person, PowerSettingsNew } from "@material-ui/icons";

import _ from "lodash";

import { Events, MenuDrawer, ModalMessage, SettingsView, Title } from "../../lib";
import { dictionnary } from "../Langs/langs";
import { getJWTPayload } from "../Helpers/Helpers";

import minimized from "../../minimized_brand.png";

const styles = {
  container: {
    paddingTop: "20px",
    paddingLeft: "10px",
    paddingRight: "10px",
    margin: "0 auto",
    maxWidth: "1200px",
    display: "flex",
    flexDirection: "column",
    width: "Auto"
  }
};

export default class Main extends React.Component {
  static propTypes = {
    client: PropTypes.any.isRequired,
    jwt: PropTypes.string,
    lang: PropTypes.string,
    onChangeLanguage: PropTypes.func
  };
  static defaultProps = {
    lang: "fr"
  };

  state = {
    anchorEl: null,
    errorType: null, // 1 : session expirée - 2 : connexion
    errorTitle: "",
    errorMessage: "",
    page: "events",
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
            {/*<Typography variant="h4">
              B
            </Typography>*/}
            <div style={{ marginTop: "4px", flexGrow: 1 }}>
              <img src={minimized} height="33" width="auto" alt="logo"/>
            </div>
            {/*<Typography variant="h4" style={{ flexGrow: 1 }}>
              T
            </Typography>*/}
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
              lang={this.props.lang}
              open={this.state.openDrawerMenu}
              onClose={() => this.setState({ openDrawerMenu: false })}
              onClickItem={item => 
                this.setState({ 
                  page: item, 
                  openDrawerMenu: false
              })}
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

        <div style={styles.container}>
          {/* Events List */}
          {(this.state.page === "events" /*&& !_.isEmpty(this.state.eventsObj)*/)
            ? <div>
                <Title 
                  title={_.upperFirst(_.get(dictionnary, lang + ".events"))}
                />
                <Events />
              </div>
            : null
          }

          {/* Mettre ici autre chose */}
          {this.state.page === "settings"
            ? <div>
                <Title 
                  title={_.upperFirst(_.get(dictionnary, lang + ".settings"))}
                />
                <SettingsView
                  lang={this.props.lang}
                  onChangeLanguage={lang => {
                    if (this.props.onChangeLanguage) {
                      this.props.onChangeLanguage(lang);
                    }
                  }}
                />
              </div>
            : null
          }
        </div>
      </React.Fragment>
    );
  }
}