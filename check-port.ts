// check-port.ts
import detect from "detect-port";
import { spawn } from "child_process";
import process from "process";

const port = 5174;

(async () => {
  const availablePort = await detect(port);

  if (availablePort === port) {
    // El puerto está libre → iniciar Vite
    console.log(`✅ El puerto ${port} está libre. Iniciando Vite...`);
    spawn("npm", ["run", "vite-dev"], { stdio: "inherit", shell: true });
  } else {
    // El puerto está ocupado → mostrar mensaje
    console.error(`❌ El puerto ${port} está ocupado. Por favor, desocúpelo para correr la app correctamente.`);
    process.exit(1);
  }
})();
