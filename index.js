require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const morgan = require("morgan");
const googlePassport = require('./auth-services/passport.google')
const passportGoogle = require('passport-google-oauth20');
const session = require('express-session')
const { DateTime } = require('luxon');

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const path = require("path");
const errorMiddleware = require("./middlewares/error-middleware");
const { fileURLToPath } = require("url");
const { default: helmet } = require("helmet");
const PORT = process.env.PORT || 8800;
const db = require("./db/db");
const authRouter = require("./router/user");
const deviceRouter = require("./router/device");
const adminWaterRrefund = require("./router/admin_water_refund.js");
const deviceSettingsRouter = require("./router/device_settings.js");
const compayController = require("./router/company.js");
const userMessagesRouter = require("./router/user-messages.js");
const reportsRouter = require("./router/controller_reports.js");
const statisticRouter = require("./router/statistic.router.js");
const cookieParser = require("cookie-parser");
const authMiddlewares = require("./middlewares/auth-middlewares");
const {
  generateRandomNumberOneOrTwo,
} = require("./functions/numbers.generate");
const { googleAuthMethod } = require("./services/auth/google.method");
const { shifrator } = require("./functions/shifrator/shifrator.js");

// CONFIGURATION MIDDLEWARES ************************
const app = express();

app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(helmet.crossOriginEmbedderPolicy({ policy: "credentialless" }));
app.use(morgan("common"));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false,
  // 1 day
  // cookie: { maxAge: 1000 * 60 * 60 } 


  // 1 min
  cookie: { maxAge: 1 * 60 * 1000 }
}))
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(googlePassport.initialize())
app.use(googlePassport.session())
app.use(express.urlencoded({ extended: true }))


// app.use(cors())
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
app.use(
  cors({
    origin: ["https://carriers.ict.lviv.ua", "http://localhost:3000","http://localhost:3001", "http://185.233.39.139", 'https://vendwater.tech', 'https://www.vendwater.tech','*'],
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
    "*"
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
app.use("/devices", deviceRouter);
app.use("/device", deviceSettingsRouter);
app.use("/company", compayController);
app.use("/messages", userMessagesRouter);
app.use("/reports", reportsRouter);
app.use("/statistic", statisticRouter);

app.use('/admin',adminWaterRrefund)


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
    console.log('REQQQQQQQ', req);
  } catch (error) {
    console.log(error);
  }



});

app.get('/auth/google', googlePassport.authenticate('google', { scope: ['profile','email'] }))

app.get('/auth/google/callback',
  googlePassport.authenticate('google', {
    
    successRedirect:'https://vendwater.tech',
    failureRedirect: 'https://www.vendwater.tech/login/failure',
  
  }));

app.get('/auth/login/success',(req,res) => {

  if (req.user) {
    res.cookie("refreshToken", req.user.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure:false
  
    });
    res.status(200).json({
      success:true,
      message:'Successfull',
      user:req.user
    })

  }
  })


  app.get('/device/maintime', async (req, res) => {
    try {
      // Get the current date and time in the "Europe/Kyiv" timezone
      const kyivTime = DateTime.now().setZone('Europe/Kyiv');
      
      // Extracting the date and time components
      const time = {
        seconds: kyivTime.second,
        minutes: kyivTime.minute,
        hours: kyivTime.hour,
        day: kyivTime.day,
        month: kyivTime.month, // Luxon uses 1-based month by default
        year: kyivTime.year - 2000,
        weekDay: (kyivTime.weekday % 7) // Adjusting weekDay from 1-7 to 0-6 (Sunday as 0)
      };
      
      // Logging the date and time details for verification
      // console.log("Часові параметри для C:", time);
  
      // Sending the formatted response
      res.send(`0=${time.seconds}&1=${time.minutes}&2=${time.hours}&3=${time.day}&4=${time.month}&5=${time.year}&6=${time.weekDay}`);
    } catch (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
    }
  });
  








app.get('/instagram/webhook', (req, res) => {
  console.log('GET',req);
  const VERIFY_TOKEN = 'noris696969'; // Токен верифікації

  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK VERIFICATION SUCCESSFUL');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});



// Обробка повідомлень вебхуків
app.post('/instagram/webhook', (req, res) => {
  const data = req.body;

  console.log('POST',data.entry);

  const data1 = data.entry.map((item,idx) =>{
    return console.log('ITEM',item)
  }
  )

  if (data.object === 'instagram') {
    data.entry.forEach(entry => {
      const pageID = entry.id;
      const timeOfEvent = entry.time;

      entry.messaging.forEach(event => {
        if (event.message) {
          console.log('Message received:', event.message);
        }
        if (event.postback) {
          console.log('Postback received:', event.postback);
        }
        if (event.postback) {
          console.log('Postback received:', event.postback);
        }
      });
    });


    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});


app.use(errorMiddleware);

const { Telegraf } = require('telegraf')

const bot = new Telegraf(process.env.ADMIN_BOT_TOKEN)
bot.start((ctx) => ctx.reply('Здоров'))
bot.help((ctx) => ctx.reply('Send me a sticker'))

bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))


module.export = bot



app.listen(PORT, () => {
  console.log(`Server is running on PORT 8800`);
});
