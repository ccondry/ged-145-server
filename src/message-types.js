module.exports = [
  // 0 = undefined
  'UNDEFINED',
  // 1 = FAILURE_CONF
  // Sent by the host to report an error. Used in response to any message.
  'FAILURE_CONF',
  // 2 = FAILURE_EVENT
  //  Sent by the host at any time to report a failure. Not in response to a
  // specific message.
  'FAILURE_EVENT',
  // 3 = OPEN_REQ
  // Sent by the router to initiate a connection.
  'OPEN_REQ',
  // 4 = OPEN_CONF
  // Sent by the host to conform initiation of a connection.
  'OPEN_CONF',
  // 5 = CLOSE_REQ
  // Sent by the router to close a connection
  'CLOSE_REQ',
  // 6 = CLOSE_CONF
  // Sent by the host to confirm a close.
  'CLOSE_CONF',
  // 7 = HEARTBEAT_REQ
  // Sent periodically by the router to keep the connection alive.
  'HEARTBEAT_REQ',
  // 8 = HEARTBEAT_RESP
  // Sent by the host to confirm the heartbeat.
  'HEARTBEAT_RESP',
  // 9 = QUERY_REQ
  // Sent by the router when a script requests data from the host.
  'QUERY_REQ',
  // 10 = QUERY_RESP
  // Sent by the host in response to a query.
  'QUERY_RESP',
  // 11 = PARAM_REQ
  // Sent by the router to change a parameter
  'PARAM_REQ',
  // 12 = PARAM_CONF
  // Sent by the host to confirm the parameter change.
  'PARAM_CONF'
]
