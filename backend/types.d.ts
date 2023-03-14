import {WebSocket} from 'ws';

export interface ActiveConnections {
	[id: string]: WebSocket
}

export interface Image {
	x : string;
	y: string;
}

export interface IncomingImage {
	type: string;
	payload: Image;
}



