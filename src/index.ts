import express, { Request, Response } from 'express'
import cors from 'cors'
import { accounts } from './database'
import { ACCOUNT_TYPE } from './types'

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})

// ENDPOINT DE TESTE

app.get("/ping", (req: Request, res: Response) => {
    res.send("Pong!")
})

// GET ALL ACCOUNTS

app.get("/accounts", (req: Request, res: Response) => {
    res.send(accounts)
})

// GET ACCOUNTS BY ID

app.get("/accounts/:id", (req: Request, res: Response) => {
    try{
        const id = req.params.id

        const result = accounts.find((account) => account.id === id) 

        if(!result){
            res.status(404)
            throw new Error("Conta não encontrada. Verifique a 'id'.")
        }

        res.status(200).send(result)

    } catch (error) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }

        res.send(error.message)
    }    
})

// DELETE ACCOUNT BY ID

app.delete("/accounts/:id", (req: Request, res: Response) => {
    try{
        const id = req.params.id

        if(id[0] !== 'a'){
            res.status(400)
            throw new Error("'id' inválido. Deve iniciar com a letra 'a'.")
        }

        const accountIndex = accounts.findIndex((account) => account.id === id)

        if (accountIndex >= 0) {
            accounts.splice(accountIndex, 1)
            res.status(200).send("Conta deletada com sucesso.")

        } else {
            res.status(404).send("Conta não encontrada.")
        }        

    } catch (error) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }

        res.send(error.message)
    }    
})

// EDIT ACCOUNT BY ID

app.put("/accounts/:id", (req: Request, res: Response) => {
    try{
        const id = req.params.id

        const newId = req.body.id  
        
        if(newId !== undefined){
            if(newId[0] !== "a"){
                res.status(400)
                throw new Error("'id' inválido. Deve iniciar com a letra 'a'.")
            }
        }
        
        const newOwnerName = req.body.ownerName 

        if(newOwnerName !== undefined){
            if(newOwnerName.length < 2){
                res.status(400)
                throw new Error("'ownerName' inválido. Deve possuir pelo menos dois caracteres.")
            }
        }        

        const newBalance = req.body.balance

        if(newBalance !== undefined){
            if(typeof newBalance !== "number"){
                res.status(400)
                throw new Error("'balance' deve ser do tipo 'number'.")
            }
    
            if(newBalance < 0){
                res.status(400)
                throw new Error("'balance' não pode ser negativo.")
            }
        }        

        const newType = req.body.type 

        if(newType !== undefined){
            if(
                newType !== ACCOUNT_TYPE.GOLD &&
                newType!== ACCOUNT_TYPE.PLATINUM &&
                newType !== ACCOUNT_TYPE.BLACK ){
                    res.status(400)
                    throw new Error("'type' inválido. Deve ser 'Ouro', 'Platina' ou 'Black'.")
            }
        }

        const account = accounts.find((account) => account.id === id) 

        if (account) {
            account.id = newId || account.id
            account.ownerName = newOwnerName || account.ownerName
            account.type = newType || account.type

            account.balance = isNaN(newBalance) ? account.balance : newBalance
        }

        res.status(200).send("Atualização realizada com sucesso")

        } catch (error) {
            console.log(error)

            if(res.statusCode === 200){
                res.status(500)
            }

            res.send(error.message)
        }
    
})