import tailwindcssPlugin from '@tailwindcss/postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

module.exports = {
  plugins: [
    tailwindcssPlugin(),
    tailwindcss,
    autoprefixer,
  ],
};
  