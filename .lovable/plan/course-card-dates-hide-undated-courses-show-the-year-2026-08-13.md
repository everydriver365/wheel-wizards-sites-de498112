# Course card dates: hide undated courses, show the year

## What the data actually says

- **"10 Hour Intensive" – 14 JUL**: its `start_date` is **2028-07-14**. Genuinely future, so the filter kept it correctly — but the rail prints only day + month, so it reads like a past July.
- **"101101"**: both `start_date` and `available_from` are **null**, so there is no date to render and the rail is blank.

## Proposed changes

1. **Don't show courses with no start date.** Drop the "date is null" allowance from the course queries so only courses with a real, future `start_date`/`available_from` appear. "101101" disappears from the site.
2. **Show the year when it isn't the current year.** The rail becomes `14 JUL 2028`, so a far-future course can't be mistaken for a past one.

## Technical notes

- Queries: `src/routes/$slug.index.tsx` and `src/routes/$slug.courses.tsx` — require a future date instead of allowing nulls (`available_from.gte.today` OR `start_date.gte.today`, with no `is.null` branch).
- Card: `src/components/IOSCourseCard.tsx` — extend `splitDate` to return the year and render a small year line under the month when it differs from the current year.
- No schema or data changes.
