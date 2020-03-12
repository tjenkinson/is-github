import babel from 'rollup-plugin-babel';

export default {
  input: 'src/index.js',
  external: ['node-fetch', 'abort-controller'],
  plugins: [babel({ exclude: 'node_modules/**' })],
  output: [
    {
      file: 'dist/build-node.js',
      format: 'cjs'
    },
    {
      name: 'IsGitHub',
      file: 'dist/build-web.js',
      format: 'umd',
      globals: {
        'node-fetch': 'fetch',
        'abort-controller': 'AbortController'
      }
    }
  ]
};
