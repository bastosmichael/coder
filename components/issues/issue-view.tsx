"use client"

import { generateOpenAIResponse } from "@/actions/ai/generate-openai-response"
import { generateAnthropicResponse } from "@/actions/ai/generate-anthropic-response"
import { generateGrokResponse } from "@/actions/ai/generate-grok-response"
import { generateOllamaResponse } from "@/actions/ai/generate-ollama-response"

import { deleteGitHubPR } from "@/actions/github/delete-pr"
import { embedTargetBranch } from "@/actions/github/embed-target-branch"
import { generatePR } from "@/actions/github/generate-pr"
import { getMostSimilarEmbeddedFiles } from "@/actions/retrieval/get-similar-files"
import { MessageMarkdown } from "@/components/instructions/message-markdown"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import {
  createIssueMessageRecord,
  deleteIssue,
  deleteIssueMessagesByIssueId,
  getIssueMessagesByIssueId,
  updateIssue,
  updateIssueMessage
} from "@/db/queries"
import { SelectIssue, SelectIssueMessage, SelectProject } from "@/db/schema"
import { buildCodeGenPrompt } from "@/lib/ai/build-codegen-prompt"
import { buildCodePlanPrompt } from "@/lib/ai/build-plan-prompt"
import { parseAIResponse } from "@/lib/ai/parse-ai-response"
import { Loader2, Pencil, Play, RefreshCw, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { useEffect, useRef, useState } from "react"
import { CRUDPage } from "../dashboard/reusable/crud-page"
import { parseStringPromise } from "xml2js"

interface IssueViewProps {
  item: SelectIssue
  project: SelectProject
  attachedInstructions: {
    instructionId: string
    issueId: string
    instruction: {
      id: string
      content: string
      name: string
    }
  }[]
  workspaceId: string
}

let globalSequence = 1

// Function to sanitize and convert XML to Markdown
export const sanitizeAndConvertXMLToMarkdown = async (xmlContent: string) => {
  // If the content doesn't look like XML, return it as-is to avoid parsing errors
  if (!xmlContent.trim().startsWith("<")) {
    return xmlContent
  }

  try {
    const parsedXml = await parseStringPromise(xmlContent, { trim: true })

    let markdownContent = ""

    const convertToMarkdown = (obj: any, depth: number = 0) => {
      for (const [key, value] of Object.entries(obj)) {
        if (Array.isArray(value)) {
          value.forEach(item => {
            if (typeof item === "string") {
              markdownContent += `${"#".repeat(depth + 1)} ${key}\n\n`
              markdownContent += `${item}\n\n`
            } else {
              markdownContent += `${"#".repeat(depth + 1)} ${key}\n\n`
              convertToMarkdown(item, depth + 1)
            }
          })
        }
      }
    }

    convertToMarkdown(parsedXml)
    return markdownContent
  } catch (error) {
    console.error("Error converting XML to Markdown:", error)
    return xmlContent // Return the original content if parsing fails
  }
}

// Update message with sanitization and Markdown conversion
export const updateMessageWithSanitization = async (
  messageId: string,
  content: string,
  setMessages: React.Dispatch<React.SetStateAction<SelectIssueMessage[]>>
) => {
  // Sanitize and convert to Markdown
  const sanitizedMarkdownContent =
    await sanitizeAndConvertXMLToMarkdown(content)

  // Update the message with the sanitized and converted content
  await updateIssueMessage(messageId, { content: sanitizedMarkdownContent })
  setMessages(prev =>
    prev.map(message =>
      message.id === messageId
        ? { ...message, content: sanitizedMarkdownContent }
        : message
    )
  )
}

export const IssueView: React.FC<IssueViewProps> = ({
  item,
  project,
  attachedInstructions,
  workspaceId
}) => {
  const router = useRouter()

  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)
  const [selectedInstruction, setSelectedInstruction] = React.useState<{
    id: string
    content: string
    name: string
  } | null>(null)
  const [isRunningAI, setIsRunningAI] = React.useState(false)
  const [isRunningAnthropic, setIsRunningAnthropic] = React.useState(false)
  const [isRunningGrok, setIsRunningGrok] = React.useState(false)
  const [isRunningOllama, setIsRunningOllama] = React.useState(false)

  const [isCreatingPR, setIsCreatingPR] = React.useState(false)
  const [messages, setMessages] = useState<SelectIssueMessage[]>([])

  const sequenceRef = useRef(globalSequence)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    fetchMessages()
  }, [item.id])

  useEffect(() => {
    scrollToBottom()
  }, [
    messages,
    isCreatingPR,
    isRunningAI,
    isRunningAnthropic,
    isRunningGrok,
    isRunningOllama
  ])

  const addMessage = async (content: string) => {
    const newMessage = await createIssueMessageRecord({
      issueId: item.id,
      content,
      sequence: sequenceRef.current++
    })
    setMessages(prev => [...prev, newMessage])
    globalSequence = sequenceRef.current
    return newMessage
  }

  const updateMessage = async (id: string, content: string) => {
    await updateIssueMessage(id, { content })
    setMessages(prev =>
      prev.map(message =>
        message.id === id ? { ...message, content } : message
      )
    )
  }

  const fetchMessages = async () => {
    const fetchedMessages = await getIssueMessagesByIssueId(item.id)
    setMessages(fetchedMessages.sort((a, b) => a.sequence - b.sequence))
    sequenceRef.current =
      Math.max(...fetchedMessages.map(m => m.sequence), 0) + 1
    globalSequence = sequenceRef.current
  }

  const handleDelete = async () => {
    try {
      await deleteIssue(item.id)
      setIsDeleteOpen(false)
      router.push(`../issues`)
    } catch (error) {
      console.error("Failed to delete issue:", error)
    }
  }

  const handlePRCreation = async (issue: SelectIssue) => {
    try {
      setIsCreatingPR(true)
      let aiCodeGenResponse = null
      if (issue.planResponse !== null) {
        aiCodeGenResponse = await generateOpenAIResponse([
          { role: "user", content: issue.planResponse }
        ])

        await updateIssue(issue.id, {
          codeGenResponse: aiCodeGenResponse
        })
      } else {
        aiCodeGenResponse = issue.codeGenResponse
      }

      let parsedAIResponse = null
      if (aiCodeGenResponse !== null) {
        parsedAIResponse = parseAIResponse(aiCodeGenResponse)
      } else {
        throw new Error("No code generation response found.")
      }

      const prMessage = await addMessage("Generating GitHub PR...")

      const { prLink, branchName } = await generatePR(
        issue.name.replace(/\s+/g, "-"),
        project,
        parsedAIResponse
      )

      if (issue.runner !== null) {
        await updateIssue(issue.id, {
          status: `completed`,
          prLink: prLink || undefined,
          prBranch: branchName
        })

        await updateMessage(
          prMessage.id,
          `Generated GitHub PR: [${prLink}](${prLink})`
        )
        setIsCreatingPR(false)
      } else {
        throw new Error("No runner found.")
      }
    } catch (error) {
      console.error("Failed to create PR:", error)
      await addMessage(`Error: Failed to create PR: ${error}`)
      await updateIssue(issue.id, { status: "failed" })
      setIsCreatingPR(false)
    }
  }

  // Updated to handle 'Grok' and 'Ollama' runners in addition to 'AI' and 'Anthropic'
  const handleRun = async (issue: SelectIssue, runner: string) => {
    if (!project.githubRepoFullName || !project.githubTargetBranch) {
      alert("Please connect your project to a GitHub repository first.")
      return
    }

    const setIsRunning = (state: boolean) => {
      if (runner === "AI") setIsRunningAI(state)
      else if (runner === "Anthropic") setIsRunningAnthropic(state)
      else if (runner === "Grok") setIsRunningGrok(state)
      else if (runner === "Ollama") setIsRunningOllama(state)
    }

    setIsRunning(true)
    try {
      await deleteIssueMessagesByIssueId(issue.id)
      setMessages([])
      sequenceRef.current = 1
      globalSequence = 1

      await addMessage("Embedding target branch...")

      // Embed the target branch to make sure embeddings are up to date
      await embedTargetBranch({
        projectId: project.id,
        githubRepoFullName: project.githubRepoFullName,
        branchName: project.githubTargetBranch,
        installationId: project.githubInstallationId
      })

      await updateIssue(issue.id, { status: "in_progress", runner })

      let planMessageContent = ""
      if (runner === "AI") {
        planMessageContent = "Generating plan using OpenAI..."
      } else if (runner === "Anthropic") {
        planMessageContent = "Generating plan using Anthropic..."
      } else if (runner === "Grok") {
        planMessageContent = "Generating plan using Grok..."
      } else if (runner === "Ollama") {
        planMessageContent = "Generating plan using Ollama..."
      }

      const planMessage = await addMessage(planMessageContent)

      const embeddingsQueryText = `${issue.name} ${issue.content}`
      const codebaseFiles = await getMostSimilarEmbeddedFiles(
        embeddingsQueryText,
        project.id
      )

      const instructionsContext = attachedInstructions
        .map(
          ({ instruction }) =>
            `<instruction name="${instruction.name}">\n${instruction.content}\n</instruction>`
        )
        .join("\n\n")

      const codeplanPrompt = await buildCodePlanPrompt({
        issue: {
          name: issue.name,
          description: issue.content
        },
        codebaseFiles: codebaseFiles.map(file => ({
          path: file.path,
          content: file.content ?? ""
        })),
        instructionsContext
      })

      let aiCodePlanResponse: string = ""

      // Generate response based on which runner is selected
      if (runner === "AI") {
        aiCodePlanResponse = await generateOpenAIResponse([
          { role: "user", content: codeplanPrompt }
        ])
      } else if (runner === "Anthropic") {
        aiCodePlanResponse = await generateAnthropicResponse([
          { role: "user", content: codeplanPrompt }
        ])
      } else if (runner === "Grok") {
        aiCodePlanResponse = await generateGrokResponse([
          { role: "user", content: codeplanPrompt }
        ])
      } else if (runner === "Ollama") {
        aiCodePlanResponse = await generateOllamaResponse([
          { role: "user", content: codeplanPrompt }
        ])
      }

      if (!aiCodePlanResponse || aiCodePlanResponse.trim() === "") {
        throw new Error("AI response is empty or undefined.")
      }

      // Use updated message function with sanitization
      await updateMessageWithSanitization(
        planMessage.id,
        aiCodePlanResponse,
        setMessages
      )

      const codegenPrompt = await buildCodeGenPrompt({
        issue: { title: issue.name, description: issue.content },
        codebaseFiles: codebaseFiles.map(file => ({
          path: file.path,
          content: file.content ?? ""
        })),
        plan: aiCodePlanResponse,
        instructionsContext
      })

      if (issue.prLink && issue.prBranch) {
        await deleteGitHubPR(project, issue.prLink, issue.prBranch)
      }

      await updateIssue(issue.id, {
        status: `completed`,
        prLink: null,
        prBranch: null,
        runner,
        planResponse: codegenPrompt,
        codeGenResponse: null
      })

      await addMessage(`Completed ${runner}. Ready for PR creation.`)
    } catch (error) {
      console.error("Failed to run issue:", error)
      await addMessage(`Error: Failed to run issue: ${error}`)
      await updateIssue(issue.id, { status: "failed" })
    } finally {
      setIsRunning(false)
    }
  }

  // Slightly updated to handle "Grok" and "Ollama" as well
  const handleRerun = async (issue: SelectIssue, runner: string) => {
    if (issue.prLink && issue.prBranch) {
      await deleteGitHubPR(project, issue.prLink, issue.prBranch)
    }
    await updateIssue(issue.id, {
      prLink: null,
      prBranch: null,
      status: "ready",
      runner,
      planResponse: null,
      codeGenResponse: null
    })
    await handleRun(issue, runner)
  }

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <CRUDPage
      pageTitle={item.name}
      backText="Back to Issues"
      backLink={`../issues`}
    >
      <div className="mb-4 flex justify-start gap-2">
        {/* OpenAI button */}
        <Button
          variant="create"
          size="sm"
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() =>
            item.runner === "AI" && item.status === "completed"
              ? handleRerun(item, "AI")
              : handleRun(item, "AI")
          }
          disabled={
            isRunningAI ||
            isRunningAnthropic ||
            isRunningGrok ||
            isRunningOllama ||
            isCreatingPR
          }
        >
          {isRunningAI ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Running OpenAI...
            </>
          ) : item.runner === "AI" && item.status === "completed" ? (
            <>
              <RefreshCw className="mr-2 size-4" />
              Run OpenAI Again
            </>
          ) : (
            <>
              <Play className="mr-2 size-4" />
              Run OpenAI
            </>
          )}
        </Button>


        {/* Anthropic button */}
        <Button
          variant="create"
          size="sm"
          className="bg-green-600 hover:bg-green-700"
          onClick={() =>
            item.runner === "Anthropic" && item.status === "completed"
              ? handleRerun(item, "Anthropic")
              : handleRun(item, "Anthropic")
          }
          disabled={
            isRunningAI ||
            isRunningAnthropic ||
            isRunningGrok ||
            isRunningOllama ||
            isCreatingPR
          }
        >
          {isRunningAnthropic ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Running Anthropic...
            </>
          ) : item.runner === "Anthropic" && item.status === "completed" ? (
            <>
              <RefreshCw className="mr-2 size-4" />
              Run Anthropic Again
            </>
          ) : (
            <>
              <Play className="mr-2 size-4" />
              Run Anthropic
            </>
          )}
        </Button>

        <Button
          variant="create"
          size="sm"
          className="bg-orange-600 hover:bg-orange-700"
          onClick={() =>
            item.runner === "Grok" && item.status === "completed"
              ? handleRerun(item, "Grok")
              : handleRun(item, "Grok")
          }
          disabled={
            isRunningAI ||
            isRunningAnthropic ||
            isRunningGrok ||
            isRunningOllama ||
            isCreatingPR
          }
        >
          {isRunningGrok ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Running Grok...
            </>
          ) : item.runner === "Grok" && item.status === "completed" ? (
            <>
              <RefreshCw className="mr-2 size-4" />
              Run Grok Again
            </>
          ) : (
            <>
              <Play className="mr-2 size-4" />
              Run Grok
            </>
          )}
        </Button>

        <Button
          variant="create"
          size="sm"
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() =>
            item.runner === "Ollama" && item.status === "completed"
              ? handleRerun(item, "Ollama")
              : handleRun(item, "Ollama")
          }
          disabled={
            isRunningAI ||
            isRunningAnthropic ||
            isRunningGrok ||
            isRunningOllama ||
            isCreatingPR
          }
        >
          {isRunningOllama ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Running Ollama...
            </>
          ) : item.runner === "Ollama" && item.status === "completed" ? (
            <>
              <RefreshCw className="mr-2 size-4" />
              Run Ollama Again
            </>
          ) : (
            <>
              <Play className="mr-2 size-4" />
              Run Ollama
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            router.push(
              `/${workspaceId}/${item.projectId}/issues/${item.id}/edit`
            )
          }
        >
          <Pencil className="mr-2 size-4" />
          Edit
        </Button>

        <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="mr-2 size-4" />
              Delete
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Issue</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this issue? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {attachedInstructions.length > 0 && (
        <div className="my-6">
          <div className="mb-2 text-lg font-semibold">Attached instruction</div>
          <div className="flex flex-wrap gap-2">
            {attachedInstructions.map(instruction => (
              <Button
                key={instruction.instructionId}
                variant="outline"
                size="sm"
                onClick={() => setSelectedInstruction(instruction.instruction)}
              >
                {instruction.instruction.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      <Card>
        <CardContent className="bg-secondary/50 p-4">
          <MessageMarkdown content={item.content} />
        </CardContent>
      </Card>

      <Separator className="my-6" />

      <div className="space-y-8">
        <div className="text-lg font-semibold">Messages</div>
        {messages.map(message => (
          <React.Fragment key={message.id}>
            <Card>
              <CardContent className="bg-secondary p-4">
                <MessageMarkdown content={message.content} />
              </CardContent>
            </Card>
          </React.Fragment>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="my-6"></div>

      <div className="mb-4 flex justify-start gap-2">
        {(item.status === "completed" || item.status === "failed") &&
          !item.prLink && (
            <>
              <Button
                variant="create"
                size="sm"
                className="bg-teal-600 hover:bg-teal-700"
                onClick={() => handlePRCreation(item)}
                disabled={isCreatingPR}
              >
                {isCreatingPR && !item.codeGenResponse ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Creating PR...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 size-4" />
                    Create PR
                  </>
                )}
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash2 className="mr-2 size-4" />
                Delete
              </Button>
            </>
          )}

        {item.prLink && (
          <Button
            variant="create"
            size="sm"
            className="bg-teal-600 hover:bg-teal-700"
            onClick={() => handlePRCreation(item)}
          >
            {isCreatingPR ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Regenerating PR...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 size-4" />
                Regenerate PR
              </>
            )}
          </Button>
        )}
      </div>

      <Dialog
        open={!!selectedInstruction}
        onOpenChange={() => setSelectedInstruction(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedInstruction?.name}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Card>
              <CardContent className="bg-secondary/50 p-4">
                <MessageMarkdown content={selectedInstruction?.content || ""} />
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </CRUDPage>
  )
}
