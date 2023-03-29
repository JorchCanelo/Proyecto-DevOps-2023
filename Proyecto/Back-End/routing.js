const routing = 0;


routing.define(){
    app.get('/', (req, res) => {
        res.render('login');
    });

    app.get('/signin', (req, res) => {
        res.render('signin');
    });

}


module.exports = routing;