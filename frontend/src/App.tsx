import React, {useEffect, useRef, useState} from 'react'
import './App.css'
import {ChatMessage, IncomingMessage} from "./types";

function App() {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	let isMouseDown = false;
	const canv = document.querySelector('canvas');
	const ctx = canv!.getContext('2d');

	if (canv) {
		canv.addEventListener('mousedown', () => {
			isMouseDown = true;
		});
		canv.addEventListener('mouseup', () => {
			isMouseDown = false;
		});
		canv.addEventListener('mousemove', (e) => {
			if (isMouseDown && ctx) {
				ctx.beginPath();
				const object = {
					x: e.clientX,
					y: e.clientY,
				};

				if (!ws.current) return;

				ws.current.send(JSON.stringify({
					type: 'SEND_IMAGE',
					payload: object,
				}));
			}
		});
		canv.width = window.innerWidth;
		canv.height = window.innerHeight;
	}


	const ws = useRef<WebSocket | null>(null);

	for (let i = 0; i < messages.length; i++) {
		if (ctx) {
			ctx.lineTo(messages[i].x, messages[i].y);
			ctx.stroke();

			ctx.beginPath();
			ctx.arc(messages[i].x, messages[i].y, 10 , 0, 7)
			ctx.fill();

			ctx.beginPath();
			ctx.moveTo(messages[i].x, messages[i].y);
		}
	}

	useEffect(() => {
		ws.current = new WebSocket('ws://localhost:8000/dask');

		ws.current.onclose = () => console.log("ws closed");

		ws.current.onmessage = event => {
			const decodedMessage = JSON.parse(event.data) as IncomingMessage;

			if (decodedMessage.type === 'NEW_IMAGE') {
				setMessages((messages) => [...messages, decodedMessage.payload]);
			}
		};

		return () => {
			if (ws.current) {
				ws.current.close();
			}
		}
	}, []);


	return (
		<div className="App">
		</div>
	);
}

export default App
