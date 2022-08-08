import { Icon, Message, Divider } from 'semantic-ui-react';

import { useRouter } from 'next/router';

import Link from 'next/link';

export const HeaderMessage = () => {
  const router = useRouter();
  const signupRoute = router.pathname === '/signup';

  return (
    <Message
      color='teal'
      attached
      header={signupRoute ? 'Get started!' : 'Welcome back!'}
      icon={signupRoute ? 'users' : 'key'}
      content={
        signupRoute
          ? 'Create a new account'
          : 'Login with your email and password'
      }
    />
  );
};

export const FooterMessage = () => {
  const router = useRouter();

  const signupRoute = router.pathname === '/signup';

  return (
    <>
      {signupRoute ? (
        <>
          <Message attached="bottom" warning>
            <Icon name="help" />
            Already registered? <Link href="/login">Login here</Link>
          </Message>
          <Divider hidden />
        </>
      ) : (
        <>
          <Message attached="bottom" info>
            <Icon name="lock" />
            <Link href="/reset">Forgot password?</Link>
          </Message>

          <Message attached="bottom" warning>
            <Icon name="help" />
            New user? <Link href="/signup">Signup here</Link>
          </Message>
        </>
      )}
    </>
  );
};
