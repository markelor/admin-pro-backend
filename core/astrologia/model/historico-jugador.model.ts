
import { IAspectos } from "./aspectos.model";
import { IEstadoPlanetas } from "./estado-planetas.model";

interface IHistoricoJugador {
    planetasNatal: IEstadoPlanetas;
    aspectosNatal:IAspectos;
    transitos:{
      partida:IPartida;
      planetasPartida: IEstadoPlanetas;
      aspectosPartida: IAspectos;
    }[]
}
export { IHistoricoJugador };