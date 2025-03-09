// src/hooks/useWalletConnect.js
import { useState, useEffect, useRef } from 'react';
import { WalletConnectV2Provider } from 'utils/walletconnect/__sdkWalletconnectProvider';

export const WalletConnectError = {
  invalidAddress: 'Invalid address',
  invalidConfig: 'Invalid WalletConnect setup',
  invalidTopic: 'Expired connection',
  sessionExpired: 'Unable to connect to existing session',
  connectError: 'Unable to connect',
  userRejected: 'User rejected connection proposal',
  userRejectedExisting: 'User rejected existing connection proposal',
  errorLogout: 'Unable to remove existing pairing',
  invalidChainID: 'Invalid chainID'
};

export const useWalletConnect = (config = {}) => {
  const {
    relayUrl = 'wss://relay.walletconnect.org',
    projectId,
    onLoginSuccess,
    onLoginError,
    logoutRoute = '/'
  } = config;

  const [error, setError] = useState('');
  const [wcUri, setWcUri] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [pairings, setPairings] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  
  const providerRef = useRef(null);
  const isInitializingRef = useRef(false);
  const mountedRef = useRef(false);

  // Generate the deep link URI for mobile wallet connections
  const uriDeepLink = !isLoading 
    ? `walletconnect://wc?uri=${encodeURIComponent(wcUri)}`
    : '';

  const handleLoginSuccess = async () => {
    try {
      if (!providerRef.current) return;
      
      const walletAddress = await providerRef.current.getAddress();
      if (!walletAddress) {
        console.warn('Login cancelled: No address received');
        return;
      }
      
      setAddress(walletAddress);
      setIsConnected(true);
      
      if (onLoginSuccess) {
        onLoginSuccess({
          address: walletAddress,
          provider: providerRef.current
        });
      }
    } catch (err) {
      setError(WalletConnectError.userRejected);
      console.error('Login error:', err);
      
      if (onLoginError) {
        onLoginError(err);
      }
    }
  };

  const handleLogout = () => {
    setIsConnected(false);
    setAddress('');
    // Navigate to logout page or perform other logout actions
    window.location.href = logoutRoute;
  };

  const handleEvent = (event) => {
    console.log('WalletConnect Session Event:', event);
  };

  const cancelLogin = async () => {
    if (!providerRef.current) return;
    
    try {
      const connectedSessions = providerRef.current.walletConnector?.session?.getAll() || [];
      
      if (connectedSessions.length > 0) {
        await providerRef.current.logout();
      }
      
      setIsConnected(false);
      setAddress('');
    } catch (err) {
      console.warn('Unable to logout:', err);
    }
  };

  const connectExisting = async (pairing) => {
    if (!relayUrl || !projectId) {
      setError(WalletConnectError.invalidConfig);
      return;
    }

    if (!pairing || !pairing.topic) {
      setError(WalletConnectError.invalidTopic);
      return;
    }

    try {
      setIsLoading(true);
      await cancelLogin();
      
      await initializeProvider(false);

      const { approval } = await providerRef.current.connect({
        topic: pairing.topic,
        methods: ['eth_sendTransaction', 'personal_sign']
      });

      try {
        await providerRef.current.login({ approval });
        handleLoginSuccess();
      } catch (err) {
        console.error(WalletConnectError.userRejectedExisting, err);
        setError(WalletConnectError.userRejectedExisting);
        setIsLoading(true);
        await initializeProvider();
      }
    } catch (err) {
      console.error(WalletConnectError.sessionExpired, err);
      setError(WalletConnectError.sessionExpired);
    } finally {
      setPairings(providerRef.current?.pairings || []);
      setIsLoading(false);
    }
  };

  const removeExistingPairing = async (topic) => {
    try {
      if (topic) {
        await providerRef.current?.logout({
          topic
        });
      }
    } catch (err) {
      console.error(WalletConnectError.errorLogout, err);
      setError(WalletConnectError.errorLogout);
    } finally {
      const newPairings = await providerRef.current?.getPairings();
      setPairings(newPairings || []);
    }
  };

  const initializeProvider = async (generateUri = true) => {
    if (!projectId || !relayUrl) {
      setError(WalletConnectError.invalidConfig);
      return;
    }

    if (isInitializingRef.current || !mountedRef.current) {
      return;
    }

    isInitializingRef.current = true;
    setIsLoading(true);

    // If provider already exists, just re-initialize
    if (providerRef.current?.walletConnector) {
      await providerRef.current.init();
      isInitializingRef.current = false;
      
      if (generateUri) {
        await generateWcUri();
      }
      
      return;
    }

    // Create a new provider
    const providerHandlers = {
      onClientLogin: handleLoginSuccess,
      onClientLogout: handleLogout,
      onClientEvent: handleEvent
    };

    try {
      // Chain ID should be fetched from your app's configuration
      const chainId = 1; // Ethereum Mainnet by default

      const newProvider = new WalletConnectV2Provider(
        providerHandlers,
        chainId,
        relayUrl,
        projectId,
        { logger: 'debug' }
      );

      await newProvider.init();
      providerRef.current = newProvider;
      
      if (generateUri) {
        setPairings(newProvider.pairings || []);
        await generateWcUri();
      }
    } catch (err) {
      console.error('Failed to initialize wallet connect provider:', err);
      setError(WalletConnectError.connectError);
    } finally {
      isInitializingRef.current = false;
      setIsLoading(false);
    }
  };

  const generateWcUri = async () => {
    if (!providerRef.current || !mountedRef.current) {
      return;
    }

    try {
      const { uri, approval } = await providerRef.current.connect({
        methods: ['eth_sendTransaction', 'personal_sign']
      });

      if (!uri) {
        return;
      }

      setWcUri(uri);
      console.log('WalletConnect URI generated:', uri);

      try {
        await providerRef.current.login({ approval });
      } catch (err) {
        console.error(WalletConnectError.userRejected, err);
        setError(WalletConnectError.userRejected);
      }
    } catch (err) {
      console.error(WalletConnectError.connectError, err);
      setError(WalletConnectError.connectError);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    // State
    error,
    isLoading,
    isConnected,
    address,
    walletConnectUri: wcUri,
    uriDeepLink,
    pairings,
    
    // Methods
    connect: initializeProvider,
    disconnect: cancelLogin,
    connectExisting,
    removeExistingPairing
  };
};