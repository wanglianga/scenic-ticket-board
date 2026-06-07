import preprocess from 'svelte-preprocess';

export default {
  preprocess: preprocess({
    typescript: true,
  }),
  compilerOptions: {
    cssHash: ({ hash, css }) => `svelte-${hash(css)}`,
  }
};
