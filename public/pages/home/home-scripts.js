/* jshint esversion: 6 */

exports.mount = function(){
  console.log(`mounting at ${__filename.split(__dirname)[1]}`);
  // mounting our welcome-message component's JS
  require('./../../components/welcome-message/welcome-message-scripts').mount();

};
