import express from 'express';
import fs from 'fs';
import path from 'path';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3008;
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve main page with cookie logic
app.get('/', (req, res) => {
  if (req.cookies.username) {
    res.send(`
      <h1>Welcome back, ${req.cookies.username}!</h1>
      <a href="/clear-cookie">Log out</a>
      <script>
        setTimeout(() => window.location.href = '/public/index.html', 2000);
      </script>
    `);
  } else {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

// Registration route
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Save registration and set cookie
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { name, email, password: hashedPassword };
  
    const filePath = path.join(__dirname, 'data', 'users.json');
    const users = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    users.push(newUser);
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
  
    res.cookie('username', name, { maxAge: 24 * 60 * 60 * 1000 });
    res.json({ message: `Welcome, ${name}! You are now registered.` });
  });
  

// Clear cookie
app.get('/clear-cookie', (req, res) => {
  res.clearCookie('username');
  res.redirect('/');
});
app.get('/medicines', (req, res) => {
    const medsPath = path.join(__dirname, 'data', 'medicines.json');
    const data = fs.readFileSync(medsPath, 'utf8');
    res.json(JSON.parse(data));
  });
  
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
