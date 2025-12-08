/**
 * Use this to define a set of functions that you may
 * wish to replace in automated tests with test doubles.
 * 
 * Note: This class keeps tabs on all instances which in turn prevents them from
 * being garbage collected. This isn't an issue as long as you don't
 * generate an arbitrary number of instances.
 */
export class Dependency {
  #dependencyName;
  #behavior = {};
  static #instances = [];

  /** This function should get called in your global before-each. */
  static beforeEach() {
    for (const instance of this.#instances) {
      // Clears out all behavior so any attempt to use a dependency will
      // result in an error until a new replacement behavior is
      // explicitly provided (via .replaceWith()).
      instance.#behavior = {};
    }
  }

  constructor(name) {
    this.#dependencyName = name;
    Dependency.#instances.push(this);
  }

  /**
   * Registers the real implementation of a given function.
   * A wrapped version of that function will be returned that is capable
   * of being controlled during tests.
   */
  define(fnName, realImplementation) {
    this.#behavior[fnName] = realImplementation;
    return (...args) => {
      if(!(fnName in this.#behavior)) {
        throw new Error(
          `The "${this.#dependencyName}" dependency does not have an ` +
          `implementation provided for the function ${fnName}().`
        );
      }
      return this.#behavior[fnName](...args);
    }
  }

  /**
   * This should only be invoked when running tests.
   * Pass in an object who's keys correspond to the function names provided
   * to define(), and who's values are fake functions. These fake functions
   * will be called in place of the real ones.
   */
  async replaceWith(testDouble) {
    this.#behavior = testDouble;
  }
}
