import * as React from 'react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { PromptForm } from '@/components/prompt-form'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'
import { IconShare } from '@/components/ui/icons'
import { FooterText } from '@/components/footer'
import { useAIState, useActions, useUIState } from 'ai/rsc'
import type { AI } from '@/lib/chat/actions'
import { nanoid } from 'nanoid'
import { UserMessage } from './stocks/message'

export interface ChatPanelProps {
  id?: string
  title?: string
  input: string
  setInput: (value: string) => void
  isAtBottom: boolean
  scrollToBottom: () => void
}

export function ChatPanel({
  id,
  title,
  input,
  setInput,
  isAtBottom,
  scrollToBottom
}: ChatPanelProps) {
  const [aiState] = useAIState()
  const [messages, setMessages] = useUIState<typeof AI>()
  const { submitUserMessage } = useActions()

  const exampleMessages = [
    {
      heading: 'What is Tesla ',
      subheading: 'P/E ratio?',
      message: 'What is Tesla P/E ratio?'
    },
    {
      heading: 'Show me the dividend ',
      subheading: 'history of Coca-Cola.',
      message: 'Show me the dividend history of Coca-Cola.'
    },
    {
      heading: 'Find the top gainers and ',
      subheading: `losers in the market today.`,
      message: `Find the top gainers and losers in the market today.`
    },
    {
      heading: `What are the top stocks in `,
      subheading: 'the energy sector?',
      message: `What are the top stocks in the energy sector?`
    },
    {
      heading: 'Display a real-time chart ',
      subheading: 'for Amazon.',
      message: `Display a real-time chart for Amazon.`
    },
    {
      heading: 'Which stocks have the ',
      subheading: 'highest volume today?',
      message: 'Which stocks have the highest volume today?'
    }
  ]

  interface ExampleMessage {
    heading: string
    subheading: string
    message: string
  }

  const [randExamples, setRandExamples] = useState<ExampleMessage[]>([])

  useEffect(() => {
    const shuffledExamples = [...exampleMessages].sort(
      () => 0.5 - Math.random()
    )
    setRandExamples(shuffledExamples)
  }, [])

  return (
    <div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <ButtonScrollToBottom
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />

      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="mb-4 grid grid-cols-2 gap-2 px-4 sm:px-0">
          {messages.length === 0 &&
            randExamples.map((example, index) => (
              <div
                key={example.heading}
                className={`rounded-md
                    cursor-pointer border bg-white p-4 
                    hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-950
                    ${index >= 4 ? 'hidden md:block' : ''}
                    ${index >= 2 ? 'hidden 2xl:block' : ''}
                  `}
                onClick={async () => {
                  setMessages(currentMessages => [
                    ...currentMessages,
                    {
                      id: nanoid(),
                      display: <UserMessage>{example.message}</UserMessage>
                    }
                  ])

                  const responseMessage = await submitUserMessage(
                    example.message
                  )
                  setMessages(currentMessages => [
                    ...currentMessages,
                    responseMessage
                  ])
                }}
              >
                <div className="text-sm font-semibold">{example.heading}</div>
                <div className="text-sm text-zinc-600">
                  {example.subheading}
                </div>
              </div>
            ))}
        </div>

        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:border md:py-4 rounded-md">
          <PromptForm input={input} setInput={setInput} />
          <FooterText className="hidden sm:block" />
        </div>
      </div>
    </div>
  )
}
