<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the Team Leader cap fixed at three while allowing unlimited members per team, because this is a core business rule.
- Treat project editor tabs as partial updates so saving one tab never resets fields owned by another tab.
- Read admin project inventory by authenticated project ID rather than public slug so drafts and newly added floors remain editable.
- Keep AI layout extraction in server-only SDK modules and return review-only structured data; inventory writes require separate explicit admin actions.
- Revalidate model-derived layout counts deterministically in shared code so missing floors and duplicate units cannot silently pass review.
