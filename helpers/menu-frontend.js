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
        { titulo: "Deportes", url: "/mantenimientos/deportes" },
        { titulo: "Jugadores", url: "/mantenimientos/jugadores" },
        { titulo: "Partidos", url: "/mantenimientos/partidos" },
        { titulo: "Cuerpos celestes", url: "/mantenimientos/cuerpos-celestes" },
      ],
    },
    {
      titulo: "Configuraciones",
      icono: "mdi mdi-folder-lock-open",
      submenu: [
        { titulo: "Relaciones planetarias", url: "/configuraciones/relaciones-planetarias" },
        {
          titulo: "Compatibilidades planetarias",
          url: "/configuraciones/compatibilidades-planetarias",
        },
        { titulo: "Cuerpos firmamento", url: "/configuraciones/cuerpos-firmamento" },
        { titulo: "Estrategias", url: "/configuraciones/estrategias" }
      ],
    },
    {
      titulo: "Estrategias",
      icono: "mdi mdi-folder-lock-open",
      submenu: [
        { titulo: "Historico Partidos", url: "/estrategias/historico-partidos" },
      ],
    },
  ];

  if (role === "ADMIN_ROLE") {
    menu[1].submenu.unshift({ titulo: "Usuarios", url: "/mantenimientos/usuarios" });
  }

  return menu;
};

module.exports = {
  getMenuFrontEnd,
};
