'use strict';
var jsftp = require('jsftp'),
    log = require('clilog'),
    path = require('path'),
    through = require('through2'),
    util = require('gulp-util');

var JSFtp = require('jsftp-mkdirp')(jsftp);

module.exports = function(options) {
    var fileCount = 0;
	var version=new Date().getTime().toString();
    if (options.host == undefined) {
        throw new util.PluginError('gulp-ftp-env', '`host` required.');
    }
    return through.obj(function(file, enc, cb) {
        if (file.isNull()) {
            this.push(file);
            return cb();
        }

        var self = this;

        var ftp = new JSFtp(options);
        var finalRemotePath = path.join('/', options.remotePath,version, file.relative).replace(/\\/g, '/');
	    console.log(file.relative);
        ftp.mkdirp(path.dirname(finalRemotePath).replace(/\\/g, '/'), function(err) {
            if (err) {
                self.emit('error', new util.PluginError('gulp-ftp-env', err));
                return cb();
            }

            ftp.put(file.contents, finalRemotePath, function(err) {
                if (err) {
                    self.emit('error', new util.PluginError('gulp-ftp-env', err));
                    return cb();
                }

                fileCount++;
                ftp.raw.quit();
                cb();
            });
        });

        this.push(file);
    }, function(cb) {
        if (fileCount > 0) {
            util.log('gulp-ftp-env:', util.colors.green(fileCount, fileCount === 1 ? 'file' : 'files', 'uploaded successfully'));
        } else {
            util.log('gulp-ftp-env:', util.colors.yellow('No files uploaded'));
        }

        cb();
    });

}
