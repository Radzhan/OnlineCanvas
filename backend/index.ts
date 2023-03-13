import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';

const port = 8000;
const app = express();
expressWs(app);
app.use(cors());

const router = express.Router();

router.ws('/chat', (ws, req) => {
	console.log('client connected!');
});

app.use(router);

app.listen(port, () => {
	console.log('Server started on ' + port);
});