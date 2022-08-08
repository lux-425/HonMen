import React, { useEffect, useState } from 'react';

import { Form, Button, Message, Segment } from 'semantic-ui-react';

import baseUrl from '../../utils/baseUrl';
import catchErrors from '../../utils/catchErrors';

import axios from 'axios';

function ResetPage() {
  const [email, setEmail] = useState('');
  const [emailChecked, setEmailChecked] = useState(false);

  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const resetPassword = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await axios.post(`${baseUrl}/api/reset`, { email });

      setEmailChecked(true);
    } catch (error) {
      setErrorMsg(catchErrors(error));
    }

    setLoading(false);
  };

  useEffect(() => {
    errorMsg !== null && setTimeout(() => setErrorMsg(null), 5000);
  }, [errorMsg]);

  return (
    <>
      {emailChecked ? (
        <Message
          attached
          icon="mail"
          header="Check your inbox"
          content="Please check your inbox for further instructions."
          success
        />
      ) : (
        <Message
          attached
          icon="settings"
          header="Reset password"
          color="teal"
        />
      )}

      <Form
        loading={loading}
        onSubmit={resetPassword}
        error={errorMsg !== null}
      >
        <Message error header="An error occurred." content={errorMsg} />

        <Segment>
          <Form.Input
            fluid
            icon="mail outline"
            type="email"
            iconPosition="left"
            label="Email"
            placeholder="Enter email address"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />

          <Button
            disabled={loading || email.length === 0}
            icon="configure"
            type="submit"
            color="orange"
            content="Submit"
          />
        </Segment>
      </Form>
    </>
  );
}

export default ResetPage;
