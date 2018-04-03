const express = require('express');
const db = require('./data/db.js');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const server = express();
server.use(morgan());
server.use(helmet());
server.use(bodyParser());

server.get('/', function(req, res) {
    res.send({ api: "Running..." });
})

server.get('/api/users', (req, res) => {
    db.find().then(users => {
        res.json(users);
    }).catch(error => {
        res.status(500).json(error);
    })
});

server.get('/api/users/:id', (req, res) => {
    const { id } = req.params;
    db
        .findById(id)
        .then(users => {
            res.json(users[0]);
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

server.post('/api/users', (req, res) => {
    db.insert(req.body).then(response => {
        res.json({ ...req.body, ...response});
    }).catch(error => {
        res.status(500).json(error);
    })
});

server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;

    db
        .findById(id)
        .then(response => {
            user = { ...response[0] };
        db
            .remove(id)
            .then(response => {
                res.json(user);
            })
            .catch(error => {
                res.status(500).json(error);
            });
    })
    .catch(error => {
        res.status(500).json(error);
    })
});

server.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const update = req.body;

    db
        .update(id, update)
        .then(count => {
            if(count > 0) {
                db.findById(id).then(updatedUser => {
                    res.status(200).json(updatedUser);
                });
            } else {
                res
                    .status(404)
                    .json({ message: 'The user with the specified ID does not exist.'});
            }
        })
    .catch(error => {
        res.status(500).json(error);
    })
});


const port = 5000;
server.listen(port, () => console.log('API Running on port 5000'));