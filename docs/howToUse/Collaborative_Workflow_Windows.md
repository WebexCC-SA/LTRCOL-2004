# Collaborative Editing Workflow (Windows) - LTRCOL-2004 Lab Guide

## Prerequisites

- Git for Windows installed (https://git-scm.com/download/win)
- VSCode or Cursor installed
- Python 3.x installed (https://www.python.org/downloads/)
- Access to the GitHub repository

**About the commands in this guide:**
- `REM` = Comment (doesn't execute, just explains the command)
- You can skip typing `REM` lines - they're just explanations
- Example: `REM Check status` ← just explanation, `git status` ← actual command

---

## Part 1: Initial Setup

**Note:** You can run all commands in this guide using either:
- **Cursor's integrated terminal** (press `Ctrl + ~` to open)
- **Separate Command Prompt window**
- **Cursor's Source Control panel** (branch icon in left sidebar for visual Git operations)

**Recommended:** Use Cursor's integrated terminal for convenience!

**Where to find Cursor's terminal:**
1. Press `Ctrl + ~` (tilde/backtick key)
2. Terminal panel opens at bottom of Cursor window
3. You can have multiple terminal tabs
4. Already in the right folder if you opened the project

**Where to find Cursor's Source Control (Visual Git):**
1. Click the branch icon in left sidebar (looks like a fork/tree)
2. See changed files listed
3. Click `+` to stage files
4. Type commit message at top
5. Click checkmark to commit
6. Use `...` menu to push/pull

### Step 1: Clone the Repository

Open **Command Prompt** (or Cursor's terminal):

```cmd
cd %USERPROFILE%\Documents
git clone https://github.com/WebexCC-SA/LTRCOL-2004.git
cd LTRCOL-2004
```

**Note:** Replace the URL with your actual repository URL.

### Step 2: Set Up Python Virtual Environment

Open **Command Prompt** and run:

```cmd
cd LTRCOL-2004
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

This installs all MkDocs dependencies locally.

### Step 3: Verify Setup Works

```cmd
mkdocs build
```

Should complete with no errors. ✅

### Step 4: Create Your Branch

Each person works on their own branch:

```cmd
git checkout -b module1-edits
```

Use `module2-edits` or `module3-edits` based on your assignment.

**Why branches?** Each person can work independently without conflicts.

---
## Part 2: Daily Workflow

### Start Your Session

Open **Command Prompt** and run:

```cmd
cd %USERPROFILE%\Documents\LTRCOL-2004
git checkout module1-edits
git pull origin main
source venv/bin/activate
python serve-with-watch.py
```

Open browser to: **http://127.0.0.1:8000**

### During Work: Edit and Preview

**Your Module Assignments:**
- **Module 1:** `docs\module1_identity.md`
- **Module 2:** `docs\module2_zero_trust_encryption.md`
- **Module 3:** `docs\module3_compliance.md`

**Workflow Loop:**

1. **Edit** your module file in VSCode/Cursor

2. **Save** file (`Ctrl+S`)

3. **Rebuild** - Open a new terminal and run:
   ```cmd
   cd %USERPROFILE%\Documents\LTRCOL-2004
   venv\Scripts\activate
   mkdocs build
   ```
   
   **OR use the rebuild script:**
   ```cmd
   rebuild.bat
   ```

4. **Refresh** browser (`F5` or `Ctrl+R`)

5. **Repeat** steps 1-4 as needed
<br><br>
---

### Save Your Work

When you're done for the day:

```cmd
cd %USERPROFILE%\Documents\LTRCOL-2004

REM Check what branch you're on
git branch

REM The branch with * is your current branch
REM Example output:
REM   main
REM * module1-edits  <-- This is your current branch

REM Check what you changed
git status
git diff

REM Stage your changes
git add docs\module1_identity.md

REM Commit with a descriptive message
git commit -m "Module 1: Fixed licensing section formatting"

REM Push your branch to GitHub (use YOUR branch name from git branch command)
git push origin module1-edits
```

**Quick tip:** Your branch name is also shown in:
- Cursor's bottom-left corner (click it to switch branches)
- Cursor's Source Control panel at the top

---

## Part 3: Merging Changes

### When You Finish Your Module

```cmd
REM 1. Make sure everything is committed
git status

REM 2. Switch to main and pull latest
git checkout main
git pull origin main

REM 3. Merge your branch
git merge module1-edits

REM 4. Test everything works
mkdocs build

REM 5. Push to main
git push origin main

REM 6. Notify team via email/chat
```

### When Someone Else Pushes to Main

Update your branch with their changes:

```cmd
REM 1. Commit your current work (include descriptive comments)
git add .
git commit -m "Updated screenshots and fixed typos"

REM 2. Get the updates
git checkout main
git pull origin main

REM 3. Go back to your branch and merge
git checkout module2-edits
git merge main

REM 4. Rebuild and test
mkdocs build
mkdocs serve

REM 5. Continue working
```

---

## Part 4: Best Practices

### DO ✅

- Work only on YOUR assigned module
- Commit at end of each work session  
- Pull from main at start of each day
- Test with `mkdocs build` before pushing
- Use clear commit messages
- Notify team when you push to main

### DON'T ❌

- Edit other people's modules
- Commit directly to main branch (use your branch)
- Push without testing first
- Leave work uncommitted overnight
- Force push (`git push -f`)

### Good Commit Message Examples

```
Module 1: Fixed image indentation in SSO section
Module 2: Added missing watermarking setup steps
Module 3: Corrected Cloudlock configuration screenshots
Fixed broken internal links in Module 1
Updated all media paths from media/media/ to media/
```

---

## Part 5: Troubleshooting

### Port 8000 Already in Use

```cmd
REM Find what's using it
netstat -ano | findstr :8000

REM Note the PID number, then kill it:
taskkill /PID <number> /F

REM Try starting server again
mkdocs serve
```

**OR use a different port:**
```cmd
mkdocs serve --dev-addr 127.0.0.1:8001
```
Then access at `http://127.0.0.1:8001`

### Changes Not Showing in Browser

1. Check you saved the file (`Ctrl+S`)
2. Run `rebuild.bat` or `mkdocs build`
3. Hard refresh browser (`Ctrl+Shift+F5`)
4. Check server is still running

### Merge Conflicts

If Git shows conflict markers in your file:

```
<<<<<<< HEAD
Your version
=======
Their version
>>>>>>> branch-name
```

**To resolve:**
1. Open file in VSCode/Cursor
2. Decide which version to keep
3. Remove the `<<<<<<<`, `=======`, and `>>>>>>>` markers
4. Save the file
5. Complete the merge:
   ```cmd
   git add <conflicted-file>
   git commit -m "Resolved merge conflict"
   ```

### Can't Push Changes

```cmd
REM Pull first
git pull origin main

REM Resolve any conflicts if needed

REM Then push
git push origin module1-edits
```

### Python/Virtual Environment Issues

If you get `python` not found:
```cmd
REM Try py launcher instead
py -m venv venv
py -m pip install -r requirements.txt
```

If `venv\Scripts\activate` doesn't work:
```cmd
REM Make sure you're in the LTRCOL-2004 directory
cd %USERPROFILE%\Documents\LTRCOL-2004

REM Try the full path
%USERPROFILE%\Documents\LTRCOL-2004\venv\Scripts\activate
```

---

## Part 6: Useful Git Commands

### Check Your Status

```cmd
git status              REM What files changed?
git branch              REM What branch am I on?
git log --oneline       REM Recent commits
git diff                REM See detailed changes
```

### Branch Operations

```cmd
git branch -a           REM List all branches
git checkout main       REM Switch to main
git checkout -b new-branch  REM Create new branch
git branch -d old-branch    REM Delete a branch
```

### Undo Changes

```cmd
REM Undo uncommitted changes to a file
git checkout -- <file>

REM Undo last commit (keep changes)
git reset --soft HEAD~1

REM See what changed in last commit
git show
```

---

## Part 7: Markdown Formatting Reference

### Images in List Items

Use **6 spaces** of indentation:

```markdown
1. Step text

      ![](./media/image1.png)
```

### Text Continuation

Use **3 spaces** of indentation:

```markdown
1. Step text
   
   More explanation text here.
```

### Sub-Bullets

```markdown
1. Main step

   a. Sub-step (3 spaces)
   
      i. Sub-sub-step (7 spaces)
      
          ![](./media/image.png) (10 spaces under i.)
```

### Images Between Paragraphs

Use **0 spaces** (no indentation):

```markdown
Regular paragraph text.

![](./media/image.png)

Another paragraph.
```

---

## Part 8: Publishing the Final Version

When all modules are complete:

```cmd
REM 1. Make sure on main with all changes
git checkout main
git pull origin main

REM 2. Build final version
mkdocs build

REM 3. Test the site
mkdocs serve
REM Verify in browser

REM 4. Push to main
git push origin main

REM 5. Deploy (if using GitHub Pages)
mkdocs gh-deploy
```

---

## Quick Reference Card

### Start Working (Each Day)

```cmd
cd %USERPROFILE%\Documents\LTRCOL-2004
git checkout module1-edits
git pull origin main
venv\Scripts\activate
mkdocs serve
```

Browser: `http://127.0.0.1:8000`

### Edit → Preview Loop

1. Edit file in VSCode/Cursor
2. Save (`Ctrl+S`)
3. Run: `rebuild.bat`
4. Refresh browser (`F5`)
5. Repeat

### Save Work (Each Day)

```cmd
git add docs\module1_identity.md
git commit -m "Descriptive message"
git push origin module1-edits
```

### Stop Server

Press `Ctrl+C` in the terminal where `mkdocs serve` is running

---

## File Structure

```
LTRCOL-2004\
├── docs\
│   ├── module1_identity.md           ← Person 1
│   ├── module2_zero_trust_encryption.md  ← Person 2
│   ├── module3_compliance.md         ← Person 3
│   ├── media\
│   │   └── image*.png
│   └── ...
├── mkdocs.yml
├── requirements.txt
├── venv\
├── rebuild.bat          ← Windows rebuild script
└── rebuild.sh           ← Mac/Linux rebuild script
```

---

## Support Files

- **Mac/Linux Guide:** `Collaborative_Workflow_Mac_Linux.md`
- **Module Cleanup Script:** `cleanup_module_script.py`
- **Cleanup Instructions:** `Module_Cleanup_Instructions.md`
- **Quick Start Card:** `Quick_Start_Card_For_Team.txt`

---

## Getting Help

- **MkDocs Documentation:** https://www.mkdocs.org/
- **Git Documentation:** https://git-scm.com/doc
- **Material Theme:** https://squidfunk.github.io/mkdocs-material/
- **Git for Windows:** https://git-scm.com/download/win

---

**Created:** October 28, 2025  
**Project:** LTRCOL-2004 Webex Security Lab Guide  
**Platform:** Windows

