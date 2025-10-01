import { config } from "dotenv";
import app from "./app";

config();

const PORT = process.env.NEXT_PUBLIC_PORT || 3000;
/*
// Configuración para servir el frontend en producción
if (process.env.NODE_ENV === "production") {
  app.use(express.static(join(__dirname, "../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(join(__dirname, "../client/build", "index.html"));
  });
}*/

app.get("/test", (req: any, res: any) => res.send(`mongo urii: ${process.env.NEXT_PUBLIC_MONGODB_URI}`));

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});