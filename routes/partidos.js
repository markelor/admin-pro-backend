/*
    Partidos
    ruta: '/api/partido'
*/
const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");

const { validarJWT } = require("../middlewares/validar-jwt");

const { getPartidos, crearPartidos } = require("../controllers/partidos");

const router = Router();

router.get("/", validarJWT, getPartidos);

router.post(
  "/",
  [
    validarJWT,
    check("deporte", "El deporte es necesario").isMongoId(),
    validarCampos,
  ],
  crearPartidos
);

module.exports = router;
