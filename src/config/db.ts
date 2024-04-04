import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv"; 
dotenv.config()


const db = new Sequelize(process.env.DATABASE_URL!, {
    models: [__dirname + '/../models/**/*.ts'], //return the location the file that is calling it
    logging: false

})

export default db