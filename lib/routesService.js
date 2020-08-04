function renderHome(req,res) {
    res.render('index',)
}

function renderAbout(req, res) {
    res.render('about')
}

function renderCarrito(req, res) {
    res.render('carrito')
}

module.exports = {
    renderHome,
    renderAbout,
    renderCarrito,
}