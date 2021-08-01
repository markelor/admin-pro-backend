/*
    Jugadores
    ruta: '/api/jugadores'
*/
const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");

const { validarJWT } = require("../middlewares/validar-jwt");

const {
  getJugadoresRegistrados,
  getJugadoresNoRegistrados,
  crearJugador,
  actualizarJugador,
  borrarJugador,
  getJugadorById,
} = require("../controllers/jugadores");

const router = Router();

router.get("/registrados", validarJWT, getJugadoresRegistrados);
router.get("/no-registrados", validarJWT, getJugadoresNoRegistrados);

router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre del jugador es necesario").not().isEmpty(),
    check("ciudad", "La ciudad del jugador es necesaria").not().isEmpty(),
    check("latitud", "La latitud de nacimiento es necesaria").not().isEmpty(),
    check("longitud", "La longitud de nacimiento es necesaria").not().isEmpty(),
    check("fechaNacimiento", "La fecha de nacimiento es neseraia")
      .not()
      .isEmpty(),
    check("fiabilidad", "La  fiabilidad de la carta es necesaria")
      .not()
      .isEmpty(),
    check("deporte", "El deporte id debe de ser válido").isMongoId(),
    validarCampos,
  ],
  crearJugador
);

router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre del jugador es necesario").not().isEmpty(),
    check("ciudad", "La ciudad del jugador es necesaria").not().isEmpty(),
    check("latitud", "La latitud de nacimiento es necesaria").not().isEmpty(),
    check("longitud", "La longitud de nacimiento es necesaria").not().isEmpty(),
    check("fechaNacimiento", "La fecha de nacimiento es neseraia")
      .not()
      .isEmpty(),
    check("fiabilidad", "La  fiabilidad de la carta es necesaria")
      .not()
      .isEmpty(),
    check("deporte", "El deporte id debe de ser válido").isMongoId(),
    validarCampos,
  ],
  actualizarJugador
);

router.delete("/:id", validarJWT, borrarJugador);

router.get("/:id", validarJWT, getJugadorById);

module.exports = router;
