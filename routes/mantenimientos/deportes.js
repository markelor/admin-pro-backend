/*
    Deportes
    ruta: '/api/deportes'
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../../middlewares/validar-campos');

const { validarJWT } = require('../../middlewares/validar-jwt');

const {
    getDeportes,
    crearDeporte,
    actualizarDeporte,
    borrarDeporte
} = require('../../controllers/mantenimientos/deportes')


const router = Router();

router.get( '/', getDeportes );

router.post( '/',
    [
        validarJWT,
        check('nombre','El nombre del deporte es necesario').not().isEmpty(),
        validarCampos
    ], 
    crearDeporte 
);

router.put( '/:id',
    [
        validarJWT,
        check('nombre','El nombre del deporte es necesario').not().isEmpty(),
        validarCampos
    ],
    actualizarDeporte
);

router.delete( '/:id',
    validarJWT,
    borrarDeporte
);



module.exports = router;
