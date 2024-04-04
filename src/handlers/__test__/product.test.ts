import request from 'supertest'
import server from '../../server'

describe('POST /api/products', () => {
    
    //validation from product not empty
    it('should display validation errors', async() => {
        const response = await request(server).post ('/api/products').send({}) 
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(4)

        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(2)

    })

    //validation to ensure that the price is not empty
    it('should validate that the price is greater than 0', async() => {
        const response = await request(server).post ('/api/products').send({
            name: 'Notebook ASUS 15.6 Pulgadas',
            price: 0
        }) 
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)

        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(2)

    })
    //validation to ensure that the price is not empty and never used a string
    it('should validate that the price is a number and greater than 0', async() => {
        const response = await request(server).post ('/api/products').send({
            name: 'Notebook ASUS 15.6 Pulgadas',
            price: "hola"
        }) 
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(2)

        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(4)

    })


    //Validation from database
    it('shoul create a new product', async () => {
        // if you are in a company, If you are in a company, the testing is done on a production database
        const response = await request(server).post ('/api/products').send({
            name: "Notebook ASUS 15.6 Pulgadas Testing",
            price: 1250000
        }) 
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty('errors')

    })
})

describe('GET api/products', () => {

    it('should check if api/products url exists', async () =>{
        const response = await request(server).get('/api/products')

        expect(response.status).not.toBe(404)
    })

    it('GET a JSON response response with products', async () =>{
        const response = await request(server).get('/api/products')

        expect(response.status).toBe(200)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveLength(1)

        expect(response.body).not.toHaveProperty('errors')

    })
})

describe('GET api/products/:id', () => {

    it('Should return a 404 repsonse for a non-existent product', async () => {
        const productId = 2000 
        const response = await request(server).get(`/api/products/${productId}`)
        expect(response.status).toBe(404) 
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Producto no encontrado')

    })

    it('should check a valid ID in the URL', async () => {
        const response = await request(server).get('/api/products/not-valid-url')
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('Id no valido')
    })

    it('get a JSON response for a single product', async () => {
        const response = await request(server).get('/api/products/1')
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
    })
})

describe('PUT /api/products/:id', () => {

    it('should check a valid ID in the URL', async () => {
        const response = await request(server).put('/api/products/not-valid-url').send({
            name: "Monitor Nuevo actualizado",
            price: 125000,
            availability: true
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('Id no valido')
    })

    it('should display validation error message when updating a product', async () => {
        const response = await request(server).put('/api/products/1').send({})

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy() //Thuthy signify: while is not empty its okey
        expect(response.body.errors).toHaveLength(5)

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })


    it('should validate that the price is greater than 0', async () => {
        const response = await request(server).put('/api/products/1').send({
            name: "Monitor Nuevo actualizado",
            price: 0,
            availability: true
        })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy() //Thuthy signify: while is not empty its okey
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('Precio no valido')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should return a 404 response for a non-existent product', async () => {
        const productId = 2000
        const response = await request(server).put(`/api/products/${productId}`).send({
            name: "Monitor Nuevo actualizado",
            price: 125000,
            availability: true
        })

        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto no encontrado')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should update an existing product with validm data', async () => {
        const response = await request(server).put(`/api/products/1`).send({
            name: "Monitor Nuevo actualizado",
            price: 125000,
            availability: true
        })

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('errors')
    })
})

describe('PATCH /api/products/:id', () => {
    it('should return a 404 response for a non-existing product', async () => {
        const productId = 2000
        const response = await request(server).patch(`/api/products/${productId}`)
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto no encontrado')
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should update the product availability', async () => {
        const response = await request(server).patch('/api/products/1')
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.availability).toBe(false)

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('error')
    })
})

describe('DELETE /api/products/:id', () => {
    it('should check a valid ID', async () => {
        const response = await request(server).delete('/api/products/not-valid')
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors[0].msg).toBe('Id no valido')
    })

    it('should return a 404 response for a non-existing product', async () => {
        const productId = 2000
        const response = await request(server).delete(`/api/products/${productId}`)
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto no encontrado')
        expect(response.status).not.toBe(200)
    })

    it('should delete a product', async () => {
        const response = await request(server).delete('/api/products/1')
        expect(response.status).toBe(200)
        expect(response.body.data).toBe('Producto Eliminado')

        expect(response.status).not.toBe(400)
        expect(response.status).not.toBe(404)

    })
})