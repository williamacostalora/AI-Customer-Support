'use client';

import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm here to help you with tips on how to be more environmentally friendly and preserve water. How can I assist you today?",
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
      justifyContent="flex-start"
      alignItems="center"
      sx={{ backgroundColor: '#f4f4f9' }}
    >
      {!showChat ? (
        // Landing Page Section
        <Box
          width="100%"
          height="60vh"
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            backgroundColor: '#0D47A1',
            color: 'white',
            textAlign: 'center',
          }}
        >
          <Stack spacing={2} alignItems="center">
            <Typography variant="h2" fontWeight="bold">
              Welcome to WaterWise
            </Typography>
            <Typography variant="h5">
              Your sustainable water use consultant at your fingertips
            </Typography>
            <Button
              variant="contained"
              sx={{
                bgcolor: '#1E88E5',
                '&:hover': {
                  bgcolor: '#1565C0',
                },
                mt: 3,
                fontSize: '1.2rem',
                padding: '10px 20px',
              }}
              onClick={() => setShowChat(true)}
            >
              Start Chatting
            </Button>
          </Stack>
        </Box>
      ) : (
        // Chat Section
        <Box
          width="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          mt={4}
        >
          <Stack
            direction={'column'}
            width="500px"
            height="700px"
            borderRadius={3}
            boxShadow={3}
            bgcolor="white"
            p={2}
            spacing={3}
          >
            <Stack
              direction={'row'}
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" color='#0D47A1'>WaterWise Chat</Typography>
              <Button
                variant="contained"
                onClick={() => setShowChat(false)}
                sx={{
                  bgcolor: '#0D47A1',
                  '&:hover': {
                    bgcolor: '#1E88E5',
                  },
                }}
              >
                Back to Home
              </Button>
            </Stack>
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
                      bgcolor: message.role === 'assistant' ? '#0D47A1' : '#1565C0',
                      color: 'white',
                      borderRadius: 16,
                      p: 3,
                    }}
                  >
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
                bgcolor="white"
                fullWidth
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#0D47A1',
                    },
                    '&:hover fieldset': {
                      borderColor: '#1E88E5',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1565C0',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#0D47A1',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#1E88E5',
                  },
                  '& .MuiInputBase-input': {
                    color: 'black',
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={sendMessage}
                disabled={isLoading}
                sx={{
                  bgcolor: '#0D47A1',
                  '&:hover': {
                    bgcolor: '#1E88E5',
                  },
                }}
              >
                {isLoading ? 'Sending...' : 'Send'}
              </Button>
            </Stack>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
