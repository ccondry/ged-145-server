module.exports = [
  // No error occured.
  'E_AG_NO_ERROR',
  // The host does not support the requested
  // version. The router will try the connection
  // attempt with an older version.
  'E_AG_INVALID_VERSION',
  // The host has rejected the connection because
  // one is already active.
  'E_AG_SESSION_ACTIVE',
  // The host cannot accept a connection at this
  // time.
  'E_AG_HOST_OFFLINE',
  // The host didn’t like the message sent,
  // presumably because of some formatting
  // problem.
  'E_AG_INVALID_MESSAGE',
  // The host rejected a request because the it
  // didn’t think the router was connected.
  'E_AG_SESSION_INACTIVE',
  // Available for host to report some application
  // specific error. The router will log this error.
  'E_AG_HOST_ERROR1',
  // See E_AG_HOST_ERROR1.
  'E_AG_HOST_ERROR2',
  //  The host could not decrypt the session key.
  'E_AG_INVALID_KEY'
]
