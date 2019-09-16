/**
 * Created by ifiokidiang on 04/10/2017.
 * objective: building to scale
 */

/**
 * A Service Locator.
 *
 * Used to register and resolve dependency in a recursive mannner.
 * @class ServiceLocator
 * @constructor
 */
function ServiceLocator() {
    this.dependencyMap = {};
    this.dependencyCache = {};
  }
  
  /**
       * Adds a dependency to the container.
       *
       * @method register
       * @param  {String}   dependencyName The dependency name
       * @param  {Function} constructor    The function used for,
       *  initially instantiating the dependency.
       * @return {void}
       */
  ServiceLocator.prototype.register = function register(dependencyName, constructor) {
    if (typeof constructor !== 'function') {
      throw new Error(`${dependencyName}: Dependency constructor is not a function`);
    }
  
    if (!dependencyName) {
      throw new Error('Invalid depdendency name provided');
    }
  
    this.dependencyMap[dependencyName] = constructor;
  };
  
  /**
       * Resolves and returns the depdency requested.
       *
       * @method get
       * @param  {string} dependencyName The name of the dependency to resolve.
       * @return {mixed}                 The resolved depdency
       */
  ServiceLocator.prototype.get = function get(dependencyName) {
    if (this.dependencyMap[dependencyName] === undefined) {
      throw new Error(`${dependencyName}: Attempting to retrieve unknown depdency`);
    }
  
    if (typeof this.dependencyMap[dependencyName] !== 'function') {
      throw new Error(`${dependencyName}: Dependency constructor is not a function`);
    }
  
    if (this.dependencyCache[dependencyName] === undefined) {
      const dependencyConstructor = this.dependencyMap[dependencyName];
      const dependency = dependencyConstructor(this);
      if (dependency) {
        this.dependencyCache[dependencyName] = dependency;
      }
    }
  
    return this.dependencyCache[dependencyName];
  };
  
  /**
       * Retrieves an object containing the dependency name as the key and the resolved dependency
       * as the object. This object contains all dependencies registered in this container.
       *
       * @method getAll
       * @return {Array} Contain all the dependencies registered
       * in this container after being resolved.
       */
  ServiceLocator.prototype.getAll = function getAll() {
    const dependencies = Object.keys(this.dependencyMap);
    dependencies.forEach((key) => {
      this.get(dependencies[key]);
    });
  
    return this.dependencyCache;
  };
  
  /**
       * Clears all the dependencies from this container and from the cache.
       * @method clear
       * @return {void}
       */
  ServiceLocator.prototype.clear = function clear() {
    this.dependencyCache = {};
    this.dependencyMap = {};
  };
  
  module.exports = new ServiceLocator();
  