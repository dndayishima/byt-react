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

import {
  Administration,
  BuyTicket,
  Code,
  Events,
  MenuDrawer,
  Register,
  SettingsView,
  Scanner,
  Title,
  TicketsList
} from "../../lib";
import { dictionnary } from "../Langs/langs";

//import minimized from "../../minimized_brand.png";
import bytWhite from "../../byt-white.png";

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
    onChangeLanguage: PropTypes.func,
    user: PropTypes.object
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
    selectedEvent: {}
  };

  signOut = () => {
    localStorage.setItem("jwt", "");
    localStorage.setItem("userCode", "");
    // ici il faudra gérer le changement d'URL si besoin
    window.location.reload();
  };

  render() {
    let lang = _.toUpper(this.props.lang);
    console.log(this.props.user);
    const menuAccount = (
      <Menu
        anchorEl={this.state.anchorEl}
        open={this.state.openAccountMenu}
        onClose={() => this.setState({ anchorEl: null, openAccountMenu: false })}
      >
        <MenuItem
          onClick={() => {
            this.setState({
              page: "profile",
              anchorEl: null,
              openAccountMenu: false
            });
          }}
        >
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
            <div style={{ marginTop: "4px", flexGrow: 1 }}>
              <img
                src={bytWhite} 
                height="33"
                width="auto"
                alt="logo"
                onClick={() => this.setState({ page: "events" })}
              />
            </div>
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
        {!_.isEmpty(this.props.user)
          ? <MenuDrawer
              lang={this.props.lang}
              open={this.state.openDrawerMenu}
              onClose={() => this.setState({ openDrawerMenu: false })}
              onClickItem={item => {
                this.setState({ 
                  page: item, 
                  openDrawerMenu: false,
                  selectedEvent: {}
                });
              }}
              roles={this.props.user.roles}
            />
          : null
        }

        <div style={styles.container}>
          {/* Events List */}
          {(this.state.page === "events" && !_.isEmpty(this.props.user))
            ? <div>
                <Title 
                  title={_.upperFirst(_.get(dictionnary, lang + ".events"))}
                />
                <Events
                  client={this.props.client}
                  jwt={this.props.jwt}
                  user={this.props.user}
                  lang={this.props.lang}
                  onSignOut={this.signOut}
                  onSelection={event => {
                    this.setState({
                      page: "buyticket",
                      selectedEvent: event
                    });
                  }}
                />
              </div>
            : null
          }

          {/* Tickets */}
          {(this.state.page === "tickets" && !_.isEmpty(this.state.user))
            ? <div>
                <Title 
                  title={_.upperFirst(_.get(dictionnary, lang + ".tickets"))}
                />
                {/*<TicketsList 
                  client={this.props.client}
                  user={this.state.user}
                  jwt={this.props.jwt}
                  lang={this.props.lang}
                  onError={() => this.setState({ page: "events" })}
                />*/}
              </div>
            : null
          }

          {/* Code */}
          {(this.state.page === "code" && !_.isEmpty(this.state.user))
            ? <div>
                <Title 
                  title={_.upperFirst(_.get(dictionnary, lang + ".code"))}
                />
                <Code 
                  client={this.props.client}
                  jwt={this.props.jwt}
                  lang={this.props.lang}
                />
              </div>
            : null
          }

          {/* Achat d'un ticket */}
          {this.state.page === "buyticket"
            ? <div>
                <Title 
                  title={_.upperFirst(_.get(dictionnary, lang + ".buyTicket"))}
                />
                {/*<BuyTicket
                  client={this.props.client}
                  jwt={this.props.jwt}
                  lang={this.props.lang}
                  event={this.state.selectedEvent}
                  user={this.state.user}
                />*/}
              </div>
            : null
          }

          {/* Scan de tickets */}
          {this.state.page === "scan" && !_.isEmpty(this.state.user)
            ? <div>
                <Title 
                  title={_.upperFirst(_.get(dictionnary, lang + ".scan"))}
                />
                <Scanner
                  client={this.props.client}
                  jwt={this.props.jwt}
                  lang={this.props.lang}
                  user={this.state.user}
                />
              </div>
            : null
          }

          {/* administration */}
          {this.state.page === "administration"
            ? <div>
                <Title 
                  title={_.upperFirst(_.get(dictionnary, lang + ".administration"))}
                />
                <Administration 
                  lang={this.props.lang}
                  client={this.props.client}
                  user={this.state.user}
                />
              </div>
            : null
          }

          {/* profile */}
          {this.state.page === "profile"
            ? <Register 
                client={this.props.client}
                lang={this.props.lang}
                edition={true}
                user={this.props.user}
                onCancel={() => this.setState({ page: "events" })}
              />
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