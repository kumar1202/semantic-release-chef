const AggregateError = require("aggregate-error");
const getError = require('./get-error');
const {isString, isNil, isBoolean, defaultTo} = require('lodash');

const isNonEmptyString = (value) => isString(value) && value.trim();

const PRIMARY_VALIDATORS = {
  cookbookPublish: isBoolean,
  updateLockfile: isNonEmptyString
};

const SECONDARY_VALIDATORS = {
  berksfilePath: isNonEmptyString,
  metadataPath: isNonEmptyString
};

const SUPERMARKET_VALIDATORS = {
  supermarketSite: isNonEmptyString,
  category: isNonEmptyString
};

const BERKS_VALIDATORS = {
  chefEnv: isNonEmptyString,
};

module.exports = async (pluginConfig) => {
  const {cookbookPublish, updateLockfile} = pluginConfig;
  
  const errors = []
  errors = Object.entries({cookbookPublish, updateLockfile}).reduce(
    (errors, [option, value]) =>
      !isNil(value) && !SECONDARY_VALIDATORS[option](value)
        ? [...errors, getError(`EINVALID${option.toUpperCase()}`, {[option]: value})]
        : errors,
    []
  );

  // TODO: modularize defaults 
  pluginConfig.metadataPath = defaultTo(pluginConfig.metadataPath, 'metadata.rb');
  pluginConfig.berksfilePath = defaultTo(pluginConfig.berksfilePath, 'Berksfile.rb');

  errors = Object.entries({metadataPath, berksfilePath}).reduce(
    (errors, [option, value]) =>
      !isNil(value) && !PRIMARY_VALIDATORS[option](value)
        ? [...errors, getError(`EINVALID${option.toUpperCase()}`, {[option]: value})]
        : errors,
    []
  );

  if (cookbookPublish == true) {
    if (pluginConfig.supermarketPublish.length > 0) {
      const {supermarketSite, category} = pluginConfig.supermarketPublish;

      errors = Object.entries({supermarketSite, category}).reduce(
        (errors, [option, value]) =>
          !isNil(value) && !SUPERMARKET_VALIDATORS[option](value)
            ? [...errors, getError(`EINVALID${option.toUpperCase()}`, {[option]: value})]
            : errors,
        []
      );
    }

    if (pluginConfig.berksPublish.length > 0) {
      const {chefEnv} = pluginConfig.berksPublish;

      errors = Object.entries({chefEnv, category}).reduce(
        (errors, [option, value]) =>
          !isNil(value) && !BERKS_VALIDATORS[option](value)
            ? [...errors, getError(`EINVALID${option.toUpperCase()}`, {[option]: value})]
            : errors,
        []
      );
    }
  }

  if (errors.length > 0) {
    throw new AggregateError(errors);
  }
};
