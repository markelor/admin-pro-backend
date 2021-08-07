/*
    Relaciones planetarias
    ruta: '/api/relacionPlanetaria'
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt');

const {
    getRelacionesPlanetarias,
    crearRelacionPlanetaria,
    actualizarRelacionPlanetaria,
    borrarRelacionPlanetaria,
    getRelacionPlanetariaById
} = require('../controllers/relaciones-planetarias')


const router = Router();

router.get( '/', validarJWT, getRelacionesPlanetarias );

router.post( '/',
    [
        validarJWT,
        check('nombre','El nombre de la relacion planetaria es necesaria').not().isEmpty(),
        check('descripcion','La descripción de la relacion planetaria es necesaria').not().isEmpty(),
        check('configAspectos.*.aspecto','El aspecto es necesario').not().isEmpty(),
        check('configAspectos.*.grados.*.grado','El grado del aspecto es necesario').not().isEmpty(),
        check('configAspectos.*.orbe','El orbe es necesaria').not().isEmpty(),
        check('configAspectos.*.puntosPorGrado','Los puntos por grado son necesarios').not().isEmpty(),
        validarCampos
    ], 
    crearRelacionPlanetaria 
);

router.put( '/:id',
    [
        validarJWT,
        check('nombre','El nombre de la relacion planetaria es necesaria').not().isEmpty(),
        check('descripcion','La descripción de la relacion planetaria es necesaria').not().isEmpty(),
        check('configAspectos.*.aspecto','El aspecto es necesario').not().isEmpty(),
        check('configAspectos.*.grados.*.grado','El grado del aspecto es necesario').not().isEmpty(),
        check('configAspectos.*.orbe','El orbe es necesaria').not().isEmpty(),
        check('configAspectos.*.puntosPorGrado','Los puntos por grado son necesarios').not().isEmpty(),
        validarCampos
    ],
    actualizarRelacionPlanetaria
);

router.delete( '/:id',
    validarJWT,
    borrarRelacionPlanetaria
);

router.get( '/:id',
    validarJWT,
    getRelacionPlanetariaById
);



module.exports = router;



