# Course card date rail: why those two cards look wrong

## What the data actually says

Both cards are showing the truth — the rail just hides it.

- **"10 Hour Intensive" – 14 JUL**: its `start_date` is **2028-07-14**. That is in the future, so the filter correctly kept it. The rail prints only day + month, so a 2028 date reads as "last July".
- **"101101"**: both `start_date` and `available_from` are **null** in the database. There is no date to show, so the rail renders empty.

So nothing is broken in the query — the rail is just ambiguous for far-future dates and blank for undated courses.

## Proposed fix (presentation only)

1. **Show the year when it isn't the current year.** The rail becomes day / month / year (e.g. `14 JUL 2028`), so a 2028 course can't be mistaken for a past one. Dates in the current year stay as day + month.
2. **Give undated courses a rail too.** Instead of a blank strip, show a short label such as "FLEXIBLE START" so the card looks complete and tells the pupil dates are arranged on booking.

## Technical notes

- Single file: `src/components/IOSCourseCard.tsx`.
- Extend `splitDate` to also return the year; render it as a small line under the month when `year !== currentYear`.
- When `dateValue` is null, render the navy rail with the stacked "FLEXIBLE / START" text rather than skipping it.
- No query, schema, or data changes.
