const express = require("express");
const router = express.Router();

const Ticket = require("../../models/Ticket");

// @route    GET api/tickets
// @desc     Get all tickets
// @access   Public
router.get("/", async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ date: -1 });
    res.json(tickets);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

// @route    GET api/tickets/:id
// @desc     Get a specific ticket
// @access   Public
router.get("/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    res.json(ticket);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

// @route    POST api/tickets
// @desc     Create a ticket
// @access   Public
router.post("/", async (req, res) => {
  try {
    // Construct new ticket object
    const newTicket = new Ticket({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      category: req.body.category,
      assignedTo: req.body.assignedTo,
    });

    // Save constructed object to DB
    const ticket = await newTicket.save();

    // Send response
    res.json(ticket);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// @route    DELETE api/tickets/:id
// @desc     Delete a ticket
// @access   Public
router.delete("/:id", async (req, res) => {
  try {
    const ticketToBeDeleted = await Ticket.findById(req.params.id);
    await ticketToBeDeleted.remove();

    res.json({
      msg: "Ticket Removed",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// @route    PUT api/tickets/status/:id
// @desc     Close a ticket
// @access   Public
router.put("/status/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    // Check if ticket already closed
    if (ticket.status === "closed") {
      return res.status(400).json({
        msg: "Already Closed",
      });
    }

    ticket.status = "closed";
    const modifiedTicket = await ticket.save();

    return res.json(modifiedTicket);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// @route    PUT api/comments/:id
// @desc     Add a comment
// @access   Public
router.put("/comments/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    
    ticket.comments.unshift({
      content: req.body.content,
      author: req.body.author
    })

    const modifiedTicket = await ticket.save();
    return res.json(modifiedTicket)
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
