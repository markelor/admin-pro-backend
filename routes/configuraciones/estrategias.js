/*
    Compatibilidades planetarias
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
        check('cuerposFirmamentoNatal','El cuerpos firmamento natal es necesario').not().isEmpty(),
        check('cuerposFirmamentoTransitos','El  cuerpos firmamento transitos es necesario').not().isEmpty(),
        check('compatibilidadPlanetaria','La compatibilidad planetaria es necesaria').not().isEmpty(),
        check('relacionPlanetaria','La relacion planetaria es necesaria').not().isEmpty(),
        validarCampos
    ], 
    crearEstrategia 
);

router.put( '/:id',
    [
        validarJWT,
        check('nombre','El nombre de la compatibilidad planetaria es necesaria').not().isEmpty(),
        check('descripcion','La descripción de la compatibilidad planetaria es necesaria').not().isEmpty(),
        check('cuerposFirmamentoNatal','El cuerpos firmamento natal es necesario').not().isEmpty(),
        check('cuerposFirmamentoTransitos','El  cuerpos firmamento transitos es necesario').not().isEmpty(),
        check('compatibilidadPlanetaria','La compatibilidad planetaria es necesaria').not().isEmpty(),
        check('relacionPlanetaria','La relacion planetaria es necesaria').not().isEmpty(),
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



