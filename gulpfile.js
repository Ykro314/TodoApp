"use strict";

var gulp = require( "gulp" );
var del = require( "del" );
var runSequence = require( 'run-sequence' );
var notify = require( "gulp-notify" )
var combiner = require( "stream-combiner2" );


var less = require( "gulp-less" );
var autoprefixer = require( "gulp-autoprefixer" );
var imagemin = require( "gulp-imagemin" );
var zip = require( "gulp-zip" );

var cleanCss = require( "gulp-clean-css" );
var uglify = require( "gulp-uglify" );
var concat = require( "gulp-concat" );



/**
* gulp dev
* Development version. LESS, autoprefixing and watch
*/
gulp.task( "dev", ["styles", "watch:styles"] );

gulp.task( "styles", function() {
  return combiner( 
    gulp.src( 'less/style.less' ),
    less(),
    autoprefixer( { browsers: ['last 3 versions'] } ),
    gulp.dest( "css" )
  ).on( "error", notify.onError() );
  
} )

gulp.task( "watch:styles", function(){
  gulp.watch( "less/**/*.less", ["styles"] );
})



/**
* Optimize images.
*/
gulp.task( "imagemin", function() {
  return gulp.src( "graph/**/*.*" )
    .pipe( imagemin() )
    .pipe( gulp.dest( "graph/" ) );
})



/**
* gulp stage 
* Clean build folder, prepare styles, optimize images, copy files in build directory, add build.zip in build directory. 
*/

gulp.task( "stage", function( callback ) {
  runSequence( "clean:build", "styles", "imagemin", "build:dev", "zip:build", callback );
} );

gulp.task( "clean:build", function(){
  return del( "build" );
});

gulp.task( "build:dev", function(){
  return gulp.src( [ "js/*.js", "css/*.css", "less/**/*.less", "graph/**/*.*", "index.html" ] )
  .pipe( gulp.dest( function( file ){
    var regExp = /.\w+$/;
    var extName = file.relative.match( regExp )[0].substr( 1 );
    if( extName === "js" || extName === "less" || extName === "css" ) {
      return "build/" + extName;
    }
    else if( extName === "png" || extName === "jpg" ) {
      return "build/graph"
    }
    else {
      return "build";
    }
  } ) )
});

gulp.task( "zip:build", function(){
  function getDate() {
    var date = new Date();
    var stringDate = date.getFullYear() + "-" + ( date.getMonth() + 1 ) + "-" + date.getDate();
    return stringDate;
  }
  return gulp.src( "build/**/*.*" )
    .pipe( zip( "build " + getDate() + ".zip" ) )
    .pipe( gulp.dest( "build" ) );
})



/**
* gulp production 
* Clean prod directory, prepare styles, optimize images, copy files in prod directory, minify css, uglify and concat scripts, zip folder add prod.zip to prod directory.
*/

gulp.task( "production", function( callback ) {
  runSequence( "clean:prod", "styles", "imagemin", "build:prod", "minify:prod", "scripts", "zip:prod", callback );
} );

gulp.task( "clean:prod", function(){
  return del( "prod" );
});

gulp.task( "build:prod", function(){
  return gulp.src( [ "js/*.js", "css/*.css", "graph/**/*.*", "index.html" ] )
  .pipe( gulp.dest( function( file ){
    var regExp = /.\w+$/;
    var extName = file.relative.match( regExp )[0].substr( 1 );
    if( extName === "js" || extName === "css" ) {
      return "prod/" + extName;
    }
    else if( extName === "png" || extName === "jpg" ) {
      return "prod/graph"
    }
    else {
      return "prod";
    }
  } ) )
});

gulp.task( "minify:prod", function(){
  return gulp.src( "prod/css/*.css" )
    .pipe( cleanCss() )
    .pipe( gulp.dest( "prod/css" ) );
})
/**
* Scripts task need specified sequence of files in gulp.src.
*/
gulp.task( "scripts", function(){
  return gulp.src( ["prod/js/app.js", "prod/js/help.js"] )
    .pipe( uglify() )
    .pipe( concat( "all.js" ) )
    .pipe( gulp.dest( "prod/js" ) );
})

gulp.task( "zip:prod", function(){
  function getDate() {
    var date = new Date();
    var stringDate = date.getFullYear() + "-" + ( date.getMonth() + 1 ) + "-" + date.getDate();
    return stringDate;
  }
  return gulp.src( "prod/**/*.*" )
    .pipe( zip( "prod " + getDate() + ".zip" ) )
    .pipe( gulp.dest( "prod" ) );
})



/**
* Clean node_modules folder. For faster project delete.
*/
gulp.task( "clean:modules", function(){
  return del( "node_modules" );
});

gulp.task( "clean:all", [ "clean:build", "clean:prod" ] );



