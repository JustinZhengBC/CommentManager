# Comment Manager

Firefox extension that adds a sortable and orderable comment list popup with multiple selection.

This extension is still a work in progress.

![screenshot](/screenshot.png)

# Usage

Click the blue square in the URL bar to use the extension. On Windows, the shortcut for this is `ctrl+q`. On Macs, the shortcut for this is `ctrl+z` (not command, ctrl).

`1-9` for quick-selecting comments.

`z` or `enter` to save changes and copy the selected comments (each on its own line) to the clipboard.

`esc` or clicking outside the popup will cause changes to be lost.

Type `{Option A|Option B}` to make a drop-down box for variations on a comment. This feature is only recommended when the options are mutually exclusive.

Type `\{Option A|Option B}` to display `{Option A|Option B}` as text. The `|` that separates the options can be escaped similarly.

If the extension does not react, the local data might be corrupted. Try deleting all the comments.

# Installation

This extension is not signed (yet) so you will have to install it as a temporary extension.

1. Download this extension and extract it into its own folder

2. Enter "about:debugging" in the URL bar

3. Choose "Load Temporary Add-on"

4. When prompted for a file, select manifest.json

Reinstallation will be required if the browser is restarted. The comment data should be preserved, however.

# Data usage

This extension stores your comments locally and syncs them to your Firefox account. It does not send them anywhere else.
