
const fs = require('fs');
const jugadoresQuerys = require("../querys/mantenimientos/jugadores");
const deportesQuerys = require("../querys/mantenimientos/deportes");
const usuariosQuerys = require("../querys/mantenimientos/usuarios");
const borrarImagen = ( path ) => {
    if ( fs.existsSync( path ) ) {
        // borrar la imagen anterior
        fs.unlinkSync( path );
    }
}

const actualizarImagen = async(tipo, id, nombreArchivo) => {

    let pathViejo = '';
    
    switch( tipo ) {
        case 'jugadores':
            const jugador = await jugadoresQuerys.getJugadorPorIdQuery(id);
            if ( !jugador ) {
                console.log('No es un jugador por id');
                return false;
            }

            pathViejo = `./uploads/jugadores/${ jugador.img }`;
            borrarImagen( pathViejo );

            jugador.img = nombreArchivo;
            await jugadoresQuerys.guardarJugadorQuery(jugador);
            return true;

        break;
        
        case 'deportes':
            const deporte = await deportesQuerys.getDeportePorIdQuery(id);;
            if ( !deporte ) {
                console.log('No es un deporte por id');
                return false;
            }

            pathViejo = `./uploads/deportes/${ deporte.img }`;
            borrarImagen( pathViejo );

            deporte.img = nombreArchivo;
            await deportesQuerys.guardarDeporteQuery(deporte);
            return true;

        break;
        
        case 'usuarios':

            const usuario = await usuariosQuerys.getUsuarioPorIdQuery(id);
            if ( !usuario ) {
                console.log('No es un usuario por id');
                return false;
            }

            pathViejo = `./uploads/deportes/${ usuario.img }`;
            borrarImagen( pathViejo );

            usuario.img = nombreArchivo;
            await usuariosQuerys.guardarUsuarioQuery(usuario);
            return true;

        break;
    }
}

module.exports = { 
    actualizarImagen
}
