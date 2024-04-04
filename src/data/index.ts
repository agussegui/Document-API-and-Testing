import {exit} from 'node:process'
import db from '../config/db'

const clearDB = async () => {

    try  {
        await db.sync({force: true}) // Eliminat everything the database
        console.log('Datos eliminados correctamente')
        exit(0)
    } catch (error) {
        console.error(error)
        exit(1)//exit signify: when have number 1 signifies what that finishes the program but have errors and contrary 0 its okey
    }

}
//process.argv: Code that runs internally within Node.js and number 2 is a position
if(process.argv[2] === '--clear'){
    clearDB()
}

console.log(process.argv)