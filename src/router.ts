import { Router } from "express"
import { body, param } from "express-validator" //Body is used for those are not async
import { createProduct, deleteProduct, getProducts, getProductsByID, updateAvailability, updateProduct } from "./handlers/product"
import { handleInputErrors } from "./middleware"

//Routing
//req es lo que envias, tambien pueden ir datos de un formulario, un apikey, etc  
// y el res es lo que obtienes cuando envias ese request(req )

//Aquí podríamos consultar una base de datos, obtener los resultados y entonces enviarlos de vuelta al usuario.
//O también, si un usuario se está autenticando, podemos tomar lo que ingresa en el request y revisar

const router =  Router()

/** 
*   @swagger
*   components:
*       schemas:
*           Product:
*               type: object
*               properties:
*                   id:
*                       type: integer
*                       description: The Product ID
*                       example: 1
*                   name:
*                       type: string
*                       description: The Product name
*                       example: Monitor curvo de 24 pulgadas
*                   price:
*                       type: number
*                       description: The Product price
*                       example: 125000
*                   availability:
*                       type: boolean
*                       description: The Product availability
*                       example: true
*/

/** 
 * @swagger
 * /api/products:
 *      get:
 *          summary: Get a list of products
 *          tags:
 *              - Products
 *          description: Return a list of products
 *          responses:
 *              200:
 *                  description: Successful response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:    
 *                                  $ref: '#/components/schemas/Product'
 * 
*/
router.get('/', getProducts )


/** 
 * @swagger
 * /api/products/{id}:
 *  get:
 *      summary: Get a product by ID
 *      tags:
 *          - Products
 *      description: Return a product based on its unique ID
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *          200:    
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *  
 *          404:    
 *              description: Product not found
 *          400:
 *              description: Bad request - Invalid ID
 * 
*/

router.get('/:id',  

    param('id').isInt().withMessage('Id no valido'),
    handleInputErrors,
    getProductsByID 
)

/**
 * @swagger
 * /api/produts:
 *  post:
 *      summary: Creates a new product
 *      tags:
 *          - Products
 *      description: Returns a new record in the database
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema: 
 *                      type: object
 *                      properties:
 *                          name: 
 *                              type: string 
 *                              example: Monitor Curvo 27 pulgadas    
 *                          price:
 *                              type: number
 *                              example: 175000
 * 
 *      responses:
 *          201:
 *              description: successfully response
 *              content:
 *                  application/json:
 *                      schema: 
 *                          $ref: '#/components/schemas/Product'
 *          401:
 *              description: Bad request - Invalid input data
 */

router.post('/', 
    
    //validation
    //here you can create custom rules or checks that you want
    body('name').notEmpty().withMessage('El nombre del producto no puede ir vacio'),

    body('price')
        .isNumeric().withMessage('valor no valido')
        .notEmpty().withMessage('El precio del producto no puede ir vacio')
        .custom(value => value > 0).withMessage('Precio no valido'),
    handleInputErrors,
    createProduct
)

/**
 * @swagger
 * /api/products/{id}:
 *  put:
 *      summary: Updates a product with user input
 *      tags:
 *          - Products
 *      description: Returns the updated product
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema: 
 *                      type: object
 *                      properties:
 *                          name: 
 *                              type: string 
 *                              example: "Monitor Nuevo actualizado"    
 *                          price:
 *                              type: number
 *                              example: 175000
 *                          availability:
 *                              type: boolean
 *                              example: true
 *      responses:
 *          200:
 *              description: successfully response
 *              content:
 *                  application/json:
 *                      schema: 
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad request - Invalid ID or Invalid input data
 *          404:
 *              description: Product Not Found
 * 
 */

//PUT make total modifications with what you are sending to your database
router.put('/:id',

    param('id').isInt().withMessage('Id no valido'),
    body('name')
        .notEmpty().withMessage('El nombre del producto no puede ir vacio'),
    body('price')
        .isNumeric().withMessage('valor no valido')
        .notEmpty().withMessage('El precio del producto no puede ir vacio')
        .custom(value => value > 0).withMessage('Precio no valido'),
    body('availability')
        .isBoolean().withMessage('Valor para disponibilidad no valido'),   
    handleInputErrors,
    updateProduct 
)  //The PUT it always has to have an ID 


/** 
 * @swagger
 * /api/products/{id}:
 *  patch:
 *      summary: Update Product availability
 *      tags:
 *          - Products
 *      description: Returns the updated availability
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: successfully response
 *              content:
 *                  application/json:
 *                      schema: 
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad request - Invalid ID 
 *          404:
 *              description: Product Not Found
 */

//PATCH allow make change specific in the data for resource without afect a rest the information
router.patch('/:id', 

    param('id').isInt().withMessage('Id no valido'),
    handleInputErrors,
    updateAvailability
)
/**
 * @swagger
 * /api/products/{id}:
 *  delete:
 *      summary: Delete a Product by a given ID
 *      tags:
 *          - Products
 *      description: Returns a confirmation message
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the product to delete
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: successfully response
 *              content:
 *                  application/json:
 *                      schema: 
 *                          type: string
 *                          value: 'Producto Eliminado'
 *          400:
 *              description: Bad request - Invalid ID 
 *          404:
 *              description: Product Not Found
 */


router.delete('/:id', 

    param('id').isInt().withMessage('Id no valido'),
    handleInputErrors,
    deleteProduct

)

export default router