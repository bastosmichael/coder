# AGENTS.md for Coder

## Overview of Agents in this Repository

This document outlines the roles, triggers, behaviors, and outputs of all LLM-based or autonomous agents used in the Coder project. It serves as a reference for contributors and AI tooling to understand and utilize these agents effectively.

## Table of Agents

| Name                | Description                                    | Trigger           |
|---------------------|------------------------------------------------|-------------------|
| Doc Writer          | Generates README files and documentation.      | CI event          |
| Test Case Generator | Creates test cases based on code changes.      | Pull request      |
| CI Workflow Agent   | Sets up CI workflows for new projects.         | New project setup |
| Template Generator  | Creates templates for issues and pull requests.| Command           |

## Detailed Breakdown of Each Agent

### Doc Writer

**Name:** Doc Writer

**Description:** The Doc Writer agent is responsible for generating README files and other documentation based on the project's structure and content.

**Trigger:** This agent is triggered by a CI event, specifically when a new branch is pushed or a pull request is opened.

**Inputs and Outputs:**
- **Inputs:** Project structure, existing documentation, and code files.
- **Outputs:** A generated README.md file and other documentation files.

**Logic Location:** `/agents/doc-writer.ts`

**Review or Audit Process:** The generated documentation is reviewed by the project team before merging into the main branch.

### Test Case Generator

**Name:** Test Case Generator

**Description:** This agent automatically generates test cases based on code changes detected in pull requests.

**Trigger:** Triggered by the opening of a pull request.

**Inputs and Outputs:**
- **Inputs:** Code changes from the pull request.
- **Outputs:** Generated test case files.

**Logic Location:** `/agents/test-case-generator.ts`

**Review or Audit Process:** The generated test cases are reviewed by the QA team before merging.

### CI Workflow Agent

**Name:** CI Workflow Agent

**Description:** Sets up CI workflows for new projects, ensuring they are properly configured for continuous integration.

**Trigger:** Triggered when a new project is set up in the system.

**Inputs and Outputs:**
- **Inputs:** Project configuration and requirements.
- **Outputs:** A `.github/workflows` directory with CI workflow files.

**Logic Location:** `/agents/ci-workflow-agent.ts`

**Review or Audit Process:** The CI workflows are reviewed by the DevOps team before activation.

### Template Generator

**Name:** Template Generator

**Description:** Generates templates for issues and pull requests to standardize project contributions.

**Trigger:** Triggered by a command from the project manager or contributor.

**Inputs and Outputs:**
- **Inputs:** Template requirements and project specifics.
- **Outputs:** Template files for issues and pull requests.

**Logic Location:** `/agents/template-generator.ts`

**Review or Audit Process:** Templates are reviewed by the project manager before being used.

## How to Invoke Each Agent

### Doc Writer
- **CLI:** `npm run doc-writer`
- **CI:** Automatically triggered on push to main branch.

### Test Case Generator
- **CLI:** `npm run test-case-generator`
- **CI:** Automatically triggered on pull request.

### CI Workflow Agent
- **CLI:** `npm run ci-workflow-setup`
- **CI:** Automatically triggered on new project setup.

### Template Generator
- **CLI:** `npm run template-generator`
- **Prompt:** Use the command `/generate-template` in the project management tool.

## Future Agent Proposals

- **Code Review Agent:** An agent that automatically reviews code for best practices and potential issues.

## Contribution Instructions for New Agents

To contribute a new agent to the Coder project, follow these steps:

1. **Identify the Need:** Determine what functionality the new agent should provide.
2. **Develop the Agent:** Write the code for the agent, ensuring it follows the project's coding standards.
3. **Document the Agent:** Add a section to this `AGENTS.md` file with all the required details.
4. **Submit a Pull Request:** Open a pull request with the new agent code and updated documentation.
5. **Review and Merge:** The agent will be reviewed by the team, and upon approval, merged into the main branch.
