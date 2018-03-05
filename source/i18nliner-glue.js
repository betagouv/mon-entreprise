var extend = require('extend');
var I18n = require("i18n-js");
I18n.locale = "en-US";
require("i18nliner/dist/lib/extensions/i18n_js").default(I18n);
require("react-i18nliner/dist/extensions/i18n_js")(I18n);

var translationFiles = require.context("../config/locales", true, /\.json$/);
translationFiles.keys().forEach(function(key) {
  extend(true, I18n, {translations: translationFiles(key)});
});
