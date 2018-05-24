module.exports = {
  SUBTYPE_TAG: 'demo.selector.voice', // the subtype specified in ICM script
  CED_TAG: '0', // Caller Entered Digits
  ROUTING_CLIENT_TAG: 'CVP_PG_1A', // Routing Client ID
  DN_STRING_TAG: '7703', // Dialed Number String
  CLID_TAG: '5551112222', // Caller ID
  CDPD_TAG: '1234', // Customer Provided Digits
  VAR1_TAG: '4085267209', // Peripheral Variable 1
  VAR2_TAG: 'jane smith', // Peripheral Variable 2
  VAR3_TAG: 'sales_east', // Peripheral Variable 3
  VAR4_TAG: 'California', // Peripheral Variable 4
  VAR5_TAG: '1234abcd', // Peripheral Variable 5
  VAR6_TAG: '5678efgh', // Peripheral Variable 6
  VAR7_TAG: 'asdfgh', // Peripheral Variable 7
  VAR8_TAG: 'zxcvbn', // Peripheral Variable 8
  VAR9_TAG: '123456', // Peripheral Variable 9
  VAR10_TAG: '7890', // Peripheral Variable 10
  /*
  this contains all scalar ECV variables
  each line is a key:value pair
  the key must be a valid, enabled ECV in ICM
  ICM truncates data that is longer than allowed
  */
  EXPANDED_CALL_VARIABLE_TAG: {
    'user.microapp.caller_input': '4',
    'user.Layout': 'default2',
    'user.microapp.currency': 'USD'
  },
  /*
  this contains all ECV array variables
  each element in the array is a single value in any ECV array you want to set
  the index is the data position in the ECV array you want to set / are specifying
  the name must be a valid, enabled ECV array in ICM
  ICM truncates data that is longer than allowed
  */
  EXPANDED_CALL_ARRAY_TAG: [{
    index: 0,
    name: 'user.microapp.FromExtVXML',
    value: 'test123'
  }, {
    index: 1,
    name: 'user.microapp.FromExtVXML',
    value: 'test456'
  }, {
    index: 1,
    name: 'user.microapp.ToExtVXML',
    value: '456test'
  }]
}
