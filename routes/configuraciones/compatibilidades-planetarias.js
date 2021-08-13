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
        check('configAspectos.*.aspecto','El aspecto es necesario').not().isEmpty(),
        check('configAspectos.*.grados.*.grado','El grado del aspecto es necesario').not().isEmpty(),
        check('configAspectos.*.orbe','El orbe es necesaria').not().isEmpty(),
        check('configAspectos.*.puntosPorGrado','Los puntos por grado son necesarios').not().isEmpty(),
        validarCampos
    ], 
    crearCompatibilidadPlanetaria 
);

router.put( '/:id',
    [
        validarJWT,
        check('nombre','El nombre de la compatibilidad planetaria es necesaria').not().isEmpty(),
        check('descripcion','La descripción de la compatibilidad planetaria es necesaria').not().isEmpty(),
        check('configAspectos.*.aspecto','El aspecto es necesario').not().isEmpty(),
        check('configAspectos.*.grados.*.grado','El grado del aspecto es necesario').not().isEmpty(),
        check('configAspectos.*.orbe','El orbe es necesaria').not().isEmpty(),
        check('configAspectos.*.puntosPorGrado','Los puntos por grado son necesarios').not().isEmpty(),
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



