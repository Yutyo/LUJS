export const LUGeneralMessageType = {
  MSG_SERVER_VERSION_CONFIRM: 0,
  MSG_SERVER_DISCONNECT_NOTIFY: 1,
  MSG_SERVER_GENERAL_NOTIFY: 2,
  key: function (value) {
    for (const prop in this) {
      if (this.hasOwnProperty.call(prop)) {
        if (this[prop] === value) return prop;
      }
    }
  }
};
