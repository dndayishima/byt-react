import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';

import { Client, Connexion, Register } from "../lib";

const client = new Client("http://localhost:8000", "");

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Button', module)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>
      <span role="img" aria-label="so cool">
        😀 😎 👍 💯
      </span>
    </Button>
  ));

storiesOf("User", module)
  .add("Connexion", () =>
    <Connexion
      client={client}
      onSuccess={action("succès de la connexion")}
      onError={action("Erreur de la connexion")}
    />)
  .add("Register", () =>
    <Register 
      client={client}
    />
  );