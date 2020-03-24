import replace from '@rollup/plugin-replace';
import babel from 'rollup-plugin-babel';

export default [true, false].map((nodeBuild) => ({
  input: 'src/index.js',
  plugins: [
    replace({ __NODE_BUILD__: JSON.stringify(nodeBuild) }),
    babel({ exclude: 'node_modules/**' }),
  ],
  onwarn: (e) => {
    throw new Error(e);
  },
  output: nodeBuild
    ? {
        file: 'dist/build-node.js',
        format: 'cjs',
      }
    : {
        name: 'IsGitHub',
        file: 'dist/build-web.js',
        format: 'umd',
      },
}));
