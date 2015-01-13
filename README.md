gulp-ftp-env [![Build Status](https://travis-ci.org/devWayne/gulp-ftp-env.svg?branch=master)](https://travis-ci.org/devWayne/gulp-ftp-env)
============
> Gulp Plugin for environment changing and version management 

##Usage

First, install `gulp-ftp-env` as a development dependency:   

```shell
npm install --save-dev gulp-ftp-env
```
Then, add it to your `gulpfile.js`:   

```javascript
var ftpEnv = require('gulp-ftp-env');   

gulp.task('beta', function() {   
    return gulp.src(dirs.dist + '/**')   
      	  .pipe(ftpEnv({   
            "host": "xxx.xxx.xxx.xxx",   
            "port": "21",   
            "user": "",   
            "pass": "",   
            "remotePath": "foo/",   
	    "version":"none"   
        }));   	
});   

gulp.task('product', function() {   
    return gulp.src(dirs.dist + '/**')   
      	  .pipe(ftpEnv({   
            "host": "xxx.xxx.xxx.xx",   
            "port": "21",   
            "user": "",   
            "pass": "",   
            "remotePath": "foo/",   
	    "version":"{{v}}",   
	    "keywords":[{"before":"before-xxx","after":"after-xxx"}]   
        }));   
});   
```
