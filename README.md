gulp-chg-env
============
Gulp Plugin for changing environment

##Usage

First, install `gulp-replace` as a development dependency:   

```shell
npm install --save-dev gulp-replace
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
	    "version":"{{v}},   
	    "keywords":[{"before":"before-xxx","after":"after-xxx"}]   
        }));   
});   
```
