const express = require('express')
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const router = express.Router();
const session = require('express-session');


const app = express()
const database = require('./database')

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.use(session({
  secret: '1234',  // Replace with a strong secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }  // Change to true if using https
}));

// RENDER HOMEPAGE

app.get('/', async (req, res) => {
  try {
      const totalSales = await database.getTotalProfitForToday();
      const productsLowStock = await database.getProductsLowStock(); // Fetch products in low stock from database
      const role = req.session.role; // Get the role from the session

      res.render("index.ejs", { totalSales, productsLowStock, role });
  } catch (error) {
      console.error("Error fetching total sales:", error);
      res.status(500).send("Internal Server Error");
  }
});

// RENDER LOGIN PAGE
const loginRouter = require('./routes/login');
app.use('/login', loginRouter);

// RENDER REGISTER PAGE
const registerRouter = require('./routes/register');
app.use('/register', registerRouter);

// PRODUCTS ROUTES
const productsRoute = require('./routes/products');
app.use('/products', productsRoute);

// INVENTORY ROUTES
const inventoryRoute = require('./routes/inventory');
app.use('/inventory', inventoryRoute);

// SALES ROUTES
const salesRoute = require('./routes/sales');
app.use('/sales', salesRoute);

app.use(express.static("public"))

const port = 8080
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

