/*
    Aspectos
    ruta: '/api/aspecto'
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt');

const {
    getAspectos,
    crearAspecto,
    actualizarAspecto,
    borrarAspecto,
    getAspectoById
} = require('../controllers/aspectos')


const router = Router();

router.get( '/', validarJWT, getAspectos );

router.post( '/',
    [
        validarJWT,
        check('nombre','El nombre del aspecto es necesario').not().isEmpty(),
        check('gradoAspecto','El grado de aspecto esnecesario').not().isEmpty(),
        check('orbe','El grado de aspecto esnecesario').not().isEmpty(),
        check('puntosPorGrado','El grado de aspecto esnecesario').not().isEmpty(),
        validarCampos
    ], 
    crearAspecto 
);

router.put( '/:id',
    [
        validarJWT,
        check('nombre','El nombre del aspecto es necesario').not().isEmpty(),
        check('gradoAspecto','El grado de aspecto esnecesario').not().isEmpty(),
        check('orbe','El grado de aspecto esnecesario').not().isEmpty(),
        check('puntosPorGrado','El grado de aspecto esnecesario').not().isEmpty(),
        validarCampos
    ],
    actualizarAspecto
);

router.delete( '/:id',
    validarJWT,
    borrarAspecto
);

router.get( '/:id',
    validarJWT,
    getAspectoById
);



module.exports = router;



