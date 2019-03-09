module.exports = function(mongoose) {
    mongoose.set('useCreateIndex', true)
    mongoose.connect('mongodb://admin:admin123@ds041831.mlab.com:41831/nba_app', {useNewUrlParser: true});
}
