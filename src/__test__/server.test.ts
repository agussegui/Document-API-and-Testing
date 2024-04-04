//Describe signify: To group a series of related tests.Ex: prube conexion a database
//tobe: compare the value, expect: wait a error, wait a answer from my API
  
import  {connectDB} from '../server'
import db from '../config/db'

jest.mock('../config/db')

describe('connectDB', () => {
    it('should handle database connection error', async () => {
        jest.spyOn(db, 'authenticate').mockRejectedValue(new Error('Hubo un error al conectar la base de datos'))
        const consoleSpy = jest.spyOn(console, 'log')

        await connectDB()
        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('Hubo un error al conectar la base de datos')
        )
    })
})
