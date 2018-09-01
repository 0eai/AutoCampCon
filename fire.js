var admin = require("firebase-admin");
const si = require('systeminformation');
var serviceAccount = require("./serviceKey/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://filesync-fcf45.firebaseio.com"
});

var db = admin.database();
var ref = db.ref("/inet");
const setInet = () => {
  var inet = null;
  si.networkInterfaceDefault(function(deIface) {
    console.log('networkInterfaceDefault');
    console.log(deIface);
    si.networkInterfaces(function(nIface) {
      console.log('networkInterfaces');
      console.log(nIface);
      for (var i = 0; i < nIface.length; i++) {
        if(nIface[i].iface == deIface) {
          inet = nIface[i].ip4;
          //console.log(inet);
        }
      }
      console.log(inet);
      ref.set(inet, function(error) {
        if (error) {
          console.log("ip4 address could not be saved." + error);
        } else {
          console.log("ip4 address saved successfully.");
        }
      });
    });
  });
};

module.exports = {  setInet };
