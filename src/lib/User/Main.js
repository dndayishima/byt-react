import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import {
  AppBar,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem, 
  Toolbar, 
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { AccountCircle, Person, PowerSettingsNew } from "@material-ui/icons";
import _ from "lodash";

import {
  Switch,
  Route,
  useHistory,
  //useLocation,
  useRouteMatch
} from "react-router-dom";

import {
  About,
  //Administration,
  Code,
  MenuDrawer,
  Register,
  SettingsView,
  Scanner,
  Title,
  TicketsList
} from "../../lib";
import { Statistics } from "../Statistic";
import { Events } from "../Event";
import { dictionnary } from "../Langs/langs";

import bytWhite from "../../images/logo/byt-white.png";
import { signOut } from "../Helpers/Helpers";

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

const Main = props => {
  const [anchorEl, setAnchorEl] = useState(null);
  //const [errorType, setErrorType] = useState(null); // 1 : session expirée - 2 : connexion
  //const [errorTitle, setErrorTitle] = useState("");
  //const [errorMessage, setErrorMessage] = useState("");
  //const [page, setPage] = useState("events");
  const [openAccountMenu, setOpenAccountMenu] = useState(false);
  const [openDrawerMenu, setOpenDrawerMenu] = useState(false);
  const [eventsCache, setEventsCache] = useState([]); // gestion du cache des événements

  const { path } = useRouteMatch();
  const history = useHistory();

  useEffect(() => {
    //history.push("/plateform/events");
    if (history.location.pathname === "/") {
      history.push("/plateform/events");
    } else {
      history.push(history.location.pathname);
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lang = _.toUpper(props.lang);

  const menuAccount = (
    <Menu
      anchorEl={anchorEl}
      open={openAccountMenu}
      onClose={() => {
        setAnchorEl(null);
        setOpenAccountMenu(false);
      }}
    >
      {props.user
        ? <MenuItem
            onClick={() => {
              setAnchorEl(null);
              setOpenAccountMenu(false);
              history.push("/plateform/profile");
            }}
          >
            
            <ListItemIcon><Person /></ListItemIcon>
            <ListItemText
              primary={_.upperFirst(_.get(dictionnary, lang + ".profile"))}
            />
          </MenuItem>
        : null
      }
      {props.user
        ? <MenuItem onClick={() => signOut()}>
            <ListItemIcon><PowerSettingsNew /></ListItemIcon>
            <ListItemText
              primary={_.upperFirst(_.get(dictionnary, lang + ".signOut"))}
            />
          </MenuItem> 
        : null
      }
      {!props.user
        ? <MenuItem onClick={() => signOut()}>
            <ListItemIcon><Person /></ListItemIcon>
            <ListItemText
              primary={_.upperFirst(_.get(dictionnary, lang + ".signIn"))}
            />
          </MenuItem>
        : null
      }       
    </Menu>
  );

  return (
    <React.Fragment>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={() => setOpenDrawerMenu(true)}
          >
            <MenuIcon />
          </IconButton>
          <div style={{ marginTop: "4px", flexGrow: 1 }}>
            <img
              src={bytWhite} 
              height="33"
              width="auto"
              alt="logo"
              onClick={() => history.push("/plateform/events")}
            />
          </div>
          <div style={{ marginRight: "1%" }}>
            <IconButton
              edge="end"
              color="inherit"
              onClick={e => {
                setAnchorEl(e.currentTarget);
                setOpenAccountMenu(true);
              }}
            >
              <AccountCircle />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {menuAccount}

      {/* Barre de Menu qui s'ouvre à gauche */}
      <MenuDrawer
        lang={props.lang}
        open={openDrawerMenu}
        onClose={() => setOpenDrawerMenu(false)}
        onClickItem={item => {
          let moveToLink = () => {
            setOpenDrawerMenu(false);
            history.push(`${path}/${item}`);
          };
          if (_.includes(["events", "about"], item)) {
            moveToLink();
          } else if (_.isEmpty(props.user)) {
            signOut();
          } else {
            moveToLink()
          }
        }}
        roles={_.get(props.user, "roles", [])}
      />

      <Switch>       
        <Route path={`${path}/events`}>
          <div style={styles.container}>
            <React.Fragment>
              <Title 
                title={_.upperFirst(_.get(dictionnary, lang + ".events"))}
              />
              <Events
                client={props.client}
                jwt={props.jwt}
                user={props.user}
                lang={props.lang}
                onSignOut={() => signOut()}
                cache={eventsCache}
                onCacheReload={events => setEventsCache(events)}
              />
            </React.Fragment>
          </div>
        </Route>

        <Route path={`${path}/tickets`}>
          <div style={styles.container}>
            <React.Fragment>
              <Title 
                title={_.upperFirst(_.get(dictionnary, lang + ".tickets"))}
              />
              <TicketsList 
                client={props.client}
                user={props.user}
                jwt={props.jwt}
                lang={props.lang}
              />
            </React.Fragment>
          </div>
        </Route>

        <Route exact={true} path={`${path}/statistics`}>
          <div style={styles.container}>
            <React.Fragment>
              <Title 
                title={_.upperFirst(_.get(dictionnary, lang + ".statistics"))}
              />
              <Statistics 
                client={props.client}
                user={props.user}
                jwt={props.jwt}
                lang={props.lang}
                cache={eventsCache}
              />
            </React.Fragment>
          </div>
        </Route>

        <Route path={`${path}/statistics/:eventCode`}>
          <div style={styles.container}>
            <React.Fragment>
              <Title 
                title={_.upperFirst(_.get(dictionnary, lang + ".statistics"))}
              />
              <Statistics 
                client={props.client}
                user={props.user}
                jwt={props.jwt}
                lang={props.lang}
                cache={eventsCache}
              />
            </React.Fragment>
          </div>
        </Route>

        <Route path={`${path}/profile`}>
          <Register 
            client={props.client}
            lang={props.lang}
            edition={true}
            user={props.user}
            onCancel={() => history.push("/plateform/events")}
            onEdition={(jwt, user) => props.onRelogin(jwt, user)}
          />
        </Route>

        <Route path={`${path}/code`}>
          <div style={styles.container}>
            <React.Fragment>
              <Title 
                title={_.upperFirst(_.get(dictionnary, lang + ".code"))}
              />
              <Code 
                client={props.client}
                jwt={props.jwt}
                lang={props.lang}
                user={props.user}
                onSignOut={() => signOut()}
              />
            </React.Fragment>
          </div>
        </Route>

        <Route path={`${path}/scanner`}>
          <div style={styles.container}>
            <React.Fragment>
              <Title 
                title={_.upperFirst(_.get(dictionnary, lang + ".scan"))}
              />
              <Scanner
                client={props.client}
                jwt={props.jwt}
                lang={props.lang}
                user={props.user}
              />
            </React.Fragment>
          </div>
        </Route>

        <Route path={`${path}/settings`}>
          <div style={styles.container}>
            <Title 
              title={_.upperFirst(_.get(dictionnary, lang + ".settings"))}
            />
            <SettingsView
              lang={props.lang}
              onChangeLanguage={lang => {
                if (props.onChangeLanguage) {
                  props.onChangeLanguage(lang);
                }
              }}
            />
          </div>
        </Route>

        <Route path={`${path}/about`}>
          <About 
            lang={props.lang}
            logged={!_.isEmpty(props.user)}
          />
        </Route>

          {/* administration */}
          {/*{page === "administration"
            ? <React.Fragment>
                <Title 
                  title={_.upperFirst(_.get(dictionnary, lang + ".administration"))}
                />
                <Administration 
                  lang={props.lang}
                  client={props.client}
                  user={props.user}
                />
              </React.Fragment>
            : null
          }*/}
      </Switch>
    </React.Fragment>
  );
};

Main.propTypes = {
  client: PropTypes.any.isRequired,
  jwt: PropTypes.string,
  lang: PropTypes.string,
  onChangeLanguage: PropTypes.func,
  onRelogin: PropTypes.func,
  user: PropTypes.object
};

Main.defaultProps = {
  lang: "fr"
};

export default Main;