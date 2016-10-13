const commonJs = require('rollup-plugin-commonjs');
const childProcess = require('child_process');
const gulp = require('gulp');
const nodeResolve = require('rollup-plugin-node-resolve');
const rollup = require('rollup');
const runSequence = require('run-sequence');

gulp.task('build', done => runSequence(
  'task:ngc',
  'task:rollup',
  'task:static',
  done
));

gulp.task('task:ngc', () => {
  childProcess.execSync('./node_modules/.bin/ngc -p tsconfig-esm.json');
});

gulp.task('task:rollup', done => {
  rollup
    .rollup({
      entry: 'tmp/ngc/main-static.js',
      plugins: [
        nodeResolve({jsnext: true, main: true}),
        commonJs({include: 'node_modules/**'})
      ],
    })
    .then(bundle => {
      bundle.write({
        format: 'iife',
        dest: 'tmp/rollup/app.js',
      });
    })
    .then(done, err => console.error(err));
});

gulp.task('task:static', () => gulp
  .src([
    'node_modules/zone.js/dist/zone.js',
    'index.html',
    'tmp/rollup/app.js',
  ])
  .pipe(gulp.dest('dist'))
);