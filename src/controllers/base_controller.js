'use strict';

function BaseCtrl(app) {

  function registerCtrl(name) {
    require(`./${name}_controller`).default(app);
  }

  return {
    registerCtrl: registerCtrl
  };
}

export default BaseCtrl;
