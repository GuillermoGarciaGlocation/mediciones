const express = require('express');
const path = require('path');
const app = express();

// app.use(express.static(path.join(__dirname, '..','public')));

app.use('/', express.static('public'));

// Serve the index.html file (or any other default file you prefer)
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

app.get('/', (req, res) => {
  res.send('Hello World!')
})


// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});