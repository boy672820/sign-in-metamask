import { RootState, useDispatch, useSelector } from '../redux/store';
import { authenticate, getUser } from '../redux/slices/auth';
import Web3 from 'web3';

export default function SignIn() {
  const dispatch = useDispatch();
  const { isLoading, user, isAuthenticated, error } = useSelector(
    (state: RootState) => state.auth
  );

  /**
   * Sign in
   */
  const handleSignIn = async () => {
    if (window.ethereum) {
      await window.ethereum.send('eth_requestAccounts');

      // Inject wallet provider
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      // Get user nonce
      const { nonce, publicAddress } = await getUser(account);

      // Sign metamask
      web3.eth.personal.sign(nonce, publicAddress, '', (error, signature) => {
        if (error) {
          throw error;
        }

        dispatch(authenticate({ publicAddress, signature }));
      });
    }
  };

  return (
    <>
      <h1>Sign in</h1>
      <button type='button' onClick={handleSignIn}>
        Sign in Metamask
      </button>

      {!error && isLoading && <p>Loading..</p>}
      {!error && user && <p>{user?.publicAddress}</p>}
      {!error && isAuthenticated && <h2>Authenticated</h2>}
      {error && <strong style={{ color: 'red' }}>Exception error!</strong>}
    </>
  );
}
