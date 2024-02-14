import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import { Server } from 'socket.io';
import productsRouter from './routers/products.router.js'
import cartsRouter from './routers/cart.router.js'
import viewsRouter from './routers/view.router.js'
import chatRouter from './routers/chat.router.js'
import { __dirname } from './utils.js';
import productModel from "./dao/models/product.model.js";
import messageModel from "./dao/models/message.model.js";

export const PORT = 8080;

const app = express();

app.engine('handlebars', handlebars.engine());
app.set('views', './src/views');
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.static(__dirname+"/public"));
app.use('/api/products', productsRouter);
app.use('/api/cart', cartsRouter);
app.use('/products', viewsRouter);
app.use('/carts', viewsRouter);
app.use('/chat', chatRouter);

try{
    await mongoose.connect('mongodb+srv://tperoncello27:Agustin05@bakend.zhpekqm.mongodb.net/',{
        dbName: 'ecomerce'
    })
    const httpServer = app.listen(PORT, ()=> console.log('La app funciona en el http://localhost:8080/')) 


    const io = new Server(httpServer);
    const message = []
    io.on("connection", (socket) => {
        console.log(`New Client Connected`)
        socket.on('productList', (data) => {
            // Supongamos que `data` contiene los datos de productos actualizados
            if (data) {
                io.emit('updateProducts', data);
                console.log('Datos enviados al cliente:', data);
            } else {
                console.error('Los datos de productos están vacíos o nulos');
            }
        })
        socket.on('message', async (data) => {
            try {
                const message = new messageModel({
                    user: data.user,
                    message: data.message
                });
        
                await message.save();
                const messages = await messageModel.find()
                io.emit('logs', messages);
            } catch (err) {
                console.error('Error al guardar el mensaje:', err);
            }
        });
        
    })
}catch(err){
    console.log(err.message)
}

