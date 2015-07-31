var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.find(quizId).then(
		function(quiz) {
			if(quiz) {
				req.quiz = quiz;
				next();
			} else { next(new Error('No existe quizId=' + quizId)); }
		}
	).catch(function(error) { next(error); });
};

// GET /quizes
exports.index = function(req, res) {
	var txtbuscdo = req.query.search;
if(typeof txtbuscdo !== 'undefined') { //GET /quizes?search=texto_a_buscar
	var search = "%" + txtbuscdo.replace(/ /, "%") + "%";
	models.Quiz.findAll({where: ["pregunta like ?", search]}).then(function(quizes) {
		res.render('quizes/index.ejs', {quizes: quizes});
	})
} else { // GET /quizes
	models.Quiz.findAll().then(function(quizes) {
		var search = "nada";
		res.render('quizes/index.ejs', {quizes: quizes});
	})
}
	/* funcion vieja
	models.Quiz.findAll().then(function(quizes) {
		res.render('quizes/index.ejs', {quizes: quizes});
	}
).catch(function(error) {next(error);})*/
};

// GET /quizes/:id
exports.show = function(req, res) {
	models.Quiz.find(req.params.quizId).then(function(quiz) {
		res.render('quizes/show', {quiz: req.quiz});
	})
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
	var resultado = 'Incorrecto';
	answer = req.query.respuesta.replace(/^[a-z]/, function(m) {
													 return m.toUpperCase()
												   });

	if(answer === req.quiz.respuesta) {
		resultado = 'Correcto';
	}
	res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado });
};
