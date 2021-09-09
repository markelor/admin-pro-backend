/*
    Partidos
    ruta: '/api/partido'
*/
const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../../middlewares/validar-campos");

const { validarJWT } = require("../../middlewares/validar-jwt");

const { getPartidos } = require("../../controllers/mantenimientos/partidos");

const router = Router();

router.get("/", validarJWT, getPartidos);


module.exports = router;
