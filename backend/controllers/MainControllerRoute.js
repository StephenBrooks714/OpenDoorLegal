const home = (req, res) => {
    res.render("index", {
        title: "Home page for the client webapp"
    })
}



module.exports = {
    home
}