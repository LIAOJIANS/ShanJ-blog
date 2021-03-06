module.exports = {
  devServer: {
    inline: true,
    proxy: {
      '/api': {
        target: process.env.VUE_APP_API,
        changeOrigin: true,
        pathRewrite: {
          '^/api': `${process.env.NODE_ENV === 'development' ? '/api' : '/'}`
        }
      }
    }
  }
}
