import { config } from "dotenv";
import app from "./src/app";

config();

const PORT = process.env.NEXT_PUBLIC_PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
