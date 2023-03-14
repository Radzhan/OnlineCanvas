import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import {ActiveConnections, IncomingImage} from "./types";

const port = 8000;
const app = express();
expressWs(app);
app.use(cors());

const router = express.Router();

const activeConnections: ActiveConnections = {};

router.ws('/dask',  (ws, req) => {
	const id = crypto.randomUUID();
	activeConnections[id] = ws;

	ws.on('message', (msg) => {
		const decodedMessage = JSON.parse(msg.toString()) as IncomingImage;

		switch (decodedMessage.type) {
			case 'SEND_IMAGE':
				Object.keys(activeConnections).forEach(connId => {
					const conn = activeConnections[connId];
					conn.send(JSON.stringify({
						type: 'NEW_IMAGE',
						payload: {
							x: decodedMessage.payload.x,
							y: decodedMessage.payload.y,
						}
					}));
				});
				break;
			default:
				console.log('Unknown message type:', decodedMessage.type);
		}
	});

	ws.on('close', () => {
		delete activeConnections[id];
	});
});

app.use(router);

app.listen(port, () => {
	console.log('Server started on ' + port);
});