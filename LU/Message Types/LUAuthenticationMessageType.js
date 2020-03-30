const LUAuthenticationMessageType = {
  MSG_AUTH_LOGIN_REQUEST: 0,
  MSG_AUTH_LOGOUT_REQUEST: 1,
  MSG_AUTH_CREATE_NEW_ACCOUNT_REQUEST: 2,
  MSG_AUTH_LEGOINTERFACE_AUTH_RESPONSE: 3,
  MSG_AUTH_SESSIONKEY_RECEIVED_CONFIRM: 4,
  MSG_AUTH_RUNTIME_CONFIG: 5
};

LUAuthenticationMessageType.key = function (value) {
  for (const prop in this) {
    if (this.hasOwnProperty.call(prop)) {
      if (this[prop] === value) return prop;
    }
  }
};

module.exports = LUAuthenticationMessageType;
