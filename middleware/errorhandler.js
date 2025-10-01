const errorHandler = (err,req,res,next)=>{
    const statusCode = res.statuscode? res.statuscode :500;
    console.log(err.message)
    res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
}

export default errorHandler