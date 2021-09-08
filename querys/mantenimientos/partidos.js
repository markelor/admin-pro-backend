const { response } = require("express");
var request = require("request")

const Partido = require("../../models/mantenimientos/partido");

const getPartidos = async (req, res = response) => {
  const partidos = await Partido.find()
    .populate("usuario", "nombre img")
    .populate("deporte", "nombre img");

  res.json({
    ok: true,
    partidos,
  });
};

const crearPartidos = async (req, res = response) => {
  const uid = req.uid;
  const deporte=req.body.deporte;

  var url = "http://127.0.0.1:5000/";
  request(
    {
      url: url,
      json: true,
    },
    async function (error, resp, body) {
      if (!error && resp.statusCode === 200) {
        body[0].finalizados.forEach((partidoFinalizado) => {
          partidoFinalizado.usuario = uid;
          partidoFinalizado.deporte = deporte;
        });
        try {
          const partidoDB = await Partido.insertMany(body[0].finalizados);

          res.json({
            ok: true,
            partido: partidoDB,
          });
        } catch (err) {
          res.status(500).json({
            ok: false,
            msg: "Hable con el administrador",
          });
        }
      }
    }
  );
};

module.exports = {
  getPartidos,
  crearPartidos,
};
