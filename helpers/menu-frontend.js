const getMenuFrontEnd = (role = "USER_ROLE") => {
  const menu = [
    {
      titulo: "Dashboard",
      icono: "mdi mdi-gauge",
      submenu: [
        { titulo: "Main", url: "/" },
        { titulo: "Gráficas", url: "/dashboard/grafica1" },
        { titulo: "rxjs", url: "/dashboard/rxjs" },
        { titulo: "Promesas", url: "/dashboard/promesas" },
        { titulo: "ProgressBar", url: "/dashboard/progress" },
      ],
    },

    {
      titulo: "Mantenimientos",
      icono: "mdi mdi-folder-lock-open",
      submenu: [
        { titulo: "Deportes", url: "/mantenimiento/deportes" },
        { titulo: "Jugadores", url: "/mantenimiento/jugadores" },
        { titulo: "Partidos", url: "/mantenimiento/partidos" },
        { titulo: "Cuerpos celestes", url: "/mantenimiento/cuerpos-celestes" },
      ],
    },
    {
      titulo: "Configuraciones",
      icono: "mdi mdi-folder-lock-open",
      submenu: [
        { titulo: "Relaciones planetarias", url: "/configuracion/relaciones-planetarias" },
        {
          titulo: "Compatibilidades planetarias",
          url: "/configuracion/compatibilidades-planetarias",
        },
        { titulo: "Cuerpos celestes", url: "/configuracion/cuerpos-celestes" },
      ],
    },
  ];

  if (role === "ADMIN_ROLE") {
    menu[1].submenu.unshift({ titulo: "Usuarios", url: "/mantenimiento/usuarios" });
  }

  return menu;
};

module.exports = {
  getMenuFrontEnd,
};
