"use client"

import { deleteIssue, updateIssuesFromGitHub } from "@/db/queries/issues-queries"
import { SelectIssue } from "@/db/schema/issues-schema"
import { DataItem } from "../dashboard/reusable/data-item"
import { DataList } from "../dashboard/reusable/data-list"
import { Loader2, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface IssuesListProps {
  issues: SelectIssue[]
  projectId: string
}

export function IssuesList({ issues, projectId }: IssuesListProps) {
  const router = useRouter()
  const [updating, setUpdating] = useState(false)
  const handleIssueDelete = async (id: string) => {
    await deleteIssue(id)
  }

  const handleUpdateIssues = async () => {
    setUpdating(true)
    try {
      await updateIssuesFromGitHub(projectId)
      router.refresh()
    } finally {
      setUpdating(false)
    }
  }

  return (
    <DataList
      title="Issues"
      subtitle="Manage issues"
      readMoreLink="https://docs.ephemyral-coder.ai/core-components/issues"
      readMoreText="Read more"
      createLink={`./issues/create`}
      createText="Create issue"
      dataListTitle="Issues"
      actionButton={
        <button
          aria-label="Refresh issues"
          className="inline-flex items-center"
          onClick={handleUpdateIssues}
          disabled={updating}
        >
          {updating ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <RefreshCw className="size-4" />
          )}
        </button>
      }
    >
      {issues.length > 0 ? (
        issues.map(issue => (
          <DataItem
            key={issue.id}
            data={{ id: issue.id, name: issue.name }}
            type="issues"
            onDelete={handleIssueDelete}
          />
        ))
      ) : (
        <div>No issues found.</div>
      )}
    </DataList>
  )
}
