'use strict';

/**
 * BaseCtrl
 * Represents the Base Controller that all controllers inherit.
 *
 * @Function
 * @this {BaseCtrl}
 * @param {Object} router - Express router used to mount controller's routes
 * @return {BaseCtrl} The new BaseCtrl object
 */
function BaseCtrl(app) {
  /**
   * Registers a new controller based on its name
   *
   * @param {String} name - controller's name
   */
  function registerCtrl(name) {
    require(`./${name}_controller`).default(app);
  }
  return {
    registerCtrl: registerCtrl
  };
}

export default BaseCtrl;
