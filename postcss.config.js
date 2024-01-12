/*tailwind를 일반 css파일로 빌드하기 위해 postcss config 파일이 필요*/
module.exports = {
  plugins:[
  /*  require('tailwindcss'),
  require('autoprefixer'), */
  {
    tailwindcss: { config: "./tailwind.config.js" },
    autoprefixer:{},
    
  },
],
};