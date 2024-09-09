import React, { useState, useContext, useEffect } from 'react';
import { db } from '../../Firebase';
import { collection, addDoc, query, onSnapshot } from 'firebase/firestore';
import { MyUserContext } from '../../configs/Contexts';
import CustomNavbar from '../../components/Navbar/Navbar';
import SendIcon from '@mui/icons-material/Send';
import './Chat.css';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const user = useContext(MyUserContext);

    useEffect(() => {
        const q = query(collection(db, 'messages'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const messagesArray = [];
            querySnapshot.forEach((doc) => {
                messagesArray.push({ id: doc.id, ...doc.data() });
            });
            setMessages(messagesArray);
        });

        return () => unsubscribe();
    }, []);

    const handleSendMessage = async () => {
        if (newMessage.trim() !== '') {
            if (user) {
                try {
                    await addDoc(collection(db, 'messages'), {
                        text: newMessage,
                        user: user.last_name,
                        createdAt: new Date(),
                    });
                    setNewMessage('');
                } catch (error) {
                    console.error('Error sending message:', error);
                }
            } else {
                console.error('Bạn chưa đăng nhập');
            }
        }
    };

    if (!user) {
        return <div>Vui lòng đăng nhập để tham gia trò chuyện...</div>;
    }

    return (
        <>
            <CustomNavbar />
            <div className="chat-container">
                <div className="chat">
                    <div className="messages-container">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`message ${message.user === user.last_name ? 'own-message' : ''}`}
                            >
                                <div>
                                    <strong>{message.user}:</strong> <span className="message-text">{message.text}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="input-container">
                        <input
                            className="input-text"
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Nhập tin nhắn..."
                        />
                        <button onClick={handleSendMessage}><SendIcon /></button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Chat;