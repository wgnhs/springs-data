import html from 'rollup-plugin-html';
import minify from 'rollup-plugin-minify-es';
import resolve from 'rollup-plugin-node-resolve';
import filesize from 'rollup-plugin-filesize';

const wcDir = 'modules';
const litDir = 'lit';

function buildPlugins({dir=wcDir, min=false}) {
  let result = [];
  if (wcDir === dir) {
    result.push(html({
      include: `${dir}/*.html`,
      htmlMinifierOptions: {
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        conservativeCollapse: true
      }
    }));
  } else if (litDir === dir) {
    result.push(resolve());
  } else if ('js' === dir) {
    result.push(resolve());
  }

  if (min) {
    result.push(minify({
      output: {
        wrap_iife: true
      }
    }));
  }
  result.push(filesize());
  return result;
}

function buildApp({dir=wcDir, filename='index', min=false, format='umd'}) {
  let minifyToken = (min) ? '.min': '';
  let result = {
    input: `${dir}/${filename}.js`,
    plugins: buildPlugins({dir, min}),
    external: [
      '@sibley/app-component',
      'lit-element'
    ],
    output: {
      file: `dist/${dir}/${filename}${minifyToken}.js`,
      format: format,
      name: filename,
      sourcemap: min,
      globals: {
        '@sibley/app-component': 'AppComponent',
        'lit-element': 'common'
      }
    }
  }
  return result;
}

function buildCommon({dir='js', filename='common', min=false, format='umd'}) {
  let minifyToken = (min) ? '.min': '';
  let result = {
    input: `${dir}/${filename}.js`,
    plugins: buildPlugins({dir, min}),
    output: {
      file: `dist/${dir}/${filename}${minifyToken}.js`,
      format: format,
      name: filename,
      sourcemap: min
    }
  }
  return result;
}


export default [
  buildCommon({}),
  buildApp({}),
  buildApp({min: true}),
  buildApp({dir: litDir}),
  buildApp({dir: litDir, min: true})
];
