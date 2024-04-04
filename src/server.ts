import express from 'express';
import router from './router';
import db from './config/db';
import cors, {CorsOptions} from 'cors'
import morgan from 'morgan';
import colors from 'colors';
import swaggerUI from 'swagger-ui-express'
import swaggerSpec, {swaggerUIOptions} from './config/swagger';

//Conectar a la Base De Datos
export async function connectDB() {
    try{
        await db.authenticate() //Authentication user
        db.sync() //Every time create the new model, columns in the database will be added 
        // console.log(colors.green.bold('conexion correcta'))
    } catch(error) {

        console.log(colors.red.bold('Hubo un error al conectar la base de datos'))
    }
}
connectDB()
//instance of express
const server = express();

//Permit conexion
const corsOptions : CorsOptions = {
    origin: function(origin, callback){ // origin signify: who is sending me the request 
        if(origin === process.env.FRONTEND_URL){
            callback(null, true)    
        } else {
            callback(new Error('Error de Cors'))
        }
    }
}

server.use(cors(corsOptions))

//Read formulary data
server.use(express.json());

server.use(morgan('dev'))
server.use('/api/products', router)

//Docs
server.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec, swaggerUIOptions))



export default server;