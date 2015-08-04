// definición modelo de quiz

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Quiz',
  { pregunta: {
    type: DataTypes.STRING,
    validate: { notEmpty: { msg: "-> Falta Pregunta" }}
    },
    respuesta: {
      type: DataTypes.STRING,
      validate: { notEmpty: { msg: "-> Falta Respuesta" }}
    },
    tema: {
       type: DataTypes.ENUM('Otro', 'Humanidades', 'Ocio', 'Ciencia', 'Tecnologia', 'Geografia'),
       validate: { notEmpty: { msg: "-> Falta categoria" } }
     }
  }
);
}
