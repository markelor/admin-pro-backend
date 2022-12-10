
const ficheroSignos = require("../datos-json/signos.json");
const Signo=require("./signo.model").Signo;
const Casa=require("./casa.model").Casa;
 class Planeta {
  nombre;
  abreviatura;
  grados;
  signo;
  casa;
  retrogrado;
  deserializar(input) {
    this.nombre = input.nombre;
    this.abreviatura = input.abreviatura;
    this.grados = input.grados;
    this.signo = new Signo().deserializar(ficheroSignos);

    this.casa = new Casa();
    this.casa.puntos=0;
    this.retrogrado = input.retrogrado;
    return this;
  }
}
module.exports = {
  Planeta
};

