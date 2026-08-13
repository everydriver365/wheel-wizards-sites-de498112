# Connect DSM Sites to GitHub

No code changes needed. This project currently has no GitHub remote — its git history lives only in Lovable's internal storage, which is why nothing shows up in GitHub.

## Steps (in the Lovable UI)

1. In the chat input, open the **+** menu -> **GitHub** -> **Connect project**.
2. Authorize the Lovable GitHub App when prompted.
3. Choose the GitHub account or organisation for the new repository.
4. Click **Create Repository**.

After that, edits in Lovable push to GitHub automatically, and pushes to GitHub sync back into Lovable.

## Notes

- Only one GitHub account can be linked per Lovable account.
- Importing an existing GitHub repo into Lovable is not supported; this flow creates a fresh repo from the project's code.
- The project history so far is preserved and lands in the new repo on the first sync.