var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.findById(quizId).then(
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
		res.render('quizes/index.ejs', {quizes: quizes, errors:[]});
	})
} else {
	models.Quiz.findAll().then(function(quizes) {
		var search = "nada";
		res.render('quizes/index.ejs', {quizes: quizes, errors:[]});
	})
}
};

// GET /quizes/:id
exports.show = function(req, res) {
	models.Quiz.find(req.params.quizId).then(function(quiz) {
		res.render('quizes/show', {quiz: req.quiz,  errors:[]});
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
	res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado, errors:[] });
};

// GET quizes/:id/edit
exports.edit = function (req, res) {
  var quiz = req.quiz; // autoload de instancia de quiz
  res.render('quizes/edit', {quiz:quiz, errors: []});
};


// GET quizes/new
exports.new = function (req, res) {
  var quiz = models.Quiz.build (
      {pregunta: "Pregunta", respuesta: "Respuesta"}
  );
  res.render('quizes/new', {quiz: quiz, errors:[]});
};



// POST quizes/create
exports.create = function (req, res) {
  var quiz = models.Quiz.build(req.body.quiz);

	quiz.validate().then( function(err) {
    if (err) {
      res.render('quizes/new', {quiz: quiz, errors: err.errors});
    } else { // guarda en DB campos pregunta y respuesta de quiz
  		quiz.save({fields: ["pregunta", "respuesta"]})
			.then(function(){ res.redirect('/quizes')})
		}
  }
);
};


// PUT quizes/:id
exports.update = function (req, res) {
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;

  req.quiz
  .validate()
  .then(
		function(err) {
    if (err) {
      res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
    } else {
      req.quiz
      .save({fields: ["pregunta", "respuesta"]})
      .then(function(){
        res.redirect('/quizes'); });
    }
  }
);
};
