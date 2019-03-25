var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require('mysql');
const fs = require('fs');
let IP = null;
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "wrQLcBaBV7amH",
    database: "Multiverse"
});

io.on('connection', (socket) => {
    let room = null;
    /* chat messages */
    socket.on('chat message', (e) => {
        con.query(`INSERT INTO messages (type, text, senderId, chatId, likes, comments, stage, title, performers) VALUES
            ("${e.type}","${e.text}","${e.senderId}","room${e.senderId > e.chatId ? e.senderId.toString().concat("_", e.chatId) : e.chatId.toString().concat("_", e.senderId)}","${e.likes || 0}",
                "${e.comments || 0}","${e.stage || 0}","${e.title}","${e.performers}")`,
            (err, result) => {
                if (err) throw err;
            });
        io.sockets
            .to(room || `room${e.senderId > e.chatId ? e.senderId.toString().concat("_", e.chatId) : e.chatId.toString().concat("_", e.senderId)}`)
            .emit('chat message', e);
    });



    /* select chat */
    socket.on('select chat', (e) => {
        room = `room${e.userId > e.chatId ? e.userId.toString().concat("_", e.chatId) : e.chatId.toString().concat("_", e.userId)}`;
        con.query(`SELECT * FROM messages WHERE chatId = "${room}"`, async (err, result) => {
            if (err) throw err;
            await socket.join(room);
            console.log(room)
            con.query(`UPDATE messages SET isread = true WHERE senderId = ${e.chatId} AND chatId = "${room}" AND isread = false`, (err, result) => {
                if (err) throw err;
            })
            socket.emit('select chat', result)
        })
    })



    /* leave chat */
    socket.on('leave chat', (e) => {
        // socket.leave(room);
    })



    /* new user */
    socket.on('new user', (e) => {
        con.query(`SELECT COUNT(*) AS users FROM users WHERE phone = ${e.phone}`, (err, result, fields) => {
            const usersCount = result[0].users;
            if (usersCount !== 0) {
                socket.emit('user exists', { message: `user ${e.phone} already exists ${usersCount}` })
            } else {
                con.query(`INSERT INTO users (phone) VALUES (${e.phone})`, (err, result) => {
                    socket.emit('user created')
                })
            }
        });
        //     if (err) throw err;

        // io.emit('new user', e);
    });



    /* login */
    socket.on('login', e => {
        e.phone && con.query(`SELECT * FROM users WHERE phone = ${e.phone}`, (err, result, fields) => {
            if (result.length) {
                socket.emit('login success', {
                    result: result[0]
                })
            } else {
                socket.emit('login error', {
                    message: 'no user found'
                })
            }
        })
    })



    /* get dialogs */
    socket.on('dialogs', (e) => {
        con.query(`SELECT * FROM users WHERE id = ${e.userId}`, (err, result) => {
            if (err) throw err;
            if (result[0].dialogs) {
                const dialogs = result[0].dialogs.replace(/\[/g, '(').replace(/\]/g, ')');
                con.query(`SELECT * FROM users WHERE id  in ${dialogs}`, (err, result, fields) => {
                    const messages = []
                    const unread = []
                    result && result.map(event => {
                        con.query(`SELECT * FROM messages WHERE chatId = ${event.id}  ORDER BY id DESC LIMIT 1`, (err, result) => {
                            messages.push(result[0])
                            con.query(`SELECT * from messages WHERE senderId = ${e.userId} AND chatId = ${event.id} AND isread = 0`, (err, result) => {
                                if (err) throw err;
                                unread.push({ length: result.length, chatId: event.id })
                            })
                        })
                    });
                    result && setTimeout(() => socket.emit('dialogs', { dialogs: result, messages, unread }), 10)
                })
            }
        })
    })



    /* get chat info */
    socket.on('get chat info', e => {
        con.query(`SELECT * FROM users WHERE id = ${e.id}`, (err, result) => {
            if (err) throw err;
            socket.emit('get chat info', result[0]);
        })
    })



    /* find users*/
    socket.on('find', e => {
        con.query(`SELECT * FROM users`, (err, result) => {
            if (err) throw err;
            socket.emit('find', { result })
        })
    })



    /* set dialogs */
    socket.on('set dialogs', e => {
        con.query(`SELECT * FROM users WHERE id = ${e.userId}`, (err, result) => {
            if (err) throw err;
            let dialogs = JSON.parse(result[0].dialogs) || [];
            if (!dialogs.includes(e.dialogId)) {
                dialogs = [...dialogs, e.dialogId]
                con.query(`UPDATE users SET dialogs = "${JSON.stringify(dialogs)}" WHERE id = ${e.userId}`)
            }
        })
    })



    /* get news */
    socket.on('news', e => {
        con.query(`SELECT * FROM messages WHERE type = "feed"`, (err, result) => {
            if (err) throw err;
            socket.emit('news', { result: result })
        })
    })

    /* read messages */
    socket.on('read', e => {
        con.query(`UPDATE messages SET isread = 1 WHERE senderId = ${e.senderId} AND chatId = ${e.chatId}`, (err, result) => {
            if (err) throw err;
        })
    })
});
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});



http.listen(3000, function () { });
