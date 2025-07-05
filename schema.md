# Chat App Schema

## This is what user can send to Websocket Server
- Join a Room

```Javascript
{
    type : "join",
    payload : {
        roomId : "1234aaryan"
    }
}
```

- Send a message

```Javascript
{
    type : "chat",
    payload : {
        message : "hi there"
    }
}
```

## This is what server can respond to client


