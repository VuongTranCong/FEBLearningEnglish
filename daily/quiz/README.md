# Quiz – Đọc thẻ từ (flashcard PDF pages)

The quiz loads the **current day’s flashcard PDF(s)**, splits them into **one card per page**, and shows the pages in **random order** so the kid can read each flashcard.

## How it works

- Uses the same PDFs as “Thẻ từ (PDF)” for the selected day.
- **PDF.js** loads each PDF and turns every page into a card.
- Cards from all of that day’s PDFs are merged, shuffled, and shown one by one.
- **“Thẻ tiếp theo”** → next card (after the last card, order is reshuffled).
- **“Xáo trộn lại”** → reshuffle and start from the first card again.

## CORS when PDFs are on Google Drive

If the PDFs are served from **Google Drive**, the browser may block loading them into the quiz (CORS). In that case you may see: *“Không tải được thẻ từ”*.

- **Option 1:** Serve the same PDFs from your own site (same origin) so the quiz can load them.
- **Option 2:** Keep using the PDF viewer above to open the PDF; the quiz will only work when the app and PDFs are on the same origin.

No manual word list is needed; the quiz reads the PDFs directly.
