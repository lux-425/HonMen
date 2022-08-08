import React, { useState, useEffect } from 'react';

import {
  List,
  Divider,
  Message,
  Checkbox,
  Form,
  Button,
} from 'semantic-ui-react';

import { passwordUpdate, toggleMessagePopup } from '../../utils/profileActions';

function Settings({ newMessagePopup }) {
  const [passwordFields, showPasswordFields] = useState(false);
 
  const [newMessageSettings, showNewMessageSettings] = useState(false);

  const [popupSetting, setPopupSetting] = useState(newMessagePopup);

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    success && setTimeout(() => setSuccess(false), 3000);
  }, [success]); // 再大事

  return (
    <>
      {success && (
        <>
          <Message
            success
            icon='check circle'
            header='Settings was updated successfully!'
            color='teal'
          />
          <Divider hidden />
        </>
      )}

      <List size='huge' animated>
        <List.Item>
          <List.Icon name='user secret' color='blue' size='large' verticalAlign='middle' />
          <List.Content>
            <List.Header
              onClick={() => showPasswordFields(!passwordFields)}
              as='a'
              content='Update password'
            />
          </List.Content>

          {passwordFields && (
            <UpdatePassword
              setSuccess={setSuccess}
              showPasswordFields={showPasswordFields}
            />
          )}
        </List.Item>
        <Divider />

        <List.Item>
          <List.Icon
            name='paper plane outline'
            size='large'
            verticalAlign='middle'
            color='blue'
          />

          <List.Content>
            <List.Header
              onClick={() => showNewMessageSettings(!newMessageSettings)}
              as='a'
              content='Show new message popup?'
            />
          </List.Content>

          <div style={{ marginTop: '10px' }}>
            Control whether a popup should appear or not when you receive a new
            message.
            <br />
            <br />
            <Checkbox
              checked={popupSetting}
              toggle
              onChange={() => toggleMessagePopup(setPopupSetting, setSuccess)}
            />
          </div>
        </List.Item>

        <Divider />
      </List>
    </>
  );
}

const UpdatePassword = ({ setSuccess, showPasswordFields }) => {
  const [loading, setLoading] = useState(false);

  const [errorMsg, setError] = useState(null);

  const [userPasswords, setUserPasswords] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [typed, showTyped] = useState({
    field1: false,
    field2: false,
  });

  const { field1, field2 } = typed;

  const { currentPassword, newPassword } = userPasswords;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserPasswords((prev) => ({ ...prev, [name]: value })); // 再大切
  };

  useEffect(() => {
    errorMsg && setTimeout(() => setError(null), 5000);
  }, [errorMsg]);

  return (
    <>
      <Form
        error={errorMsg !== null}
        loading={loading}
        onSubmit={async (e) => {
          e.preventDefault();

          setLoading(true);
          await passwordUpdate(setSuccess, userPasswords);
          setLoading(false);

          showPasswordFields(false);
        }}
      >
        <List.List>
          <List.Item>
            <Form.Input
              fluid
              icon={{
                name: 'eye',
                circular: true,
                link: true,
                onClick: () =>
                  showTyped((prev) => ({ ...prev, field1: !field1 })), // 大切
              }}
              type={field1 ? 'text' : 'password'}
              iconPosition='left'
              label='Current password'
              placeholder='Enter your current password'
              name='currentPassword'
              onChange={handleChange}
              value={currentPassword}
            />

            <Form.Input
              fluid
              icon={{
                name: 'eye',
                circular: true,
                link: true,
                onClick: () =>
                  showTyped((prev) => ({ ...prev, field2: !field2 })),
              }}
              type={field2 ? 'text' : 'password'}
              iconPosition='left'
              label='New password'
              placeholder='Enter your new password'
              name='newPassword'
              onChange={handleChange}
              value={newPassword}
            />

            {/* BUTTONS */}

            <Button
              disabled={loading || currentPassword === '' || newPassword === ''}
              compact
              icon='configure'
              type='submit'
              color='teal'
              content='Confirm'
            />

            <Button
              disabled={loading}
              compact
              icon='cancel'
              type='button'
              content='Cancel'
              onClick={() => showPasswordFields(false)}
            />

            <Message
              icon='info'
              error
              header='An error occurred.'
              content={errorMsg}
            />
          </List.Item>
        </List.List>
      </Form>
      <Divider hidden />
    </>
  );
};

export default Settings;
