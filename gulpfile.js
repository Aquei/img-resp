var gulp = require("gulp");
var uglify = require("gulp-uglify");
var sass = require("gulp-sass");
var minifyHTML = require("gulp-minify-html");
var inlinesource = require('gulp-inline-source');
var uncache = require('gulp-uncache');

gulp.task("js", function(){
	gulp.src("dev/*.js")
		.pipe(uglify({
			preserveComments: 'some'
		}))
		.pipe(gulp.dest("work"));
});

gulp.task("css", function(){
	gulp.src("dev/*.scss")
		.pipe(sass({outputStyle: "compressed"}))
		.pipe(gulp.dest("dev"))
		.pipe(gulp.dest("work"))
});

gulp.task("html", function(){
	gulp.src("dev/*.html")
		.pipe(inlinesource({
			compress: false,
			pretty: true,
		}))
		.pipe(uncache())
		.pipe(minifyHTML({
			empty: true,
			conditionals: true
		}))
		.pipe(gulp.dest("work"))
});

gulp.task("webserver", function(){
	gulp.src("work/")
		.pipe(webserver({
			livereload: true,
			directoryListing: true,
			open: true}));
});


gulp.task("dist", function(){
	gulp.src(["work/*.js", "work/*.html"])
		.pipe(gulp.dest("dist"));

	//
	//gulp.src("work/*.css")
	//		.pipe(gulp.dest("dest"))
	//
});

gulp.task("watch",  function(){
	gulp.watch(["dev/*.html"], ["html"]);
	gulp.watch(["dev/*.sass"], ["css"]);
	gulp.watch(["dev/*.js"], ["js"]);
});

