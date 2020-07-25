// VARIABLES & PATHS

let preprocessor = 'scss', // Preprocessor (sass, scss, less, styl)
	fileswatch = 'html,htm,txt,json,md,woff2', // List of files extensions for watching & hard reload (comma separated)
	imageswatch = 'jpg,jpeg,png,webp,svg', // List of images extensions for watching & compression (comma separated)
	baseDir = 'app', // Base directory path without «/» at the end
	buildDir = 'dist', // Production directory path without «/» at the end
	online = true; // If «false» - Browsersync will work offline without internet connection

let paths = {

	scripts: {
		src: [
			// 'node_modules/jquery/dist/jquery.min.js', // npm vendor example (npm i --save-dev jquery)
			baseDir + '/js/**/*.js' // app.js. Always at the end
		],
		dest: buildDir + '/js',
	},

	html: {
		src: baseDir + '/**/*.html',
		dest: buildDir + '/',
	},

	styles: {
		src: baseDir + '/' + preprocessor + '/**/*.' + preprocessor,
		dest: buildDir + '/css/',
	},

	images: {
		src: baseDir + '/img/**/*',
		dest: buildDir + '/img/',
	},

	fonts: {
		src: baseDir + '/fonts/**/*',
		dest: buildDir + '/fonts/',
	},

	deploy: {
		hostname: 'username@mysite.com', // Deploy hostname
		destination: 'mysite/public_html/', // Deploy destination
		include: [ /* '*.htaccess' */ ], // Included files to deploy
		exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excluded files from deploy
	},

	cssOutputName: 'styles.min.css',
	jsOutputName: 'scripts.min.js',

}

// LOGIC

const {
	src,
	dest,
	parallel,
	series,
	watch
} = require('gulp');
//const sass = require('gulp-sass');
const scss = require('gulp-sass');
const cleancss = require('gulp-clean-css');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const rigger = require('gulp-rigger');
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const gcmq = require('gulp-group-css-media-queries');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
// const webphtml = require('gulp-webp-html');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const fonter = require('gulp-fonter');
const newer = require('gulp-newer');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const del = require('del');

function browsersync() {
	browserSync.init({
		server: {
			baseDir: buildDir + '/'
		},
		notify: false,
		online: online
	})
}

function html() {
	return src(paths.html.src)
		// .pipe(webphtml())
		.pipe(dest(paths.html.dest))
		.pipe(browserSync.stream())
}

function scripts() {
	return src(paths.scripts.src)
		.pipe(plumber({
			errorHandler: notify.onError({
				title: 'Gulp',
				message: 'Error: <%= error.message %>'
			})
		}))
		.pipe(rigger())
		.pipe(concat(paths.jsOutputName))
		.pipe(uglify())
		.pipe(dest(paths.scripts.dest))
		.pipe(browserSync.stream())
}

function styles() {
	return src(paths.styles.src)
		.pipe(plumber({
			errorHandler: notify.onError({
				title: 'Gulp',
				message: 'Error: <%= error.message %>'
			})
		}))
		.pipe(eval(preprocessor)())
		.pipe(concat(paths.cssOutputName))
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 10 versions'],
			grid: false
		}))
		.pipe(gcmq())
		.pipe(cleancss({
			level: {
				1: {
					specialComments: 0
				}
			}
		}))
		.pipe(dest(paths.styles.dest))
		.pipe(browserSync.stream())
}

function images() {
	return src(paths.images.src)
		.pipe(webp({
			quality: 70
		}))
		.pipe(dest(paths.images.dest))
		.pipe(src(paths.images.src))
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{ removeViewBox: false }],
			interlaced: true,
			optimizationLevel: 3 // from 0 to 7
		}))
		//копирование html-файлов в папку продакшена
		.pipe(dest(paths.images.dest))
		//перезагрузка браузера
		.pipe(browserSync.stream())
}

function cleanimg() {
	return del('' + paths.images.dest + '/**/*', {
		force: true
	})
}

function fonts() {
	src(paths.fonts.src)
		.pipe(ttf2woff())
		.pipe(newer(paths.fonts.dest))
		.pipe(dest(paths.fonts.dest));
	return src(paths.fonts.src)
		.pipe(ttf2woff2())
		.pipe(newer(paths.fonts.dest))
		.pipe(dest(paths.fonts.dest));
}

/* function deploy() {
	return src(baseDir + '/')
	.pipe(rsync({
		root: baseDir + '/',
		hostname: paths.deploy.hostname,
		destination: paths.deploy.destination,
		include: paths.deploy.include,
		exclude: paths.deploy.exclude,
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}))
} */

function startwatch() {
	watch(baseDir + '/**/*.{' + fileswatch + '}', html).on('change', browserSync.reload);
	watch(baseDir + '/**/' + preprocessor + '/**/*', styles);
	watch([baseDir + '/**/*.js', '!' + paths.scripts.dest + '/*.min.js'], scripts);
	watch(baseDir + '/fonts/*.*', fonts);
	watch(baseDir + '/**/*.{' + imageswatch + '}', images);
}

exports.browserSync = browserSync;
exports.assets = series(cleanimg, html, styles, scripts, images, fonts);
exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.fonts = fonts;
exports.cleanimg = cleanimg;
//exports.deploy = deploy;
exports.default = parallel(images, html, styles, scripts, browsersync, startwatch);