import React from "react";
import PropTypes from "prop-types";

import {
  Container,
  Grid,
  Link,
  Typography
} from "@material-ui/core";

import {
  Title
} from "../../lib";

import { dictionnary } from "../Langs/langs";

import _ from "lodash";

import teamIcon from "../../images/others/team_icon.png";
import ticketsIcon from "../../images/others/tickets_icon.png";
import afriqueIcon from "../../images/others/afrique_icon.png";
import burundiIcon from "../../images/others/burundi_icon.png";
import contactIcon from "../../images/others/contact_icon.png";

const About = ({ lang }) => {

  const bytLink = (
    <Link
      href="https://www.bytpayment.com"
      variant="body2"
      target="_blank"
      rel="noreferrer"
    >
      BYT - Payment
    </Link>
  );

  const xinaproLink = (
    <Link
      //href="https://www.bytpayment.com"
      href="#"
      variant="body2"
      target="_blank"
      rel="noreferrer"
    >
      XINAPRO
    </Link>
  );

  const contactLink = (
    <Link
      href="#contact"
      variant="body2"
    >
      {lang === "fr"
        ? "contacter"
        : lang === "en"
          ? "contact"
          : lang === "ki"
            ? "kuturondera"
            : ""
      }
    </Link>
  );

  const contactBlock = (
    <Grid item={true} xs={12} md={9}>
      <Typography
        color="textPrimary"
        variant="body1"
        gutterBottom={true}
      >
        <strong>
          {lang === "fr" || lang === "en"
            ? "Contacts"
            : lang === "ki"
              ? "Kuturondera"
              : null
          }
        </strong>
      </Typography>

      <Typography
        color="textSecondary"
        variant="body2"
      >
        <strong>
          {lang === "fr"
            ? "Responsable Marketing et Relations Clients"
            : lang === "en"
              ? "Marketing and Customer Relations Manager"
              : lang === "ki"
                ? "Uwujejwe imigenderanire n'aba clients"
                : null
          }
        </strong>
      </Typography>
      <Typography
        color="textSecondary"
        variant="body2"
        gutterBottom={true}
      >
        Rodrigue NIHOREHO (
        <Link
          href="mailto:rodrigue.nihoreho@xinapro.com"
          variant="body2"
        >
          rodrigue.nihoreho@xinapro.com
        </Link>)
      </Typography>

      <Typography
        color="textSecondary"
        variant="body2"
      >
        <strong>
          {lang === "fr"
            ? "Entreprise XINAPRO"
            : "XINAPRO Company"
          }
        </strong>
      </Typography>
      <Typography
        color="textSecondary"
        variant="body2"
      >
        XINAPRO (
        <Link
          href="mailto:contact@xinapro.com"
          variant="body2"
        >
          contact@xinapro.com
        </Link>)
      </Typography>
    </Grid>
  );

  const whoFR = (
    <React.Fragment>
      <Grid item={true} xs={12} md={9}>
        <Typography
          color="textPrimary"
          variant="body1"
          gutterBottom={true}
        >
          <strong>Qui sommes-nous ?</strong>
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
        >
          La plateforme {bytLink} est dévéloppée et maintenue par les équipes de la société {xinaproLink}, 
          une entreprise d'édition de logiciels basée à Bujumbura, la capitale économique du Burundi.
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
          gutterBottom={true}
        >
          Notre quotidien c'est de proposer des produits/solutions à forte rentabilité pour nos clients (burundais ou étrangers).
        </Typography>

        <Typography
          color="textSecondary"
          variant="body2"
          gutterBottom={true}
        >
          N'hésitez pas à nous {contactLink} pour en savoir plus sur nous et nos prestations.
        </Typography>
      </Grid>
    </React.Fragment>
  );

  const whoEN = (
    <React.Fragment>
      <Grid item={true} xs={12} md={9}>
        <Typography
          color="textPrimary"
          variant="body1"
          gutterBottom={true}
        >
          <strong>Who Are We</strong>
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
          //gutterBottom={true}
        >
          The {bytLink} is a plateform developed and maintained by {xinaproLink}, 
          a software publisher based in Bujumbura, the economic capital of Burundi.
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
          gutterBottom={true}
        >
          We offer products/solutions with high profitability for our customers (Burundians or foreigners).
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
          gutterBottom={true}
        >
          Please, {contactLink} us to find out more about our services.
        </Typography>
      </Grid>
    </React.Fragment>
  );

  const whoKI = (
    <React.Fragment>
      <Grid item={true} xs={12} md={9}>
        <Typography
          color="textPrimary"
          variant="body1"
          gutterBottom={true}
        >
          <strong>Turi bande ?</strong>
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
          //gutterBottom={true}
        >
          No translation available in this language
        </Typography>
      </Grid>
    </React.Fragment>
  );

  const practicalFR = (
    <React.Fragment>
      <Grid item={true} xs={12} md={9}>
        <Typography
          color="textPrimary"
          variant="body1"
          gutterBottom={true}
        >
          <strong>BYT - Payment en pratique...</strong>
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
          gutterBottom={true}
        >
          {bytLink} est une billetterie mise à votre disposition pour vous offrir 
          des services d'achats et ventes (en ligne) des tickets pour l'événementiel.&nbsp;
          {bytLink} est la première plateforme, dans la région des Grands-Lacs, qui offre une large gamme de fonctionnalités 
          facilitant ainsi la gestion des événements (pour les organisateurs) et 
          l'acquisition des tickets (pour les acheteurs).
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
        >
          N'hésitez pas à nous {contactLink} si vous voulez une autorisation de publication 
          d'événements sur cette plateforme.
        </Typography>
      </Grid>
    </React.Fragment>
  );

  const practicalEN = (
    <React.Fragment>
      <Grid item={true} xs={12} md={9}>
        <Typography
          color="textPrimary"
          variant="body1"
          gutterBottom={true}
        >
          <strong>BYT - How it works...</strong>
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
          //gutterBottom={true}
        >
          {bytLink} is an online ticketing system that facilitates the sale 
          and purchase of tickets for various events.
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
          gutterBottom={true}
        >
          {bytLink} is the first plateform in the Great Lakes region to offer a wide range 
          of fuctionalities, making it easier to manage events (for event organizers) and 
          acquire tickets (for buyers/clients).
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
          gutterBottom={true}
        >
          Interested in publishing on our plateform ? Do not hesitate to {contactLink} us.
        </Typography>
      </Grid>
    </React.Fragment>
  );

  const practicalKI = (
    <React.Fragment>
      <Grid item={true} xs={12} md={9}>
        <Typography
          color="textPrimary"
          variant="body1"
          gutterBottom={true}
        >
          <strong>Ivyerekeye BYT - Payment...</strong>
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
          //gutterBottom={true}
        >
          No translation available in this language
        </Typography>
      </Grid>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <Container maxWidth="md">
        <Grid container={true}>
          <Grid item={true} xs={12} style={{ textAlign: "center" }}>
            <Title 
              title={_.upperFirst(_.get(dictionnary, _.toUpper(lang) + ".about"))}
            />
          </Grid>
        </Grid>

        {/* qui sommes-nous */}
        <Grid container={true} spacing={1} style={{ marginBottom: "20px" }}>
          <Grid item={true} xs={12} md={3} style={{ textAlign: "center" }}>
            <img 
              src={teamIcon}
              alt="team icon"
            />
          </Grid>
          {lang === "fr"
            ? whoFR
            : lang === "en"
              ? whoEN
              : lang === "ki"
                ? whoKI
                : null
          }
        </Grid>

        {/* problématique des tickets */}
        <Grid container={true} spacing={1} style={{ marginBottom: "20px" }}>
          <Grid item={true} xs={12} md={3} style={{ textAlign: "center" }}>
            <img
              src={ticketsIcon}
              alt="tickets icon"
            />
          </Grid>
          {lang === "fr"
            ? practicalFR
            : lang === "en"
              ? practicalEN
              : lang === "ki"
                ? practicalKI
                : null
          }
        </Grid>

        {/* Bloc contacts */}
        <Grid container={true} spacing={1} style={{ marginBottom: "20px" }} id="contact">
          <Grid item={true} xs={12} md={3} style={{ textAlign: "center" }}>
            <img 
              src={contactIcon}
              alt="contacts"
            />
          </Grid>
          {contactBlock}
        </Grid>

        {/* flags (drapeaux) */}
        <Grid container={true} spacing={1} style={{ marginTop: "40px", marginBottom: "25px" }}>
          <Grid item={true} xs={12} style={{ textAlign: "center" }}>
            <img
              src={burundiIcon}
              alt="burundi icon"
            />
            <img
              src={afriqueIcon}
              alt="afrique icon"
            />
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  )
}

About.propTypes = {
  lang: PropTypes.string
}

About.defaultProps = {
  lang: "fr"
}

export default About;