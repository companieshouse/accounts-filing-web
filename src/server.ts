import fs from "fs";
import http from "http";
import https from "https";
import { logger }  from "./utils/logger";
import app from "./app";
import { env } from './config';
import { servicePathPrefix } from "./utils/constants/urls";

// start the HTTP server
const httpServer = http.createServer(app);
httpServer.listen(env.PORT, () => {
    console.log(`Server started at: ${env.NODE_HOSTNAME}:${env.PORT}`);
    console.log(`Access at ${env.CHS_URL}${servicePathPrefix}`);
}).on("error", err => {
    logger.error(`${err.name} - HTTP Server error: ${err.message} - ${err.stack}`);
});

// Start the secure server - possibly not required if app is running behind a loadbalancer, with SSL termination
if (env.NODE_SSL_ENABLED === "ON") {
    const privateKey = fs.readFileSync(env.NODE_SSL_PRIVATE_KEY ?? "", "utf8");
    const certificate = fs.readFileSync(env.NODE_SSL_CERTIFICATE ?? "", "utf8");
    const credentials = { key: privateKey, cert: certificate };

    const httpsServer = https.createServer(credentials, app);

    httpsServer.listen(env.NODE_PORT_SSL, () => {
        console.log(`Secure server started at: ${env.NODE_HOSTNAME_SECURE}:${env.NODE_PORT_SSL}`);
    }).on("error", err => {
        logger.error(`${err.name} - HTTPS Server error: ${err.message} - ${err.stack}`);
    });
}

export default httpServer;
