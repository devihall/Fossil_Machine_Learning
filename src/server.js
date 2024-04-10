import express from 'express';
const app = express();
const port = 4000;
import { exec } from 'child_process';

app.use(express.json());

app.post('/execute-script', (req, res) => {
    const { num } = req.body; 

    exec(`bash ./utils/create-json.sh sharks ${num}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send({ status: 'error', message: `Script execution failed: ${error.message}` });
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);

        res.send({ status: 'success', output: stdout });
    });
});

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});