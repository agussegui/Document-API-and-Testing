import { zalgo } from "colors";
import { Table, Column, Model, DataType, Default } from "sequelize-typescript";

@Table({
    tableName:'products'
})

//Create the Columns for the datebases
class products extends Model {
    @Column({
        type:DataType.STRING(100)  //Max 100 characters
    }) 
    declare name: string

    @Column({
        type: DataType.FLOAT
    }) 
    declare price: number

    @Default(true)
    
    @Column({
        type:DataType.BOOLEAN
    })
    declare availability: boolean
}
export default products;
    