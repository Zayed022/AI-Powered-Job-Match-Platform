import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app= express()
app.use(cors({
    origin: [
        "http://localhost:5174",
      "http://localhost:5173",
      "https://ai-powered-job-match-platform-1.onrender.com",
      "https://ai-powered-job-match-platform-ten.vercel.app"
    ],
    credentials:true
}))

app.use(express.json({limit:"32kb"}))
app.use(express.urlencoded({extended:true,limit:"32kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use((err, req, res, next) => {
    console.error("Global Error Handler:", err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  });

  import userRoute from './routes/user.routes.js'
  app.use("/api/v1/users",userRoute);

  import jobRoute from './routes/job.routes.js'
  app.use("/api/v1/jobs",jobRoute);

  import recommendRoute from './routes/recommend.routes.js'
  app.use("/api/v1/recommend",recommendRoute);

  import adminRoute from './routes/admin.routes.js'
  app.use("/api/v1/admin",adminRoute);


  




export {app}