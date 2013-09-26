// Generated by CoffeeScript 1.6.3
(function() {
  var Finder, Info, fs, path;

  path = require('path');

  fs = require('fs');

  Finder = require('fs-finder');

  Info = (function() {
    Info.prototype.dir = null;

    Info.prototype.packageData = null;

    function Info(dir) {
      this.dir = dir;
      this.dir = path.resolve(this.dir);
      if (!fs.existsSync(this.dir)) {
        throw new Error('Directory ' + this.dir + ' does not exists.');
      }
      if (!fs.statSync(this.dir).isDirectory()) {
        throw new Error('Path ' + this.dir + ' is not directory.');
      }
      if (!fs.existsSync(this.dir + '/package.json') || !fs.statSync(this.dir + '/package.json').isFile()) {
        throw new Error('package.json file was not found.');
      }
    }

    Info.fromFile = function(file) {
      var dir, pckg;
      pckg = Finder["in"](path.dirname(file)).lookUp().findFirst().findFiles('package.json');
      if (pckg === null) {
        throw new Error('File ' + file + ' is not in node module.');
      }
      dir = path.dirname(pckg);
      return new Info(dir);
    };

    Info.fromName = function(pmodule, name) {
      var dir, directories, m, _i, _len;
      directories = Finder["in"](path.dirname(pmodule.filename)).lookUp().findDirectories('node_modules');
      m = null;
      for (_i = 0, _len = directories.length; _i < _len; _i++) {
        dir = directories[_i];
        if (fs.existsSync(dir + '/' + name) && fs.statSync(dir + '/' + name).isDirectory()) {
          m = dir + '/' + name;
          break;
        }
      }
      if (m === null) {
        throw new Error('Module ' + name + ' was not found.');
      }
      return new Info(m);
    };

    Info.self = function(pmodule) {
      var pckg;
      pckg = Finder["in"](path.dirname(pmodule.filename)).lookUp().findFiles('package.json');
      if (pckg === null) {
        throw new Error('File ' + pmodule.filename + ' is not in module.');
      }
      return new Info(path.dirname(pckg));
    };

    Info.prototype.getPackagePath = function() {
      return this.dir + '/package.json';
    };

    Info.prototype.getPackageData = function() {
      var info;
      if (this.packageData === null) {
        info = JSON.parse(fs.readFileSync(this.getPackagePath(), {
          encoding: 'utf8'
        }));
        if (typeof info.main === 'undefined') {
          info.main = './index';
        }
        this.packageData = info;
      }
      return this.packageData;
    };

    Info.prototype.getName = function() {
      return this.getPackageData().name;
    };

    Info.prototype.getVersion = function() {
      return this.getPackageData().version;
    };

    Info.prototype.getMainFile = function() {
      return require.resolve(this.dir + '/' + this.getPackageData().main);
    };

    return Info;

  })();

  module.exports = Info;

}).call(this);