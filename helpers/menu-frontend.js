const getMenuFrontEnd = (role = "USER_ROLE") => {
  const menu = [
    {
      titulo: "Dashboard",
      icono: "mdi mdi-gauge",
      submenu: [
        { titulo: "Main", url: "/" },
        { titulo: "Gráficas", url: "grafica1" },
        { titulo: "rxjs", url: "rxjs" },
        { titulo: "Promesas", url: "promesas" },
        { titulo: "ProgressBar", url: "progress" },
      ],
    },

    {
      titulo: "Mantenimientos",
      icono: "mdi mdi-folder-lock-open",
      submenu: [
        { titulo: "Deportes", url: "deportes" },
        { titulo: "Jugadores", url: "jugadores" },
        { titulo: "Partidos", url: "partidos" },
        { titulo: "Cuerpos celestes", url: "cuerpos-celestes" },
      ],
    },
    {
      titulo: "Configuraciones",
      icono: "mdi mdi-folder-lock-open",
      submenu: [
        { titulo: "Relaciones planetarias", url: "relaciones-planetarias" },
        {
          titulo: "Compatibilidades planetarias",
          url: "compatibilidades-planetarias",
        },
        { titulo: "Cuerpos celestes", url: "cuerpos-celestes" },
      ],
    },
  ];

  if (role === "ADMIN_ROLE") {
    menu[1].submenu.unshift({ titulo: "Usuarios", url: "usuarios" });
  }

  return menu;
};

module.exports = {
  getMenuFrontEnd,
};
