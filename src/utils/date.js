export default {
    Currendate: () => {
        const fechaActual = new Date();
        const dia = fechaActual.getDate().toString().padStart(2, '0');
        const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
        const anio = fechaActual.getFullYear().toString();
        return (`${anio}-${mes}-${dia}`)
    },

    CurrendateDay: (dia) => {
        const diasSemana = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sábado"];
        const hoy = new Date().getDay();
        const ayer = new Date().getDay() - 1;
        const manana = new Date().getDay() + 1;

        if (dia === "ayer") {
            return diasSemana[ayer];
        } else if (dia === "manana") {
            return diasSemana[manana];
        } else {
            return diasSemana[hoy];
        }
    },
    DatePastPresent: (FechaInicial) => {
        const fechaInicio = new Date(FechaInicial); // fecha de inicio
        const fechaActual = new Date(); // fecha actual
        const diferencia = fechaActual.getTime() - fechaInicio.getTime(); // diferencia en milisegundos
        const diasPasados = Math.floor(diferencia / (1000 * 60 * 60 * 24)); // convertir milisegundos a días
        return diasPasados;
    },
    getDayOfWeek: (fecha) => {
        // Separamos la fecha en sus componentes (año, mes y día)
        const [year, month, day] = fecha.split('-').map(Number);
        // Creamos un objeto Date con la fecha
        const fechaObj = new Date(year, month - 1, day);
        // Obtenemos el número del día de la semana (0 = Domingo, 1 = Lunes, etc.)
        const diaSemanaNum = fechaObj.getDay();
        // Creamos un arreglo con los nombres de los días de la semana en orden
        const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        // Devolvemos el nombre del día de la semana correspondiente al número obtenido
        return diasSemana[diaSemanaNum];
    },
    convertirFechaUTCaLocal: (fechaUTC) => {
        const fecha = new Date(fechaUTC);
        const anio = fecha.getFullYear();
        const mes = fecha.getMonth() + 1;
        const dia = fecha.getDate();
        // const fechaLocal = new Date(anio, mes - 1, dia);
        const fechaLocal = `${anio}-0${mes}-${dia <= 9 ? '0' : '' }${dia}`;
        // const fechaCorta = fechaLocal.toLocaleDateString();
        return fechaLocal;
    }
};

// export default { currendate };