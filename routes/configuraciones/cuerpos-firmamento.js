/*
    Compatibilidades planetarias
    ruta: '/api/cuerpoFirmamento'
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../../middlewares/validar-campos');

const { validarJWT } = require('../../middlewares/validar-jwt');

const {
    getCuerposFirmamento,
    crearCuerpoFirmamento,
    actualizarCuerpoFirmamento,
    borrarCuerpoFirmamento,
    getCuerpoFirmamentoById
} = require('../../controllers/configuraciones/cuerpos-firmamento')


const router = Router();

router.get( '/', validarJWT, getCuerposFirmamento );

router.post( '/',
    [
        validarJWT,
        check('nombre','El nombre del cuerpo firmamento es necesario').not().isEmpty(),
        check('descripcion','La descripción del cuerpo firmamento es necesario').not().isEmpty(),
        check('configCuerposCelestes.*.cuerpoCelesteId','El id de cuerpo celeste es necesario').not().isEmpty(),
        validarCampos
    ], 
    crearCuerpoFirmamento 
);

router.put( '/:id',
    [
        validarJWT,
        check('nombre','El nombre del cuerpo firmamento es necesario').not().isEmpty(),
        check('descripcion','La descripción del cuerpo firmamento es necesario').not().isEmpty(),
        check('configCuerposCelestes.*.cuerpoCelesteId','El id de cuerpo celeste es necesario').not().isEmpty(),
        validarCampos
    ],
    actualizarCuerpoFirmamento
);

router.delete( '/:id',
    validarJWT,
    borrarCuerpoFirmamento
);

router.get( '/:id',
    validarJWT,
    getCuerpoFirmamentoById
);

module.exports = router;



