import { Request, Response } from "express"
import products from "../models/Product.model"
import { getAttributes } from "sequelize-typescript"

export const getProducts = async (req: Request, res: Response) => {
    const Products = await products.findAll({
        attributes: {exclude: ['createdAt', 'updatedAt']} //this command removes for JSON what i don't need
    })
    res.json({data: Products})
}

export const getProductsByID = async (req: Request, res: Response) => {
    const {id} = req.params
    const product = await products.findByPk(id)

    if(!product){
        return res.status(404).json({
            error:'Producto no encontrado'
        })
    }

    res.json({data: product})
    
}

//import With Response and Request,have´s better performance
export const createProduct = async (req: Request , res:Response ) => {

    //sometimes it is recomended to use try and catch
    try {
        const product = await products.create(req.body)
        res.status(201).json({data: product})

    } catch(error) {
        console.log(error)
    }
   
}

export const updateProduct = async(req: Request, res: Response) => {

    const {id} = req.params
    const product = await products.findByPk(id)

    if(!product){// Always check that exist the product 
        return res.status(404).json({
            error:'Producto no encontrado'
        })
    }

    //Update and what are we going to update
    await product.update(req.body) 
    await product.save()

    res.json({data: product})
}

export const updateAvailability = async(req: Request, res: Response) => {

    const {id} = req.params
    const product = await products.findByPk(id)

    if(!product){// Always check that exist the product 
        return res.status(404).json({
            error:'Producto no encontrado'
        })
    }

    //Update and what are we going to update
    product.availability = !product.dataValues.availability
    await product.save()

    res.json({data: product})
}

export const deleteProduct = async(req: Request, res: Response) => {

    const {id} = req.params
    const product = await products.findByPk(id)

    if(!product){// Always check that exist the product 
        return res.status(404).json({
            error:'Producto no encontrado'
        })
    }

    await product.destroy()
    res.json({data: 'Producto Eliminado'})


}