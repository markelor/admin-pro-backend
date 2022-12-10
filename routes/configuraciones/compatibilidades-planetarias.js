/*
    Compatibilidades planetarias
    ruta: '/api/compatibilidadPlanetaria'
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../../middlewares/validar-campos');

const { validarJWT } = require('../../middlewares/validar-jwt');

const {
    getCompatibilidadesPlanetarias,
    crearCompatibilidadPlanetaria,
    actualizarCompatibilidadPlanetaria,
    borrarCompatibilidadPlanetaria,
    getCompatibilidadPlanetariaById
} = require('../../controllers/configuraciones/compatibilidades-planetarias')


const router = Router();

router.get( '/', validarJWT, getCompatibilidadesPlanetarias );

router.post( '/',
    [
        validarJWT,
        check('nombre','El nombre de la compatibilidad planetaria es necesaria').not().isEmpty(),
        check('descripcion','La descripción de la compatibilidad planetaria es necesaria').not().isEmpty(),
        check('configArmonias.*.armonia','La armonia es necesaria').not().isEmpty(),
        check('configArmonias.*.cuerpoCeleste1','El cuerpo celeste1 es necesario').not().isEmpty(),
        check('configArmonias.*.cuerpoCeleste2','El cuerpo celeste 2 es necesario').not().isEmpty(),
        check('configArmonias.*.puntos','Los puntos son necesarios').not().isEmpty(),
        validarCampos
        
    ], 
    crearCompatibilidadPlanetaria 
);

router.put( '/:id',
    [
        validarJWT,
        check('nombre','El nombre de la compatibilidad planetaria es necesaria').not().isEmpty(),
        check('descripcion','La descripción de la compatibilidad planetaria es necesaria').not().isEmpty(),
        check('configArmonias.*.armonia','La armonia es necesaria').not().isEmpty(),
        check('configArmonias.*.cuerpoCeleste1','El cuerpo celeste1 es necesario').not().isEmpty(),
        check('configArmonias.*.cuerpoCeleste2','El cuerpo celeste 2 es necesario').not().isEmpty(),
        check('configArmonias.*.puntos','Los puntos son necesarios').not().isEmpty(),
        validarCampos
    ],
    actualizarCompatibilidadPlanetaria
);

router.delete( '/:id',
    validarJWT,
    borrarCompatibilidadPlanetaria
);

router.get( '/:id',
    validarJWT,
    getCompatibilidadPlanetariaById
);



module.exports = router;



