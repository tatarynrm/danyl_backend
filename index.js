require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const morgan = require("morgan");
const path = require("path");
const errorMiddleware = require("./middlewares/error-middleware");
const { fileURLToPath } = require("url");
const { default: helmet } = require("helmet");
const PORT = process.env.PORT || 8800;
const db = require("./db/db");
const authRouter = require("./router/user");
const deviceRouter = require("./router/device");
const deviceLogRouter = require("./router/device_log");
const cookieParser = require("cookie-parser");
const authMiddlewares = require("./middlewares/auth-middlewares");
const {
  generateRandomNumberOneOrTwo,
} = require("./functions/numbers.generate");

// CONFIGURATION MIDDLEWARES ************************
const app = express();

app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(helmet.crossOriginEmbedderPolicy({ policy: "credentialless" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
// app.use(cors())
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
app.use(
  cors({
    origin: ["https://carriers.ict.lviv.ua", "http://localhost:3000","http://185.233.39.139",'https://vendwater.tech','https://www.vendwater.tech'],
    methods: ["POST", "GET"],
    credentials: true,
  })
);
app.use((req, res, next) => {
  const allowedOrigins = [
    "https://carriers.ict.lviv.ua",
    "http://localhost:3000",
    "http://localhost:3001",
    "https://ictwork.site",
    "http://185.233.39.139",
    "https://www.vendwater.tech",
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Controll-Allow-Origin", origin);
  }
  res.header("Access-Controll-Allow-Methods", "GET,OPTIONS");
  res.header("Access-Controll-Allow-Headers", "Content-Type,Authorization");
  res.header("Access-Controll-Allow-Credentials", true);
  return next();
});
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assests");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use("/auth", authRouter);
app.use("/device", deviceRouter);
app.use("/mainlog", deviceLogRouter);
async function insertData() {
  let success = false;
  let client;
  const updatedDate = new Date();
  const state = {
    water: generateRandomNumberOneOrTwo(),
    money: generateRandomNumberOneOrTwo(),
    device_code: 320404,
    created_at: updatedDate,
  };
  try {
    client = await db.connect(); // Отримання з'єднання з пулу

    const query = `
      INSERT INTO device_state (water_state, money_state,device_code,created_at)
      VALUES ($1, $2,$3,$4);
    `;

    const values = [
      state.water,
      state.money,
      state.device_code,
      state.created_at,
    ];

    await client.query(query, values);
    console.log("Дані успішно вставлені!");
    success = true;
  } catch (error) {
    console.error("Помилка вставки даних:", error);
  } finally {
    try {
      if (client) {
        client.release(); // Повернення з'єднання назад до пулу
        console.log(`З'єднання до бази даних повернуто в пул.`);
      }
    } catch (error) {
      console.error(`Помилка при поверненні з'єднання до пулу:`, error);
    }
    if (!success) {
      console.log("Операція не вдалася.");
    }
  }
}

app.get("/hello", async (req, res) => {
  const interval = 5000; // 5 секунд

  for (let i = 0; i < 100; i++) {
    await new Promise((resolve) => setTimeout(resolve, interval)); // Затримка на 5 секунд

    try {
      await insertData(); // Виклик вашої функції для вставки даних
      console.log("Дані успішно вставлені.");
    } catch (error) {
      console.error("Помилка вставки даних:", error);
    }
  }

  res.send("Записи було успішно вставлено.");
});

app.post("/mainlog/device/:id", async (req, res) => {
  const interval = 5000; // 5 секунд
  console.log(req.body);
  console.log('DEVICE');


  res.send("Записи було успішно вставлено.");
});
app.get("/mainlog/device", async (req, res) => {


try {
  console.log('REQQQQQQQ',req);
} catch (error) {
  console.log(error);
}



  // res.send("Записи було успішно вставлено.");
});

app.use(errorMiddleware);
app.listen(PORT, () => {
  console.log(`Server is running on PORT 8800`);
});
