'use strict';
var jsftp = require('jsftp'),
    log = require('clilog'),
    path = require('path'),
    through = require('through2'),
    util = require('gulp-util');

var JSFtp = require('jsftp-mkdirp')(jsftp);

module.exports = function(options) {
    var fileCount = 0;
    var timeStamp = new Date().getTime().toString();
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
        if (options.version && options.version != 'none') {
	    file.contents = new Buffer(String(file.contents).replace(options.version, timeStamp));
        } else if (!options.version || options.version == 'none') {
            timeStamp = '';
	    file.contents = new Buffer(String(file.contents).replace(options.version+'/', ''));
        }

	if (options['keywords'] instanceof Array && options['keywords'].length>0 ){
	    options['keywords'].forEach(function(v,idx){
	    	(v.before && v.after)?file.contents = new Buffer(String(file.contents).replace(v.before, v.after)):util.log('gulp-ftp-env:', util.colors.yellow('keywords：'+v.before+'replace failed'));
	    });
	}

        var finalRemotePath;
        if (/assets\//.test(file.relative)) {
            finalRemotePath = path.join('/', options.remotePath, timeStamp, file.relative).replace(/\\/g, '/');
        } else {
            finalRemotePath = path.join('/', options.remotePath, file.relative).replace(/\\/g, '/');
        }
    
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
