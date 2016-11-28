var gulp = require('gulp'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglifyjs'),
	cssnano = require('gulp-cssnano'),
	rename = require('gulp-rename'),
	del = require('del'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	cache = require('gulp-cache'),
	autoprefixer = require('gulp-autoprefixer');

//компилим sass
gulp.task('sass', function(){
	return gulp.src('app/sass/*.scss')
	.pipe(sass())
	.pipe(autoprefixer(['last 2 versions', '> 1%'], {cascade: true}))
	.pipe(gulp.dest('app/css'));
	//.pipe(browserSync.reload({stream: true}))
});

//сжимаем все библиотеки js
gulp.task('scripts', function(){
	return gulp.src([
			'app/libs/jquery/dist/jquery.min.js',
			'app/libs/slick/slick.min.js'
		])
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'));
});

//сжимаем все библиотеки css. библиотеки импортируются в файл app/sass/libs.css
gulp.task('css-libs', ['sass'], function(){
	return gulp.src('app/sass/libs.scss')
	.pipe(cssnano())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('app/css'));
});

//перезагрузка браузеров
gulp.task('browser-sync', function(){
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false
	});
});

//удаляем папку билда(dist)
gulp.task('clean', function(){
	return del.sync('dist');
});

//чистим кеш картинок
gulp.task('clear', function(){
	return cache.clearAll();
});

//обрабатываем картинки
gulp.task('img', function(){
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin({
		interlaced: true,
		progressive: true,
		svgoPlagins: [{removeVeiwBox: false}],
		use: [pngquant()]
		})))
	.pipe(gulp.dest('dist/img'));
});

gulp.task('svg', function(){
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin({
		interlaced: true,
		progressive: true,
		svgoPlagins: [{removeVeiwBox: false}],
		use: [pngquant()]
		})))
	.pipe(gulp.dest('dist/svg'));
});

//запускаем таски для разработки и радуемся
gulp.task('dev', ['browser-sync', 'css-libs', 'scripts'], function(){
	gulp.watch('app/sass/*.scss', ['sass']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/css/**/*.css', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
});

//билдим что получилось после разработки
gulp.task('build', ['clean', 'img', 'svg', 'sass', 'scripts'], function(){
	
	var buildCss = gulp.src([
		'app/css/main.css',
		'app/css/libs.min.css',
	])
	.pipe(gulp.dest('dist/css'));

	var buildFonts = gulp.src('app/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'));

	var buildJs = gulp.src('app/js/**/*')
	.pipe(gulp.dest('dist/js'));

	var buildHtml = gulp.src('app/*.html')
	.pipe(gulp.dest('dist'));
	
});
