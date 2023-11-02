const bodyParser = require('body-parser');
const cors = require('cors');

//routers

const express = require('express');

const app = express();
const port = 8000;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
    console.log("MESSAGE PRINTED");
    return res.send("DB APP WORKING!");
});


const eventRouter = require("./routes/eventRouter");
/*const userRouter = require('./router/desertRouter.js');
const venueRouter = require('./router/personRouter.js');
const ticketRouter = require('./router/orderRouter.js');
const transactionRouter = require('./router/tableCreationRouter.js');*/
const event_categoryRouter = require("./routes/event_categoryRouter");



app.use("/event", eventRouter);
app.use("/eventcategory", event_categoryRouter);
/*app.use("/user", userRouter);
app.use("/venue", venueRouter);
app.use("/ticket", ticketRouter);
app.use("/transaction", transactionRouter);
*/

const countriesRouter = require('./routes/countriesRouter');
app.use('/countries', countriesRouter);

const locationsRouter = require('./routes/locationsRouter');
app.use('/locations', locationsRouter);

const organizersRouter = require('./routes/organizersRouter');
app.use('/organizers', organizersRouter);

const performerTypeARouter = require('./routes/performer_type_ARouter');
app.use('/performertypeA', performerTypeARouter);

const performerTypeBRouter = require('./routes/performer_type_BRouter');
app.use('/performertypesB', performerTypeBRouter);

const performerTypeRouter = require('./routes/performer_typeRouter');
app.use('/performertypes', performerTypeRouter);

const performerRouter = require('./routes/performerRouter');
app.use('/performer', performerRouter);

const seatsRouter = require('./routes/seatsRouter');
app.use('/seats', seatsRouter);

const ticketRouter = require('./routes/ticketRouter');
app.use('/tickets', ticketRouter);

const transactionRouter = require('./routes/transactionRouter');
app.use('/transactions', transactionRouter);

const userRouter = require('./routes/userRouter');
app.use('/users', userRouter);

const venueRouter = require('./routes/venueRouter');
app.use('/venues', venueRouter);





app.listen(8000, () => {
    console.log("Server listening on port 8000");
});

