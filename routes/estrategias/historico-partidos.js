/*
    Historico partido
    ruta: '/api/historico-partido'
*/
const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../../middlewares/validar-campos");

const { validarJWT } = require("../../middlewares/validar-jwt");

const {
  getHistoricoPartidosCarta,
  getAprenderCompatibilidades,
} = require("../../controllers/estrategias/historico-partidos");

const router = Router();
//router.get( '/', validarJWT, getHistoricoPartidos );
router.post("/", validarJWT, getHistoricoPartidosCarta);
router.put( "/aprender-compatibilidades/:id",
    [
        validarJWT,
        /*check('compatibilidadesPlanetarias.*.nombre','El nombre de la compatibilidad planetaria es necesaria').not().isEmpty(),
        check('compatibilidadesPlanetarias.*.descripcion','La descripción de la compatibilidad planetaria es necesaria').not().isEmpty(),
        check('compatibilidadesPlanetarias.*.configArmonias.*.armonia','La armonia es necesaria').not().isEmpty(),
        check('compatibilidadesPlanetarias.*.configArmonias.*.cuerpoCeleste1','El cuerpo celeste1 es necesario').not().isEmpty(),
        check('compatibilidadesPlanetarias.*.configArmonias.*.cuerpoCeleste2','El cuerpo celeste 2 es necesario').not().isEmpty(),
        check('compatibilidadesPlanetarias.*.configArmonias.*.puntos','Los puntos son necesarios').not().isEmpty(),*/
        validarCampos
    ],
    
    getAprenderCompatibilidades
);


module.exports = router;
