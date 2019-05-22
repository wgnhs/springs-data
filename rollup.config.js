import html from 'rollup-plugin-html';
import minify from 'rollup-plugin-minify-es';
import babel from 'rollup-plugin-babel';


function buildPlugins({min=false, iife=false}) {
  let result = [];
  result.push(html({
    include: `modules/*.html`,
    htmlMinifierOptions: {
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      conservativeCollapse: true
    }
  }));
  if (min) {
    result.push(minify({
      output: {
        wrap_iife: true
      }
    }));
  }
  if (iife) {
    result.push(babel({
      exclude: 'node_modules/**',
      presets: [['@babel/env', { modules: false }]]
    }));
  }
  return result;
}

function buildConfig({filename='index', min=false, iife=false}) {
  let minifyToken = (min) ? '.min': '';
  let result = {
    input: `${filename}.js`,
    plugins: buildPlugins({min, iife}),
    external: ['@sibley/app-component'],
    output: {
      file: `dist/${filename}${minifyToken}.js`,
      format: 'iife',
      name: 'bundle',
      globals: {
        '@sibley/app-component': 'AppComponent'
      }
    }
  }
  return result;
}


export default [
  buildConfig({iife: true}),
  buildConfig({min: true, iife: true})
];
