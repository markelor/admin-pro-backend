import { IPlaneta } from "../../model/interno/planeta.model";
import { IAspectos } from "./aspectos.model";
interface ICarta {
    planetasNatal:IPlaneta[];
    aspectos:IAspectos;
  }
  export { ICarta };