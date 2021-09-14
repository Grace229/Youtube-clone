module.exports = {
home: function(req, res) {
    res.render('default/index', {pageTitle: "Home"})
}
}