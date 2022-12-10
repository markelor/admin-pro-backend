
/*
    Astrologia
    ruta: '/api/astrologia'
*/
const { Router } = require("express");


const { validarJWT } = require("../middlewares/validar-jwt");

const {
  getCartaNatal,
 // getHistoricoJugador
} = require("../controllers/astrologia");

const router = Router();

router.post("/carta-natal", validarJWT, getCartaNatal);

module.exports = router;




