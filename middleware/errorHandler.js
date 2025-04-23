function errorHandler(error,req,res,next){
    console.log(error);
    const statusCode=error.statusCode||500;
    const message=error.message||"internal Server Error"
}

module.exports= errorHandler;