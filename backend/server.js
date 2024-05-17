// server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const ChatMessage = require("./Models/Models");

const app = express();
const PORT =  5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/chats", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

// Routes
app.get("/messages", async (req, res) => {
	try {
		const messages = await ChatMessage.find();
		res.json(messages);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

app.post("/messages", async (req, res) => {
	try {
		const { user, message } = req.body;

		if (!user || !message) {
			return res
				.status(400)
				.json({ error: "User and message are required" });
		}

		const chatMessage = new ChatMessage({
			user,
			message,
		});

		await chatMessage.save();

		res.status(201).json(chatMessage);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

app.delete("/delete/:id" , async (req,res)=>{
	try{
		const {id} = req.params
		const result = await ChatMessage.findByIdAndDelete(id)

		if(!result){
			res.status(404).json({
				err:"Meassage Not Found 404"
			})
		}

		res.status(200).json({
			sucess:"Meassage Deleted Sucesfully"
		})
	}
	catch(er){
      return res.status(500).json("Internal Server Eror")
	}

})

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
