module.exports = {
  presets: [
  '@vue/cli-plugin-babel/preset'
  ],
  //  按需加载（强烈推荐） - 降低代码的体积，修改了项目的配置，一定要重启服务器
  plugins: [
    ['import', {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: true
    }, 'vant']
  ]
}
