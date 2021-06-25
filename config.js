module.exports = {
    port: process.env.PORT || 3000,
    db: process.env.MONGODB || 'mongodb+srv://proyectoCRUD:Lx3ydN3Fs0LTIJF4@cluster0.6zsec.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    urlParser : {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }
}