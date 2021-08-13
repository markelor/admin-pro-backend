require("dotenv").config();
var request = require("request");
const path = require("path");

const { spawn } = require("child_process");

const express = require("express");
const cors = require("cors");
const schedule = require("node-schedule");

const Partido = require("./models/mantenimientos/partido");
const { dbConnection } = require("./database/config");

// Crear el servidor de express
const app = express();

// Configurar CORS
app.use(cors());

// Lectura y parseo del body
app.use(express.json());

// Base de datos
dbConnection();

// Directorio público
app.use(express.static("public"));

// Rutas
app.use("/api/usuarios", require("./routes/mantenimientos/usuarios"));
app.use("/api/deportes", require("./routes/mantenimientos/deportes"));
app.use("/api/jugadores", require("./routes/mantenimientos/jugadores"));
app.use("/api/partidos", require("./routes/mantenimientos/partidos"));
app.use("/api/cuerpos-celestes", require("./routes/mantenimientos/cuerpos-celestes"));
app.use("/api/astrologia", require("./routes/astrologia"));

app.use("/api/config-relaciones-planetarias", require("./routes/configuraciones/relaciones-planetarias"));
app.use("/api/config-compatibilidades-planetarias", require("./routes/configuraciones/compatibilidades-planetarias"));
app.use("/api/todo", require("./routes/busquedas"));
app.use("/api/login", require("./routes/auth"));
app.use("/api/upload", require("./routes/uploads"));

// Lo último
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public/index.html"));
});

app.listen(process.env.PORT, () => {
  console.log("Servidor corriendo en puerto " + process.env.PORT);
});

/*schedule.scheduleJob("0 50 21 * * *", () => {
  var url = "http://localhost:5001";
  request(
    {
      url: url,
      json: true,
    },
    async function (error, resp, body) {
      if (!error && resp.statusCode === 200 && body[0].finalizados.length) {
        body[0].finalizados.forEach((partidoFinalizado) => {
          partidoFinalizado.usuario = "60e5a0a8f2f00c1eb4ff961c";
          partidoFinalizado.deporte = "60e5a0eaf2f00c1eb4ff961d";
        });
        try {
          await Partido.insertMany(body[0].finalizados);
        } catch (err) {
          console.log("error insert partidos in DB");
          console.log(error);
        }
      } else {
        console.log("error get partidos scrapping");
      }
    }
  );
});*/

/* 
Basic mongo dump and restore commands, they contain more options you can have a look at man page for both of them.
1. mongodump --db=rbac_tutorial --archive=./rbac.gzip --gzip
2. mongorestore --db=rbac_tutorial --archive=./rbac.gzip --gzip
Using mongodump - without any args:
  will dump each and every db into a folder called "dump" in the directory from where it was executed.
Using mongorestore - without any args:
  will try to restore every database from "dump" folder in current directory, if "dump" folder does not exist then it will simply fail.
*/

// Scheduling the backup every days (using node-cron)

/*schedule.scheduleJob("0 58 21 * * *", () => backupMongoDB());

const backupMongoDB = () => {
  const ARCHIVE_PATH = path.join(
    __dirname,
    "public",
    `jugadores-${new Date().toISOString().split("T")[0]}.gzip`
  );
  const child = spawn("mongodump", [
    "--forceTableScan",
    `--uri=${process.env.DB_CNN}`,
    `--archive=${ARCHIVE_PATH}`,
    "--gzip",
  ]);

  child.stdout.on("data", (data) => {
    console.log("stdout:\n", data);
  });
  child.stderr.on("data", (data) => {
    console.log("stderr:\n", Buffer.from(data).toString());
  });
  child.on("error", (error) => {
    console.log("error:\n", error);
  });
  child.on("exit", (code, signal) => {
    if (code) console.log("Process exit with code:", code);
    else if (signal) console.log("Process killed with signal:", signal);
    else console.log("Backup is successfull ✅");
  });
};*/
