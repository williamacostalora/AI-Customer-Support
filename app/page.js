'use client';

import { Box, Button, Stack, TextField } from '@mui/material';
import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the Headstarter support assistant. How can I help you today?",
    },
  ]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    const currentMessage = message;
    setMessage('');
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: currentMessage }
    ]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: currentMessage }]),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const assistantContent = data.content;

      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: assistantContent }
      ]);

    } catch (error) {
      console.error('Error:', error);
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I apologize but I encountered an error. Please try again later :)" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        direction={'column'}
        width="500px"
        height="700px"
        border="1px solid grey"
        p={2}
        spacing={3}
      >
        <Stack
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                sx={{
                  bgcolor: message.role === 
                    'assistant' 
                    ? '#009688' 
                    : '#5c6bc0', 
                  color: 'white',
                  borderRadius: 16,
                  p: 3,
                }}
              >
                {/* Handling line breaks */}
                {message.content.split('\n').map((line, i) => (
                  <p key={i} style={{ margin: 0 }}>{line}</p>
                ))}
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>
        <Stack direction={'row'} spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'darkgrey', 
                },
                '&:hover fieldset': {
                  borderColor: 'darkgrey', 
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#5c6bc0', 
                },
              },
              '& .MuiInputLabel-root': {
                color: 'grey', 
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#5c6bc0',
              },
              '& .MuiInputBase-input': {
                color: 'grey', 
              },
            }}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            disabled={isLoading}
            sx={{
              bgcolor: '#5c6bc0', 
              '&:hover': {
                bgcolor: '#3f51b5',
              },
            }}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
