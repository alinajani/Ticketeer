const express = require("express");
const router = express.Router();
const ticketController = require("../controller/ticketController.js");

router.delete("/", ticketController.removeAllTickets);

router.get("/GetWholeTable", ticketController.GetWholeTable);

router.get("/getticketwithCondition", ticketController.getTicketswithCondition);

router.post("/AddNewticket", ticketController.AddNewTickets);
router.put("/Updateticket", ticketController.UpdateTickets);

router.delete("/DeleteticketAtID", ticketController.DeleteTicketsAtID);
router.delete(
  "/DeleteticketWithCondition",
  ticketController.DeleteTicketsWithCondition
);

router.get("/findNextId", ticketController.FindNextAvailableTickForEvent);

router.get("/ticketsLeft", ticketController.FindNumTicksLeftforEvent);

module.exports = router;
