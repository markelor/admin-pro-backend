/*
    Relaciones planetarias
    ruta: '/api/relacionPlanetaria'
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../../middlewares/validar-campos');

const { validarJWT } = require('../../middlewares/validar-jwt');

const {
    getCuerposCelestes,
    crearCuerpoCeleste,
    actualizarCuerpoCeleste,
    borrarCuerpoCeleste,
    getCuerpoCelesteById
} = require('../../controllers/mantenimientos/cuerpos-celestes')


const router = Router();

router.get( '/', validarJWT, getCuerposCelestes );

router.post( '/',
    [
        validarJWT,
        check('nombre','El nombre es necesario').not().isEmpty(),
        check('abreviatura','La abreviatura es necesaria').not().isEmpty(),
        validarCampos
    ], 
    crearCuerpoCeleste 
);

router.put( '/:id',
    [
        validarJWT,
        check('cuerposCelestes.*.nombre','El nombre es necesario').not().isEmpty(),
        check('cuerposCelestes.*.abreviatura','La abreviatura es necesaria').not().isEmpty(),
        validarCampos
    ],
    actualizarCuerpoCeleste
);

router.delete( '/:id',
    validarJWT,
    borrarCuerpoCeleste
);

router.get( '/:id',
    validarJWT,
    getCuerpoCelesteById
);



module.exports = router;



