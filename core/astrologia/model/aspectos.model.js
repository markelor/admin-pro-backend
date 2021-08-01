
class Aspectos {
  aspectos;
  totalPuntosAspectos;
  totalPuntosCompatibilidad;
  deserializar(input) {
    this.aspectos=input;
    this.totalPuntosAspectos=0;
    this.totalPuntosCompatibilidad=0;
    return this;
  }
}

module.exports = {
  Aspectos
};


