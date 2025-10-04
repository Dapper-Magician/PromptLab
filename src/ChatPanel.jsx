import { useState } from 'react';
import { toast } from 'sonner';
import { Bot, User, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

export function ChatPanel({ prompt }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || !prompt) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const testData = {
        prompt_id: prompt.id,
        user_message: currentInput,
        model_name: 'mock-model', // Placeholder
        temperature: 0.7, // Placeholder
        // The backend will save this and the frontend will display the mocked response
        model_response: `This is a mocked AI response to your message: "${currentInput}"`,
      };

      const response = await fetch('/api/tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred.' }));
        throw new Error(errorData.message || 'Failed to save test result.');
      }

      const savedTest = await response.json();

      // Use the mocked response from the backend for display
      const botMessage = { role: 'bot', content: savedTest.model_response };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Failed to run test:', error);
      toast.error(error.message || 'An unexpected error occurred.');
      // Optional: remove the user's message if the API call fails
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {prompt && (
            <div className="p-4 rounded-lg bg-muted">
              <h4 className="font-semibold mb-2">Initial Prompt: {prompt.title}</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">{prompt.content}</p>
            </div>
          )}
          {messages.map((message, index) => (
            <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
              {message.role === 'bot' && <Bot className="h-6 w-6 flex-shrink-0" />}
              <div className={`p-3 rounded-lg max-w-[75%] ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.role === 'user' && <User className="h-6 w-6 flex-shrink-0" />}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <Bot className="h-6 w-6 flex-shrink-0" />
              <div className="p-3 rounded-lg bg-muted">
                <p className="text-sm">Thinking...</p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-border">
        <div className="relative">
          <Textarea
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="pr-16"
            rows={1}
          />
          <Button
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
