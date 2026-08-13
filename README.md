# Instructor Mini Sites (use this)

Build a instructor mini-site platform

called "DSM Sites" — a standalone web

app that displays professional booking

websites for driving instructors.

This connects to an existing Supabase

project. Do not create any new tables

or modify any existing ones.

━━━━━━━━━━━━━━━━━━━━━━

SUPABASE CONNECTION

━━━━━━━━━━━━━━━━━━━━━━

URL: https://bjpqxfrihwjcqprmoqfs.supabase.co

Anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqcHF4ZnJpaHdqY3Fwcm1vcWZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NzQ4MjEsImV4cCI6MjA5NzA1MDgyMX0.hEXJQKMxqtRpsARFMxMwHfK9Czu_U8nYBSAdaKXwEFI

━━━━━━━━━━━━━━━━━━━━━━

ROUTES

━━━━━━━━━━━━━━━━━━━━━━

Only ONE route needed:

  / or /:slug

If no slug → show a simple "Find your

instructor" search page (postcode input,

searches instructors_public table).

If slug provided → show instructor

mini-site.

━━━━━━━━━━━━━━━━━━━━━━

DATA FETCHING

━━━━━━━━━━━━━━━━━━━━━━

Fetch instructor by app_slug:

  supabase

    .from('instructors_public')

    .select('*')

    .eq('app_slug', slug)

    .single()

Fetch courses:

  supabase

    .from('instructor_courses')

    .select('id, course_type, name,

      total_hours, price, start_date,

      image_url, description,

      transmission, available_from')

    .eq('instructor_id', instructor.id)

    .is('deleted_at', null)

    .order('created_at', { ascending: false })

    .limit(6)

Fetch reviews:

  supabase

    .from('reviews')

    .select('id, pupil_name, rating,

      review_text, created_at')

    .eq('instructor_id', instructor.id)

    .order('created_at', { ascending: false })

    .limit(6)

━━━━━━━━━━━━━━━━━━━━━━

DESIGN SYSTEM

━━━━━━━━━━━━━━━━━━━━━━

Font: Poppins (Google Fonts)

Background: #F8F9FB

Cards: #fff, borderRadius 20px,

  boxShadow: 0 4px 0 #E4E4E8,

  0 8px 20px rgba(11,31,58,0.06)

Text: #0B1F3A

Subtext: #6B7686

Border: #E4E8EF

Accent: instructor.brand_colour

  ?? #1877D6

━━━━━━━━━━━━━━━━━━━━━━

PAGE SECTIONS IN ORDER

━━━━━━━━━━━━━━━━━━━━━━

1. STICKY NAV (appears after 100px scroll)

   position fixed, top 0, white bg,

   border-bottom 1px #E4E8EF,

   boxShadow 0 2px 8px rgba(11,31,58,0.08)

   height 60px, padding 0 24px

   display flex, align-items center,

   justify-content space-between

   Left: instructor profile_image_url

     (32px circle) + trading_name

     or name (15px/700 #0B1F3A)

   Centre (hidden on mobile):

     Scroll links — About, Courses,

     Reviews, Contact

     Each scrolls to its section

     fontSize 14, color #6B7686

   Right: "Book now" pill button

     background accent, white text

     borderRadius 50px, padding 8px 20px

     onClick: scroll to enquiry section

2. HERO SECTION

   Full viewport height (100dvh)

   Background: website_hero_image_url

     or profile_image_url

   object-fit cover, object-position center

   position relative

   Overlay: linear-gradient(

     to bottom,

     rgba(0,0,0,0.1) 0%,

     rgba(0,0,0,0.6) 100%

   )

   Content centred (flex, column,

   align center, justify center):

     Trading name / school name:

       fontSize 13, fontWeight 700,

       color rgba(255,255,255,0.7),

       letterSpacing 0.15em,

       textTransform uppercase,

       marginBottom 8

     H1: "Driving lessons in {city}"

       fontSize clamp(32px,6vw,64px)

       fontWeight 800, color #fff

       letterSpacing -0.02em

       lineHeight 1.1

       textAlign center

       maxWidth 700px

       marginBottom 16

     Star rating + review count:

       (only if reviews exist)

       ★★★★★ {avgRating} · {count} reviews

       color rgba(255,255,255,0.8)

       fontSize 14, marginBottom 24

     Two CTA buttons side by side:

       "Book a lesson":

         background accent

         color #fff

         padding 14px 32px

         borderRadius 50px

         fontSize 16, fontWeight 700

         boxShadow 0 4px 0 darken(accent)

         onClick: scroll to enquiry

       "Get in touch":

         background rgba(255,255,255,0.15)

         backdropFilter blur(10px)

         color #fff

         padding 14px 32px

         borderRadius 50px

         fontSize 16, fontWeight 700

         border 1.5px solid

           rgba(255,255,255,0.4)

         onClick: scroll to enquiry

     Scroll indicator at bottom:

       position absolute, bottom 32px

       color rgba(255,255,255,0.5)

       "Scroll to explore ↓"

       fontSize 12

3. STATS BAR

   White background

   4 stats in a row, dividers between:

   {[

     { value: reviewCount + '+',

       label: 'Happy pupils' },

     { value: instructor.dvsa_grade

       ?? 'ADI',

       label: 'DVSA grade' },

     { value: instructor.dvsa_type

       ?? 'Qualified',

       label: 'Licence type' },

     { value: courses.length + '+',

       label: 'Courses' },

   ]}

   Each stat:

     value: fontSize 28, fontWeight 800,

       color accent

     label: fontSize 12, color #6B7686

4. ABOUT SECTION

   background #F8F9FB

   padding 80px 24px

   maxWidth 1100px, margin 0 auto

   Two columns (stacked on mobile):

   Left: profile_image_url

     200px circle

     border 4px solid accent

     boxShadow 0 8px 32px rgba(0,0,0,0.12)

   Right:

     Label: "ABOUT"

       fontSize 11, fontWeight 700,

       color accent, letterSpacing 0.1em,

       textTransform uppercase

     H2: "About {trading_name ?? name}"

       fontSize 28, fontWeight 800,

       color #0B1F3A, marginBottom 16

     Bio text (website_bio):

       fontSize 16, color #6B7686,

       lineHeight 1.7

     Badges (pills):

       dvsa_type: "PDI" or "ADI"

       dvsa_grade: "Grade A/B/C"

       dbs_uploaded: "DBS Checked"

       Each: background #0B1F3A,

         color #fff, borderRadius 50px,

         padding 4px 12px, fontSize 11,

         fontWeight 700

5. COURSES SECTION

   background #fff

   padding 80px 24px

   maxWidth 1100px, margin 0 auto

   Label: "COURSES & PACKAGES"

   H2: "Choose your course"

   Grid: 2 columns desktop,

     1 column mobile, gap 20px

   Each course card:

     background #fff

     borderRadius 20px

     padding 24px

     boxShadow 0 4px 0 #E4E4E8,

       0 8px 20px rgba(11,31,58,0.06)

     Top row:

       Course icon chip (40px circle,

         accent at 15% opacity)

       Course name (16px/700 #0B1F3A)

       Price pill (accent bg, white,

         "£{price}")

     Middle:

       "{total_hours} hours" with

         clock icon (12px #6B7686)

       Start date if set (12px #6B7686)

       Transmission badge if set

     Bottom:

       "Enquire about this course"

         full width button

         accent bg, white text

         borderRadius 50px

         padding 10px

         fontSize 13, fontWeight 700

         onClick: scroll to enquiry section

           and pre-fill course interest

   Empty state: "Contact {name} to

     discuss available courses."

6. REVIEWS SECTION

   background #F8F9FB

   padding 80px 24px

   Only show if reviews.length > 0

   Label: "REVIEWS"

   H2: "What pupils say"

   Grid: 2 columns desktop,

     1 column mobile, gap 16px

   Each review card:

     background #fff

     borderRadius 16px

     padding 20px

     boxShadow 0 4px 0 #E4E4E8

     Stars: ★ filled in accent colour

     Quote text: italic, 16px #0B1F3A,

       lineHeight 1.6

     Pupil name: 13px/700 #0B1F3A

     Date: 11px #9CA3AF

7. ENQUIRY SECTION

   background #fff

   padding 80px 24px

   maxWidth 560px, margin 0 auto

   textAlign center

   Label: "GET IN TOUCH"

   H2: "Send {trading_name ?? name}

     a message"

   Subtitle: "They'll be in touch

     within 24 hours."

   Enquiry form in white card:

     borderRadius 24px

     padding 32px

     boxShadow 0 4px 0 #E4E4E8,

       0 16px 48px rgba(11,31,58,0.1)

   Form fields (iOS grouped list style):

     First name (required)

     Last name (required)

     Phone (required)

     Email

     Pickup address (AddressAutocomplete

       if available, otherwise plain input)

     Course interest (select):

       Manual car lessons

       Automatic car lessons

       Intensive course

       Pass Plus

       Motorway lessons

       Refresher lessons

     Transmission (select):

       Manual / Automatic / No preference

     Hours needed (number)

     Preferred timing (select):

       Morning/Afternoon/Evening/Flexible

     Preferred start date

     Message (textarea)

   Submit button:

     "Send enquiry"

     full width, accent bg, white text

     borderRadius 16px, padding 16px

     fontSize 16, fontWeight 700

   On submit: insert into enquiries table:

     instructor_id: instructor.id

     name: firstName + ' ' + lastName

     phone, email, postcode (from address)

     course_interest, transmission,

     requested_hours, preferred_timing,

     preferred_start_date, notes: message

     status: 'new'

   Success state:

     Green check icon (64px circle

       #DCFCE7 bg, #15803D icon)

     "Enquiry sent!"

     "{name} will be in touch soon."

8. FOOTER

   background #0B1F3A

   padding 48px 24px 32px

   textAlign center

   Instructor name (22px/800 white)

   Scroll links (About/Courses/Reviews

     /Contact) in rgba(255,255,255,0.55)

   Phone number (if exists) as tel: link

   Divider line rgba(255,255,255,0.1)

   "© {year} {name}. All rights reserved."

     11px rgba(255,255,255,0.25)

   "Powered by EveryDriver"

     11px rgba(255,255,255,0.2)

     as link to everydriver.co.uk

━━━━━━━━━━━━━━━━━━━━━━

NOT FOUND STATE

━━━━━━━━━━━━━━━━━━━━━━

If instructor not found by slug:

  Centred page, navy bg

  "Instructor not found"

  "This page doesn't exist or has

  been removed."

  Link back to everydriver.co.uk

━━━━━━━━━━━━━━━━━━━━━━

LOADING STATE

━━━━━━━━━━━━━━━━━━━━━━

Full page navy background

Pulsing instructor name placeholder

while data loads

━━━━━━━━━━━━━━━━━━━━━━

NO SHARED NAV OR FOOTER

━━━━━━━━━━━━━━━━━━━━━━

This app has NO shared navigation.

Every page is self-contained.

No links to everydriver.co.uk except

the "Powered by" footer credit.

━━━━━━━━━━━━━━━━━━━━━━

TECH STACK

━━━━━━━━━━━━━━━━━━━━━━

React, TypeScript, TanStack Router,

Supabase JS client, Poppins from

Google Fonts, Sonner for toasts.

No other UI libraries needed.

All styling inline or Tailwind utility

classes only.

Build this completely and show me

the full implementation before finishing.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://wheel-wizards-sites.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/99d75ca8-bb0f-4085-a2b6-32ceca92e66a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
