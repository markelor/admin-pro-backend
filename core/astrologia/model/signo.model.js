class Tiempo {
  hora;
  min;
  sec;
}
class Signo {
  nombre;
  tiempo;
  puntos;
  deserializar(input) {
    this.nombre = input.nombre;
    this.puntos = 0;
    this.tiempo = new Tiempo();
  
    return this ;
  }
}
module.exports = {
  Signo
};

