'use strict';
var jsftp = require('jsftp'),
    log = require('clilog'),
    through = require('through2'),
    util = require('gulp-util');

var JSFtp = require('jsftp-mkdirp')(jsftp);

module.exports = function(options) {
    var fileCount = 0;
    if (options.host == undefined) {
        throw new util.PluginError('gulp-ftp-env', '`host` required.');
    }
    return through.obj(function(file, enc, cb) {
        var self = this;

        var ftp = new JSFtp(options);

        var finalRemotePath = path.join('/', options.remotePath, file.relative).replace(/\\/g, '/');

        ftp.mkdirp(path.dirname(finalRemotePath).replace(/\\/g, '/'), function(err) {
            if (err) {
                self.emit('error', new gutil.PluginError('gulp-ftp-env', err));
                return cb();
            }

            ftp.put(file.contents, finalRemotePath, function(err) {
                if (err) {
                    self.emit('error', new gutil.PluginError('gulp-ftp-env', err));
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
            gutil.log('gulp-ftp-env:', gutil.colors.green(fileCount, fileCount === 1 ? 'file' : 'files', 'uploaded successfully'));
        } else {
            gutil.log('gulp-ftp-env:', gutil.colors.yellow('No files uploaded'));
        }

        cb();
    });

}
