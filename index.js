require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const morgan = require("morgan");
const googlePassport = require('./auth-services/passport.google')
const passportGoogle = require('passport-google-oauth20');
const session = require('express-session')

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const path = require("path");
const errorMiddleware = require("./middlewares/error-middleware");
const { fileURLToPath } = require("url");
const { default: helmet } = require("helmet");
const PORT = process.env.PORT || 8800;
const db = require("./db/db");
const authRouter = require("./router/user");
const deviceRouter = require("./router/device");
const deviceSettingsRouter = require("./router/device_settings.js");
const cookieParser = require("cookie-parser");
const authMiddlewares = require("./middlewares/auth-middlewares");
const {
  generateRandomNumberOneOrTwo,
} = require("./functions/numbers.generate");
const { googleAuthMethod } = require("./services/auth/google.method");

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
    origin: ["https://carriers.ict.lviv.ua", "http://localhost:3000", "http://185.233.39.139", 'https://vendwater.tech', 'https://www.vendwater.tech'],
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
// app.use("/device", deviceRouter);
app.use("/device", deviceSettingsRouter);


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



  // res.send("Записи було успішно вставлено.");
});




// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: `http://localhost:8800/auth/google/callback`,

// },
//   function(accessToken, refreshToken, profile, cb) {
//     console.log(profile);
//     console.log('PROFILEPICTURE',profile);
//     console.log('PROFILEEMAIL',profile._json.email);
//     // User.findOrCreate({ googleId: profile.id }, function (err, user) {
//     //   return cb(err, user);
//     // });
//   }
// ));


// passport.serializeUser((user, done) => {
//   done(null, user)
// })

// passport.deserializeUser((user, done) => {
//   done(null, user)
// })




app.get('/auth/google', googlePassport.authenticate('google', { scope: ['profile','email'] }))

app.get('/auth/google/callback',
  googlePassport.authenticate('google', {
    
    successRedirect:'https://vendwater.tech',
    failureRedirect: 'https://www.vendwater.tech/login/failure',
  
  }));

app.get('/auth/login/success',(req,res) => {

console.log(req.user);
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
// app.get('/auth/login/failure',(req,res) => {


//   if (req.user) {
//     res.cookie("refreshToken", req.user.refreshToken, {
//       maxAge: 30 * 24 * 60 * 60 * 1000,
//       httpOnly: false,
//       secure:false
  
//     });
//     res.status(200).json({
//       success:true,
//       message:'Successfull',
//       user:req.user
//     })

//   }
//   })


  // app.get('/auth/google/logout',(req,res) =>{
  //   req.logout(function(err) {
  //     if (err) { return next(err); }
  
  //     res.clearCookie()
  //   });
   
  // })









app.use(errorMiddleware);
app.listen(PORT, () => {
  console.log(`Server is running on PORT 8800`);
});
