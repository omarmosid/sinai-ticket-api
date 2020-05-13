const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  category: {
    type: String,
  },
  status: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  assignedTo: {
    type: String,
    required: true,
  },
  comments: {
    type: [
      {
        content: String,
        author: String,
        date: {
          type: Date,
          default: Date.now
        }
      }
    ],
    default: []
  }
})

module.exports = Ticket = mongoose.model('ticket', TicketSchema);