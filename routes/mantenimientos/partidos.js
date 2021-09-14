/*
    Partidos
    ruta: '/api/partidos'
*/
const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../../middlewares/validar-campos");

const { validarJWT } = require("../../middlewares/validar-jwt");

const { getPartidosGuardados,getPartidosHoy } = require("../../controllers/mantenimientos/partidos");

const router = Router();

router.get("/", validarJWT, getPartidosGuardados);
router.post("/hoy", validarJWT, getPartidosHoy);


module.exports = router;
