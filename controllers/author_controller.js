// GET /author
exports.author = function(req, res) {
  	res.render('author', {encabezado: 'Créditos', errors:[]});
};
