import 'source-map-support/register'

import express from 'express'

export const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.send("Hello World!")
});

app.listen(port, () => {
    console.log(`🚀 Server started at http://localhost:${port}`);
});
