"use strict";

import webpack from "webpack";
import webpackStream from "webpack-stream";
import gulp from "gulp";
import gulpif from "gulp-if";
import browsersync from "browser-sync";
import autoprefixer from "gulp-autoprefixer";
import pug from "gulp-pug";
import pugbem from "gulp-pugbem";
import sass from "gulp-sass";
import groupmediaqueries from "gulp-group-css-media-queries";
import mincss from "gulp-clean-css";
import sourcemaps from "gulp-sourcemaps";
import rename from "gulp-rename";
import imagemin from "gulp-imagemin";
import imageminPngquant from "imagemin-pngquant";
import imageminZopfli from "imagemin-zopfli";
import imageminMozjpeg from "imagemin-mozjpeg";
import imageminGiflossy from "imagemin-giflossy";
import imageminWebp from "imagemin-webp";
import webp from "gulp-webp";
import favicons from "gulp-favicons";
import replace from "gulp-replace";
import plumber from "gulp-plumber";
import debug from "gulp-debug";
import clean from "gulp-clean";
import yargs from "yargs";

var fs = require('fs');
var data = require('gulp-data');

const webpackConfig = require("./webpack.config.js"),
	argv = yargs.argv,
	production = !!argv.production,

	paths = {
		views: {
			src: [
				"./src/views/index.pug",
				"./src/pages/*.pug"
			],
			dist: "./dist/",
			watch: [
				"./src/blocks/**/*.pug",
				"./src/pages/**/*.pug",
				"./src/views/**/*.pug"
			]
		},
		styles: {
			src: "./src/styles/main.scss",
			dist: "./dist/styles/",
			watch: [
				"./src/blocks/**/*.scss",
				"./src/styles/**/*.scss"
			]
		},
		scripts: {
			src: "./src/js/index.js",
			dist: "./dist/js/",
			watch: [
				"./src/blocks/**/*.js",
				"./src/js/**/*.js"
			]
		},
		images: {
			src: [
				"./src/img/**/*.{jpg,jpeg,png,gif,svg}",
				"!./src/img/svg/*.svg",
				"!./src/img/favicon.{jpg,jpeg,png,gif}"
			],
			dist: "./dist/img/",
			watch: "./src/img/**/*.{jpg,jpeg,png,gif,svg}"
		},
		webp: {
			src: "./src/img/**/*_webp.{jpg,jpeg,png}",
			dist: "./dist/img/",
			watch: "./src/img/**/*_webp.{jpg,jpeg,png}"
		},
		fonts: {
			src: "./src/fonts/**/*.{ttf,otf,woff,woff2}",
			dist: "./dist/fonts/",
			watch: "./src/fonts/**/*.{ttf,otf,woff,woff2}"
		},
		favicons: {
			src: "./src/img/favicon.{jpg,jpeg,png,gif}",
			dist: "./dist/img/favicons/",
		},
		server_config: {
			src: "./src/.htaccess",
			dist: "./dist/"
		},
		docs: {
			src: "./src/docs/**/*.{pdf, doc}",
			dist: "./dist/docs/",
			watch: "/src/docs/**/*.{pdf, doc}"
		}
	};

webpackConfig.mode = production ? "production" : "development";
webpackConfig.devtool = production ? false : "cheap-eval-source-map";

export const server = () => {
	browsersync.init({
		server: "./dist/",
		port: 4000,
		notify: true
	});

	gulp.watch(paths.views.watch, views);
	gulp.watch(paths.styles.watch, styles);
	gulp.watch(paths.scripts.watch, scripts);
	gulp.watch(paths.images.watch, images);
	gulp.watch(paths.webp.watch, webpimages);
};

export const cleanFiles = () => gulp.src("./dist/*", {read: false})
	.pipe(clean())
	.pipe(debug({
		"title": "Cleaning..."
	}));

export const serverConfig = () => gulp.src(paths.server_config.src)
	.pipe(gulp.dest(paths.server_config.dist))
	.pipe(debug({
		"title": "Server config"
	}));

export const views = () => gulp.src(paths.views.src)
	.pipe(pug({
		plugins: [pugbem],
		pretty: true,
		locals: {
		}
	}))
	.pipe(gulpif(production, replace("main.css", "main.min.css")))
	.pipe(gulpif(production, replace("main.js", "main.min.js")))
	.pipe(gulp.dest(paths.views.dist))
	.on("end", browsersync.reload);

export const styles = () => gulp.src(paths.styles.src)
	.pipe(gulpif(!production, sourcemaps.init()))
	.pipe(plumber())
	.pipe(sass())
	.pipe(groupmediaqueries())
	.pipe(gulpif(production, autoprefixer({
		browsers: ["last 12 versions", "> 1%", "ie 8", "ie 7"]
	})))
	.pipe(gulpif(production, mincss({
		compatibility: "ie8", level: {
			1: {
				specialComments: 0,
				removeEmpty: true,
				removeWhitespace: true
			},
			2: {
				mergeMedia: true,
				removeEmpty: true,
				removeDuplicateFontRules: true,
				removeDuplicateMediaBlocks: true,
				removeDuplicateRules: true,
				removeUnusedAtRules: false
			}
		}
	})))
	.pipe(gulpif(production, rename({
		suffix: ".min"
	})))
	.pipe(plumber.stop())
	.pipe(gulpif(!production, sourcemaps.write("./maps/")))
	.pipe(gulp.dest(paths.styles.dist))
	.pipe(debug({
		"title": "CSS files"
	}))
	.pipe(browsersync.stream());

export const scripts = () => gulp.src(paths.scripts.src)
	.pipe(webpackStream(webpackConfig), webpack)
	.pipe(gulpif(production, rename({
		suffix: ".min"
	})))
	.pipe(gulp.dest(paths.scripts.dist))
	.pipe(debug({
		"title": "JS files"
	}))
	.on("end", browsersync.reload);

export const images = () => gulp.src(paths.images.src)
	.pipe(gulpif(production, imagemin([
		imageminGiflossy({
			optimizationLevel: 3,
			optimize: 3,
			lossy: 2
		}),
		imageminPngquant({
			speed: 4,
			quality: [0.3, 0.5]
		}),
		imageminZopfli({
			more: true
		}),
		imageminMozjpeg({
			progressive: true,
			quality: 70
		}),
		imagemin.svgo({
			plugins: [
				{ removeViewBox: false },
				{ removeUnusedNS: false },
				{ removeUselessStrokeAndFill: false },
				{ cleanupIDs: false },
				{ removeComments: true },
				{ removeEmptyAttrs: true },
				{ removeEmptyText: true },
				{ collapseGroups: true }
			]
		})
	])))
	.pipe(gulp.dest(paths.images.dist))
	.pipe(debug({
		"title": "Images"
	}))
	.on("end", browsersync.reload);

export const webpimages = () => gulp.src(paths.webp.src)
	.pipe(webp(gulpif(production, imageminWebp({
		lossless: true,
		quality: 90,
		alphaQuality: 90
	}))))
	.pipe(gulp.dest(paths.webp.dist))
	.pipe(debug({
		"title": "WebP images"
	}));

export const fonts = () => gulp.src(paths.fonts.src)
	.pipe(gulp.dest(paths.fonts.dist))
	.pipe(debug({
		"title": "Fonts"
	}));

export const docs = () => gulp.src(paths.docs.src)
	.pipe(gulp.dest(paths.docs.dist))
	.pipe(debug({
		"title": "Docs"
	}));

export const favs = () => gulp.src(paths.favicons.src)
	.pipe(favicons({
		icons: {
			appleIcon: true,
			favicons: true,
			online: false,
			appleStartup: false,
			android: false,
			firefox: false,
			yandex: false,
			windows: false,
			coast: false
		}
	}))
	.pipe(gulp.dest(paths.favicons.dist))
	.pipe(debug({
		"title": "Favicons"
	}));

export const development = gulp.series(cleanFiles, 
	gulp.parallel(views, styles, scripts, images, webpimages, fonts, docs, favs),
	gulp.parallel(server));

export const prod = gulp.series(cleanFiles, serverConfig, views, styles, scripts, images, webpimages, fonts, docs, favs);

export default development;