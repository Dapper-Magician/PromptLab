import { useState } from 'react';
import { Settings, Play, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ChatPanel } from './ChatPanel';

export function TestingWorkbench({ prompts, onPromptSelect }) {
  const [selectedPrompt, setSelectedPrompt] = useState(null);

  const handlePromptSelection = (promptId) => {
    const prompt = prompts.find(p => p.id.toString() === promptId);
    setSelectedPrompt(prompt);
  };

  return (
    <div className="flex h-full">
      {/* Configuration Sidebar */}
      <div className="w-1/4 border-r border-border p-6 bg-muted/20">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Configuration
        </h2>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Prompt</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="prompt-select">Select a prompt to test</Label>
              <Select onValueChange={handlePromptSelection}>
                <SelectTrigger id="prompt-select" className="mt-2">
                  <SelectValue placeholder="Select a prompt..." />
                </SelectTrigger>
                <SelectContent>
                  {prompts.map(prompt => (
                    <SelectItem key={prompt.id} value={prompt.id.toString()}>
                      {prompt.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Model</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Model selection coming soon.</p>
            </CardContent>
          </Card>

          <Button className="w-full">
            <Play className="h-4 w-4 mr-2" />
            Run Test
          </Button>
        </div>
      </div>

      {/* Main Chat Panel */}
      <div className="flex-1 flex flex-col">
        {selectedPrompt ? (
          <ChatPanel prompt={selectedPrompt} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium">Select a prompt to begin testing</h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

