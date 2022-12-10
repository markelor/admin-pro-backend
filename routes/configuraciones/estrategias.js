/*
    Historico partido
    ruta: '/api/estrategia'
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../../middlewares/validar-campos');

const { validarJWT } = require('../../middlewares/validar-jwt');

const {
    getEstrategias,
    crearEstrategia,
    actualizarEstrategia,
    borrarEstrategia,
    getEstrategiaById
} = require('../../controllers/configuraciones/estrategias')


const router = Router();

router.get( '/', validarJWT, getEstrategias );

router.post( '/',
    [
        validarJWT,
        check('nombre','El nombre de la compatibilidad planetaria es necesaria').not().isEmpty(),
        check('descripcion','La descripción de la compatibilidad planetaria es necesaria').not().isEmpty(),
        check('cuerposFirmamentoNatal','Los cuerpos firmamento natal son necesarios').not().isEmpty(),
        check('cuerposFirmamentoTransitos','Los cuerpos firmamento transitos son necesario').not().isEmpty(),
        check('compatibilidadesPlanetarias','Las compatibilidades planetaria son necesarias').not().isEmpty(),
        check('relacionesPlanetarias','Las relaciones planetaria son necesarias').not().isEmpty(),
        validarCampos
    ], 
    crearEstrategia 
);

router.put( '/:id',
    [
        validarJWT,
        check('nombre','El nombre de la compatibilidad planetaria es necesaria').not().isEmpty(),
        check('descripcion','La descripción de la compatibilidad planetaria es necesaria').not().isEmpty(),
        check('cuerposFirmamentoNatal','Los cuerpos firmamento natal son necesarios').not().isEmpty(),
        check('cuerposFirmamentoTransitos','Los cuerpos firmamento transitos son necesario').not().isEmpty(),
        check('compatibilidadesPlanetarias','Las compatibilidades planetaria son necesarias').not().isEmpty(),
        check('relacionesPlanetarias','Las relaciones planetaria son necesarias').not().isEmpty(),
        validarCampos
    ],
    actualizarEstrategia
);

router.delete( '/:id',
    validarJWT,
    borrarEstrategia
);

router.get( '/:id',
    validarJWT,
    getEstrategiaById
);



module.exports = router;



