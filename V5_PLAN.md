# Portfolio v5 plan

Status: planning complete for the presentation-first release; ready for owner review. Presentation behavior and project identities are settled. No application implementation has started or is authorized by this document.

Owner: J. Stephen Huang. Updated: 2026-10-06.

## Purpose

Position Stephen as a robotics software engineer moving toward machine learning, robotics software, and simulation. Recruiters must understand the work without manipulating a canvas or opening every item. Engineers should be able to inspect convincing media, understand Stephen's contribution, and follow relevant source or writing links.

Earlier iterations exposed more useful project evidence but felt generic. The current iteration has personality, but its small, abstract cards hide the work. V5 combines substantial project presentation with the eventual playful canvas. The presentation must succeed on its own.

## Delivery boundary

The first release of v5 is the presentation homepage on desktop and mobile. In this document, "release 1" means the first increment of v5, not the archived portfolio at `archive/v1`.

Release 1 contains the introduction and one ordered stream of projects. It has no canvas switch, puzzle mechanics, pan/zoom surface, layout editor, Firebase integration, or cloud publishing. Application work stays on `main`. The `archive/v1` through `archive/v4` branches preserve the prior iterations; Vercel subdomain setup is a separate hosting task.

The later canvas and administration requirements remain part of the roadmap. Delivering the presentation first does not cancel them.

## Settled presentation requirements

- A clean, sparse, document-like presentation with intentional dashed borders around complete project sections.
- Serif project headings and a clean sans-serif body. Images, footage, and engineering artifacts carry the visual personality.
- An introduction with Stephen's photo and a short description underneath. Include name, robotics software positioning, and direct resume, GitHub, LinkedIn, and email links.
- One long project list. No category sections or filters in release 1. The introduction is not a project entry.
- Each project is one complete section and, later, one complete movable canvas piece.
- Within each section, the order is media, then project title, then links, then two to three short paragraphs explaining Stephen's contribution and how the work was built.
- Paragraphs should distinguish personal contribution, engineering approach, and demonstrated behavior or results. Do not invent metrics or claims to fill the template.
- These are native webpage sections, not rendered PDF summaries or file icons. The supplied document screenshots are presentation references, not evidence that their example projects belong to Stephen.
- Project sections do not navigate or open dialogs when their body or media is clicked. Explicit links remain actionable.
- Internal detail pages are used for blogs/writing where appropriate. A project does not need an internal detail page merely to appear in the list.
- Media is an authored sequence of carousel slides. Each slide contains either one large image/video or two side-by-side assets, with a maximum of two assets per slide.
- Two-asset slides remain side by side on phones. Do not stack them or silently switch to one asset at a time on mobile. Single-asset slides use the available media width.
- Previous/next moves between complete authored slides, not automatically generated overlapping pairs. Slides do not advance automatically. A collection with only one slide does not need carousel navigation.
- A one-asset slide is intentional and valid, including when the total media count is odd. Do not duplicate an asset or insert an empty second slot to satisfy a two-media rule.
- Videos use muted, looping previews while sufficiently visible; pause offscreen videos. Preserve reduced-motion preferences and display useful poster/fallback imagery when autoplay is unavailable. Do not add a media viewer in release 1.
- Preserve media proportions and engineering details. Avoid stretching or decorative crops that obscure evidence.
- Content and ordering remain file-backed for this release. Do not build temporary admin tooling just to precede Firebase.

## Initial project order

This curated presentation order overrides chronology. Each WATonomous subject is a separate entry.

| Rank | Entry | Content identification |
| --- | --- | --- |
| 1 | Random forest project | Existing World Cup random forest work: `2026-wc`, including `rf.md` and project visuals. |
| 2 | WATonomous: behavior tree | The current resume describes the C++ behavior tree; needs a separate presentation record and selected media. |
| 3 | WATonomous: world modeling | Existing `watonomous` record, resume details, and archived world-modeling descriptions/screenshots. |
| 4 | WATonomous: simulation | The current resume describes CARLA pipeline validation and test-track mapping; needs a separate presentation record and selected media. |
| 5 | WATonomous research: Franka Panda arm | Supplied resume: developing sim-to-real HIL-SERL for USB pick-up and insertion. Ongoing work; project media and links still needed. |
| 6 | WATonomous research: Eidos | Plugin-based ROS package for SLAM. Stephen's contribution includes integrating datasets to support additional autonomous vehicle platforms. Project media and public links still needed. |
| 7 | GenAI project | Existing `yap`: GenAI YouTube automation pipeline, with repository/channel links and resume evidence. |
| 8 | Interpreter | Existing `crafting-interpreters`: C++ Lox interpreter, with repository link and notes. |

Use stable project IDs and one explicit ordered list. Do not derive presentation order from titles, dates, gallery membership, or Firebase. Future admin reordering will update the same conceptual order.

The supplied resume identifies "Robotics Research Member" as a WATonomous role covering Franka Panda and Eidos. The planning interpretation is two specific project entries, not an additional generic Research section. This also preserves the requirement that the presentation contains projects without category headings.

Fellow, Parametric Research Labs, and Garment System provide useful background and resume context. They are not automatically added to the initial project sequence. Do not import every resume role as a project.

## Project record and slide contract

Keep the initial records file-backed and small. Reuse existing validated fields where suitable, and add only the presentation data that is necessary:

- Stable project ID and final display title.
- Two to three short contribution/build paragraphs.
- Labeled links, including source, demo, paper, or related writing when actually available.
- An ordered array of explicitly authored slides. A slide references one or two media assets and preserves their intended grouping.
- Per-asset type, source, intrinsic dimensions/aspect ratio, meaningful image description or video poster, and any short caption needed to interpret it.
- An explicit project-ID sequence for presentation order. Future canvas chronology and placement are separate data.

Do not flatten all media into a generic array and infer the slide pairing at render time. The owner needs to choose whether each slide emphasizes a single asset or a two-asset comparison. The same record should later render inside a complete canvas piece without duplicating project descriptions.

Two-column mobile slides must fit the available width without horizontal page overflow. Preserve asset proportions and do not enforce a fixed height that crops useful content. Use stable media bounds to prevent jumping as assets load. Provide clear carousel controls, keyboard operation, and horizontal touch swiping while retaining normal vertical page scrolling.

## Evidence and content preparation

Current source facts:

- Main is a Next.js/React application. Its metadata and Markdown live under `db/dumps/`, with validation in `lib/data/schema.ts` and existing writing URLs under `/dumps/[id]`.
- Current gallery ordering is alphabetic by ID; there is no presentation rank field yet.
- Existing World Cup material contains charts, bracket imagery, diagrams, and substantial writing.
- The current WATonomous item has a team/logo cover and limited detail. It does not yet supply the three selected project presentations.
- The resume supplies substantive behavior-tree, world-modeling, and CARLA evidence. Archived world-modeling descriptions and `wm1.png` through `wm3.png` are recoverable, but need accurate assignment to the three distinct entries.
- The GenAI project already matches `yap`. Its longer writing is currently a placeholder; prepare a real presentation description from verified work rather than treating that placeholder as an article.
- The newer resume pasted by the owner supplies the Franka Panda and Eidos research context; those projects are not yet in the inspected repository content or on-disk resume. Use the supplied context to plan them, then obtain representative media, links, and expanded contribution paragraphs. Do not assume the on-disk resume has been updated.
- Archived experience pages and demo recordings may be useful. Recordings include `.mov` files whose browser compatibility has not been verified; they require inspection and potentially conversion/posters before publication.
- No identifiable personal photo is currently available in `public/`.

Before publishing each entry, collect its final title, stable ID, two to three paragraphs, explicit links, authored slide grouping/order, media dimensions/aspect ratios, and image descriptions or video posters. Verify that footage and claims belong to that entry. Larger logos are not a substitute for project evidence.

The supplied resume is owner-provided context, not an instruction to replace the resume PDF. It supplies specific accounts of BehaviorTree.CPP/ROS 2 planning, world-model ingestion of detections, CARLA validation, HIL-SERL work, Eidos integration, random-forest evaluation, and the GenAI pipeline. Keep ongoing research described as ongoing; do not turn intended outcomes into achieved results. The owner clarified that the Eidos entry is the plugin-based ROS package for SLAM. Present the actual package work and dataset integration contribution.

Existing Markdown should be reused where relevant, rather than copied into a conflicting second account of the same work. Presentation summaries can be distinct from longer writing, while linking to it.

Missing media, unknown ownership, unconfirmed claims, and unprepared descriptions are content dependencies. Do not silently replace required entries with unrelated old projects or present placeholders as finished work. Development fixtures may demonstrate the layout but do not satisfy launch criteria.

## Readiness before implementation

The presentation design questions are settled. Review the complete plan with the owner before coding. Future canvas-stage and Firebase-stage decisions remain explicitly deferred to their respective milestones.

The personal photo, actual project assets, final paragraphs, and public links remain content inputs. Missing inputs do not require more product features or cloud infrastructure; prepare them during the content stage.

## Release 1 implementation stages

### Stage 0: review the plan and prepare the content contract

Review this document with the owner. Map the selected projects to stable records. Identify missing text, photo, links, and actual media. Define the shared project record so the future canvas can use the same content without requiring that canvas to be built now.

Done when: ordering and presentation behavior are unambiguous; missing content is explicitly tracked; the owner confirms the shared design.

### Stage 1: prove one complete project section

Build the introduction and a single representative project section using real project evidence. Establish dashed borders, typography, spacing, responsive media proportions, title/links placement, and paragraphs. Evaluate on desktop and a narrow phone before multiplying the design across all entries.

Done when: the owner can recognize the project's purpose, contribution, and visible evidence without clicking; typography and media remain readable at both viewport sizes.

### Stage 2: implement authored media slides

Implement single-asset and two-asset slides in the same carousel. Preserve two columns on phones. Navigation switches complete authored slides with explicit keyboard-accessible controls and touch support. Enable muted inline video previews with visibility-based pausing, reduced-motion handling, and posters. Pause videos on inactive slides as well as offscreen sections. Prevent dragging/swiping from interfering with vertical page scrolling.

Done when: single, paired, and mixed slide sequences behave correctly; two-asset slides stay side by side on phones; there are no duplicated/empty filler slots; inactive/offscreen videos stop playing; controls work without a pointer.

### Stage 3: assemble the complete ordered presentation

Populate the selected project entries and arrange them in the owner's exact sequence. Keep three separate WATonomous sections. Add verified links and the introduction photo. Preserve useful writing routes; do not add project-body click navigation, category grouping, or unfinished mode controls.

Done when: all agreed entries are represented by their actual content, links work, and no placeholder text is presented as finished evidence.

### Stage 4: validate the presentation release

Check the rendering and behavior on desktop and mobile, including touch scrolling, video playback failures, long titles, media of mixed proportions, and lengthy paragraphs. Run the repository's relevant lint/build checks. Use an isolated preview to review the changes before publishing them to the production domain.

Done when: the acceptance checklist below passes and the owner approves the visual result. A push to Vercel's Production branch can update the live portfolio; use a preview for review before that step.

## Release 1 acceptance checklist

- [ ] Desktop and mobile open the presentation homepage with no unfinished canvas switch.
- [ ] Introduction contains the supplied photo, short description, identity, and direct links.
- [ ] The project list matches the exact approved order, with three separate WATonomous entries.
- [ ] Every project presents media first, followed by title, links, and two to three short contribution/approach paragraphs.
- [ ] Dashed borders, serif headings, sans-serif body, and sparse spacing are consistent.
- [ ] Slides contain either one large asset or two side-by-side assets, with the same authored grouping on desktop and mobile.
- [ ] Carousel controls change complete slides; no automatic advance, duplicated filler assets, or empty second slots.
- [ ] Engineering media is not stretched or cropped in a way that hides useful content.
- [ ] Videos play silently when eligible, pause offscreen and on inactive slides, and provide useful fallbacks.
- [ ] Project-body clicks do nothing; explicit links work. No fullscreen media dialog is introduced.
- [ ] The page is one scrollable project list without category sections or filters.
- [ ] Page content and links are usable with keyboard navigation and readable at mobile sizes.
- [ ] Missing content and claims have been resolved; no unrelated replacements or finished-looking placeholders remain.
- [ ] Relevant lint/build checks and visual review pass.
- [ ] No Firebase, cloud authoring, puzzle engine, or new admin authoring is included in this release.

## Later stage: canvas foundation

Reuse each complete presentation section as one rectangular piece. The author sets its width; content determines height. Visitors cannot resize, rotate, hide, or change content. Introduction is the immovable root at the world origin, initially near the center of the screen; panning moves it across the screen normally. Home returns the camera to it.

The first preset is a chronological tree with a single main trunk and supporting branches. Newest meaningful work is nearest the root. This is independent of the curated presentation order. Placement and adjacent edges suggest the tree; there are no permanent connecting lines. Author adjustments can override the generated arrangement.

There is no requirement to fit every item onto the opening screen. The world grows as needed. Start at a readable scale instead of shrinking every project into a thumbnail. Provide Home, zoom controls, and a view switch once the canvas works.

Original direction: desktop eventually opens canvas, mobile opens presentation. Confirm this default again during the canvas stage after evaluating the shipped presentation. Spiral and circle presets are deferred beyond the first tree preset; they are not release-1 commitments.

### Navigation reference

The owner requested Excalidraw-like navigation. Treat the reference as concrete interaction behavior to verify at the canvas stage, not an unpinned dependency or vague promise.

Official Excalidraw source currently implements middle-button pan, Space + left drag, hand-tool drag, and right-button drag after a movement threshold. Default/trackpad wheel behavior pans; Ctrl/Cmd + wheel and trackpad pinch zoom around the pointer. Touch supports two-finger pan/pinch. Some current source changes are marked unreleased, so compare against the deployed reference and settle parity before implementation.

Primary references: [pan handling](https://github.com/excalidraw/excalidraw/blob/master/packages/excalidraw/components/App.pan.ts), [wheel handling](https://github.com/excalidraw/excalidraw/blob/master/packages/excalidraw/components/App.wheel.ts), [touch handling](https://github.com/excalidraw/excalidraw/blob/master/packages/excalidraw/components/App.tsx), and [changelog](https://github.com/excalidraw/excalidraw/blob/master/packages/excalidraw/CHANGELOG.md).

The existing AirHockey board uses bounded, normalized coordinates with throwing and bouncing. It is not an infinite camera-based canvas. Preserve reusable content and appropriate input handling, but do not treat resizing that board as sufficient to implement this stage.

Done when: readable project pieces share the presentation content, the root remains fixed in world coordinates, the tree is navigable with the specified inputs, and pan/zoom does not accidentally activate links or drag pieces.

## Later stage: snapping and detachment

- Partial edge alignment is allowed between unequal rectangles.
- Connected pieces keep a small consistent gap and show a proposed connection highlight before release.
- A short settling animation makes a successful connection apparent. The desired "click" is an interaction feel; audible effects have not been requested.
- Dragging a connected piece detaches and moves only that piece. Neighboring pieces do not move as a group.
- Connections describe arrangement, not a mandatory semantic parent/child relationship.
- Gaps are acceptable. Overlaps are prohibited, including during dragging; do not push other pieces or the root as an implicit side effect.
- Define collision resolution and useful placement feedback during this stage. Root immobility and non-overlap must hold at every zoom level.

Done when: unequal pieces can connect and detach predictably, proposed placements are understandable, no pieces overlap, and interactive media/links do not accidentally activate during drag gestures.

## Later stage: visitor-local layouts

- Automatically preserve the working canvas arrangement.
- Offer explicitly named saved snapshots and switching between them.
- Restore the last selected view and canvas camera/zoom on return when valid.
- Reset repositions the current arrangement to the public default. It does not delete named layouts.
- Named deletion and clearing local preferences are separate actions.
- Layouts remain in browser local storage until cleared. They are not cookie-session-only, shared, or cloud-synced.
- Handle stale saved arrangements when public items are added, removed, or resized; confirm the reconciliation policy during this stage.

Done when: reload/return preserves the working state, saved snapshots remain selectable, Reset leaves them intact, and changed public content cannot produce overlapping or unusable restored layouts.

## Later stage: authoring and Firebase

Deferred until the presentation and canvas behavior are proven. There is no Firebase initialization or editable layout backend today; the existing admin interface is not a working content editor.

Desired eventual capabilities:

- Arrange and publish the default public canvas while keeping the root fixed.
- Drag entries into a curated presentation order and control inclusion.
- Export/copy authored layout values for setting defaults; later replace manual publishing with a reviewed admin workflow.
- Keep public authored defaults distinct from visitors' private local arrangements.
- Eventually support additional presets or layout conversion, including the discussed spiral/circle directions.

Firebase's data scope, media hosting, login integration, draft/publish behavior, and migration from file-backed content are deliberately unsettled. Decide them in a separate design round when this stage starts. Do not build a speculative CMS as part of presentation work.

## Planning and review rules

No application code changes until the owner confirms the design. This document is a reviewable plan, not an instruction to begin implementation. Update it as decisions settle rather than quietly assuming answers. Keep each implementation stage independently reviewable and use real work to evaluate the presentation.
