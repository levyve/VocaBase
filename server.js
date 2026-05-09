import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
 
const app = express()
app.use(cors())              
app.use(express.json())
 
const prisma = new PrismaClient()
 
app.post('/vocaloids', async (req, res) => {
    try {
        await prisma.vocaloid.create({
            data: {
                name:        req.body.name,
                release:     req.body.release,
                affiliation: req.body.affiliation,
                v1:          req.body.v1,
                v2:          req.body.v2,
                v3:          req.body.v3,
                v4:          req.body.v4,
                v5:          req.body.v5,
                v6:          req.body.v6
            }
        })
        res.status(201).json(req.body)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})
 
app.get('/vocaloids', async (req, res) => {
    try {
        const q = req.query
        const where = {}
 
        if (q.name)        where.name        = q.name
        if (q.release)     where.release     = parseInt(q.release)
        if (q.affiliation) where.affiliation = q.affiliation
        if (q.v1 !== undefined) where.v1 = q.v1 === 'true'
        if (q.v2 !== undefined) where.v2 = q.v2 === 'true'
        if (q.v3 !== undefined) where.v3 = q.v3 === 'true'
        if (q.v4 !== undefined) where.v4 = q.v4 === 'true'
        if (q.v5 !== undefined) where.v5 = q.v5 === 'true'
        if (q.v6 !== undefined) where.v6 = q.v6 === 'true'
 
        const voca = await prisma.vocaloid.findMany({ where })
        res.status(200).json(voca)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})
 
app.put('/vocaloids/:name', async (req, res) => {
    try {
        await prisma.vocaloid.update({
            where: { name: req.params.name },
            data: {
                release:     req.body.release,
                affiliation: req.body.affiliation,
                v1:          req.body.v1,
                v2:          req.body.v2,
                v3:          req.body.v3,
                v4:          req.body.v4,
                v5:          req.body.v5,
                v6:          req.body.v6
            }
        })
        res.status(200).json(req.body)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})
 
app.delete('/vocaloids/:name', async (req, res) => {
    try {
        await prisma.vocaloid.delete({
            where: { name: req.params.name } 
        })
        res.status(200).json({ message: 'Deletado' })  
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})
 
app.listen(3000, () => console.log('http://localhost:3000'))