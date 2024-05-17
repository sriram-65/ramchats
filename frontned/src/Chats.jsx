// ChatRoom.js

import React, { useState, useEffect } from 'react';
import axios from 'axios'
import chatsNot from '../../frontned/public/Feed-amico.png'
const ChatRoom = () => {
	const [messages, setMessages] = useState([]);
	const [user, setUser] = useState('');
	const [message, setMessage] = useState('');

	const fetchMessages = async () => {
		try {
			const response = await fetch('http://localhost:5000/messages');
			const data = await response.json();
			setMessages(data);
		} catch (error) {
			console.error('Error fetching messages:', error);
		}
	};

	const sendMessage = async () => {
		try {
			await fetch('http://localhost:5000/messages', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ user, message }),
			});

			// Clear the message input after sending
			setMessage('');
			// Fetch messages to update the list
			fetchMessages();
		} catch (error) {
			console.error('Error sending message:', error);
		}
	};

	

	const delt = async (id) =>{
		try{
			await axios.delete(`http://localhost:5000/delete/${id}`)
			console.log("sucess")
			alert("This  Meassage Was Deleted")
			fetchMessages()
		}
		catch(er){
			console.log("Error....")
		}
	}
	useEffect(() => {
		// Fetch messages on component mount
		fetchMessages();
		// Poll for new messages every 2 seconds
		const interval = setInterval(() => {
			fetchMessages();
		}, 2000);

		return () => clearInterval(interval);
	}, []); // Run only once on mount


	return (
		<div>
			<h2>Chat House</h2>
			<ul>
                {messages.length === 0 ? (
                <img src={chatsNot} width={390}/>
            )
                :
                messages.map((message) => (
                     
					<li key={message._id}>
						<strong>{message.user} :  {message.message}</strong> 
                         <button onClick={() =>delt(message._id)}>Delete Msg</button>
					</li>
				))
                
                }
				
            
			</ul>

			<div>
				<input
					type="text"
					placeholder="Your name"
					value={user}
					onChange={(e) => setUser(e.target.value)}
				/>
				<input
					type="text"
					placeholder="Type your message..."
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>

                
				<button onClick={sendMessage}>Send</button>
			</div>
		</div>
	);
};

export default ChatRoom;
