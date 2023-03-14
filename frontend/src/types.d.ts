export interface ChatMessage {
	x: number;
	y: number;
}

export interface IncomingMessage {
	type: string;
	payload: ChatMessage;
}
