
  const Signo=require("./signo.model").Signo;
  class Signos  {
    signos=[];
    deserializar(input) {
      input.signos.forEach((signo) => {
        this.signos.push( new Signo().deserializar(signo))
       });
      return this;
    }
  }
  
  module.exports = {
    Signos
  };
  
  