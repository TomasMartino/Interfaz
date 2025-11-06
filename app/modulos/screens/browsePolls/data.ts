import { Poll } from "./browsePolls";

export const pollsStart: Poll[] = [
  {
    id: 1,
    title: "¿Cuál es tu color favorito?",
    start_time: new Date("2025-10-20T10:00:00"),
    end_time: new Date("2025-10-27T10:00:00"),
    status: "active",
    creator_name: "Fabian",
    creator_id: 1,
  },
  {
    id: 2,
    title: "¿Qué sistema operativo prefieres?",
    start_time: new Date("2025-09-01T09:00:00"),
    end_time: new Date("2025-09-07T09:00:00"),
    status: "closed",
    creator_name: "Lucía",
    creator_id: 2,
  },
  {
    id: 3,
    title: "¿Deberíamos implementar modo oscuro en la app?",
    start_time: new Date("2025-10-15T12:00:00"),
    end_time: new Date("2025-10-25T12:00:00"),
    status: "active",
    creator_name: "Carlos",
    creator_id: 3,
  },
  {
    id: 4,
    title: "¿Qué tipo de gráfico prefieres para visualizar datos?",
    start_time: new Date("2025-08-10T08:00:00"),
    end_time: new Date("2025-08-20T08:00:00"),
    status: "closed",
    creator_name: "María",
    creator_id: 4,
  },
  {
    id: 5,
    title: "¿Cuál debería ser la próxima funcionalidad del sistema?",
    start_time: new Date("2025-10-23T15:00:00"),
    end_time: new Date("2025-11-01T15:00:00"),
    status: "active",
    creator_name: "Julián",
    creator_id: 5,
  },
];