const mix = require('laravel-mix');

require('./nova-mix');

mix
	.setPublicPath('dist')
	.js('resource/js/field.js', 'js')
	.vue({ version: 3 })
	.css('resources/sass/field.scss', 'css')
	.nova('vendor/package');
