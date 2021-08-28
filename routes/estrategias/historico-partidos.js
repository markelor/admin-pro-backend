/*
    Historico partido
    ruta: '/api/historico-partido'
*/
const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../../middlewares/validar-campos");

const { validarJWT } = require("../../middlewares/validar-jwt");

const {
  getHistoricoPartidos,
  crearHistoricoPartido,
  actualizarHistoricoPartido,
  borrarHistoricoPartido,
  getHistoricoPartidoById,
} = require("../../controllers/estrategias/historico-partidos");

const router = Router();
//router.get( '/', validarJWT, getHistoricoPartidos );
router.post("/", validarJWT, getHistoricoPartidos);

/*router.post( '/',
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
    crearHistoricoPartido 
);*/

router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre de la compatibilidad planetaria es necesaria")
      .not()
      .isEmpty(),
    check(
      "descripcion",
      "La descripción de la compatibilidad planetaria es necesaria"
    )
      .not()
      .isEmpty(),
    check("cuerposFirmamentoNatal", "El cuerpos firmamento natal es necesario")
      .not()
      .isEmpty(),
    check(
      "cuerposFirmamentoTransitos",
      "El  cuerpos firmamento transitos es necesario"
    )
      .not()
      .isEmpty(),
    check(
      "compatibilidadPlanetaria",
      "La compatibilidad planetaria es necesaria"
    )
      .not()
      .isEmpty(),
    check("relacionPlanetaria", "La relacion planetaria es necesaria")
      .not()
      .isEmpty(),
    validarCampos,
  ],
  actualizarHistoricoPartido
);

router.delete("/:id", validarJWT, borrarHistoricoPartido);

router.get("/:id", validarJWT, getHistoricoPartidoById);

module.exports = router;
