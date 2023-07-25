#!/usr/bin/env node

/**
 * Module dependencies.
 */

import * as http from "http";
import * as yargs from "yargs";
import app from "../app";

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(yargs.argv.PORT  || yargs.argv._[0]);
app.set("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const portNumber = parseInt(val, 10);

  if (isNaN(portNumber)) {
    // named pipe
    return val;
  }

  if (portNumber >= 0) {
    // port number
    return portNumber;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string"
    ? "Pipe " + port
    : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
      case "EACCES":
        // TODO implement logger
        // logger.error(bind + " requires elevated privileges");
        process.exit(1);
        break;
      case "EADDRINUSE":
        // TODO implement logger
        // logger.error(bind + " is already in use");
        process.exit(1);
        break;
      default:
        throw error;
  }
}
