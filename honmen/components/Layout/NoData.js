import { Message, Button } from 'semantic-ui-react';

export const NoProfilePosts = () => (
  <>
    <Message
      info
      icon='info'
      header='Empty'
      color='teal'
      content='User has not posted anything yet!'
    />
    <Button
      icon='long arrow alternate left'
      content='Go back'
      color='teal'
      as='a'
      href='/'
    />
  </>
);

export const NoFollowData = ({ followersComponent, followingComponent }) => (
  <>
    {followersComponent && (
      <Message
        icon='user outline'
        info
        color='teal'
        content={`User does not have any follower yet.`}
      />
    )}

    {followingComponent && (
      <Message
        icon='user outline'
        info
        color='teal'
        content={`User does not follow anyone for the moment.`}
      />
    )}
  </>
);

export const NoMessages = () => (
  <Message
    info
    icon="telegram plane"
    color='teal'
    header="Empty"
    content="You have not messaged anyone yet. Search above to message someone!"
  />
);

export const NoPosts = () => (
  <Message
    info
    icon='info'
    header='Empty'
    color='teal'
    content='Zero post to display. Make sure that you have followed someone.'
  />
);

export const NoProfile = () => (
  <Message
    info
    icon='info'
    header='Empty'
    color='teal'
    content='No profile found.'
  />
);

export const NoNotifications = () => (
  <Message content='Zero notification.' color='teal' icon='smile' info />
);

export const NoPostFound = () => (
  <Message
    info
    icon='info'
    header='Empty'
    color='teal'
    content='No post found.'
  />
);
