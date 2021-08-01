const Planeta=require("./planeta.model").Planeta;
class EstadoPlanetas {
  planetas=[];
  totalPuntosCasas;
  totalPuntosSignos;
 
  deserializar(input) {
    this.totalPuntosCasas = 0;
    this.totalPuntosSignos = 0;
    input.planetas.forEach((planeta) => {
      this.planetas.push(new Planeta().deserializar(planeta));
    });

    return this;
  }
  
}


module.exports = {
  EstadoPlanetas
};