const Usuario = require('../models/usuario');
const fs = require('fs');

const Jugador = require('../models/jugador');
const Deporte = require('../models/deporte');

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
            const jugador = await Jugador.findById(id);
            if ( !jugador ) {
                console.log('No es un jugador por id');
                return false;
            }

            pathViejo = `./uploads/jugadores/${ jugador.img }`;
            borrarImagen( pathViejo );

            jugador.img = nombreArchivo;
            await jugador.save();
            return true;

        break;
        
        case 'deportes':
            const deporte = await Deporte.findById(id);
            if ( !deporte ) {
                console.log('No es un deporte por id');
                return false;
            }

            pathViejo = `./uploads/deportes/${ deporte.img }`;
            borrarImagen( pathViejo );

            deporte.img = nombreArchivo;
            await deporte.save();
            return true;

        break;
        
        case 'usuarios':

            const usuario = await Usuario.findById(id);
            if ( !usuario ) {
                console.log('No es un usuario por id');
                return false;
            }

            pathViejo = `./uploads/deportes/${ usuario.img }`;
            borrarImagen( pathViejo );

            usuario.img = nombreArchivo;
            await usuario.save();
            return true;

        break;
    }


}



module.exports = { 
    actualizarImagen
}
