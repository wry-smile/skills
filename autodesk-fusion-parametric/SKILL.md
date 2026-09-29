---
name: autodesk-fusion-parametric
description: Create or revise editable, parameter-driven Autodesk Fusion CAD models with the Fusion Python API. Use for Fusion scripts, design history, sketches, features, components, or native Fusion deliverables; not for mesh-only output.
---

# Autodesk Fusion parametric modeling

Build a model whose dimensions, feature intent, and component structure remain understandable and editable in Fusion. Treat the Python script as the reproducible source and the native Fusion design or archive as the preferred model deliverable when Fusion is available.

## Shape the design before coding

- Identify the actual parts, repeated instances, overall dimensions, interfaces, and a small set of meaningful user parameters. Ask only for dimensions that cannot be inferred or sensibly left as named parameters.
- Choose components for independently manufactured or positioned parts; use bodies within a component for geometry that belongs to one part. Reuse a component through occurrences when instances should update together.
- Plan a readable feature sequence: primary sketch and base feature, functional cuts or joins, then rounds and cosmetic details. Prefer native sketches and features over imported meshes or temporary B-Rep as the final source of geometry.

## Build with the Fusion API

- Use a Fusion Python **script** with `run(context)` for one-shot generation; use an add-in only when persistent UI or events are requested. Run `adsk` code inside Fusion's Python environment, not a normal system Python interpreter.
- Before creating features, confirm the target `Design` is parametric. A direct design has no captured history; changing an existing design's type can affect its history, so avoid silently changing a user's existing document. Create a separate design or ask when conversion would alter existing work.
- Create named `design.userParameters` with explicit units and helpful comments. Drive sketch dimensions and feature inputs with expressions referencing those parameters. Use `ValueInput.createByString(...)` for dimensional expressions; raw real values use Fusion's internal units and are easy to misinterpret.
- Constrain sketches with the geometric relationships and driving dimensions needed for stable edits. Give sketches, features, bodies, and components names that describe their roles. Avoid selecting a profile or face solely by collection index when several candidates can exist; retain created references or select by a deliberate geometric criterion.
- Use current documented feature APIs. For example, define extrusion distance with `DistanceExtentDefinition.create(...)` and `ExtrudeFeatureInput.setOneSideExtent(...)`. Check Autodesk's current reference before relying on less common methods or enum names.
- Keep geometry operations local to their intended component. When creating assembly geometry from another component, account for native objects versus occurrence proxies and creation context. Group related consecutive timeline features when it improves navigation.

Read [API patterns](references/api-patterns.md) when writing the script or choosing a deliverable format. It gives verified entry points, a compact code pattern, and official Autodesk references.

## Deliver and verify

- Provide the `.py` source and clear instructions for running it through Fusion's Scripts and Add-Ins dialog. If Fusion is available, run the script and inspect the resulting browser, parameters, timeline, bodies, and geometry. Change at least one representative parameter and confirm the model recomputes as intended.
- When a native editable file is requested and Fusion is available, save the design or export a Fusion archive (`.f3d`; assemblies may require a different archive form). STL or STEP can be supplemental exchange formats, not substitutes for a requested editable parametric design.
- If Fusion cannot be run in the environment, verify code syntax and API calls against Autodesk documentation, then state plainly that in-app generation and recomputation remain unverified. Do not claim a native model was created from source code alone.
- Report the parameter names and meanings, component and feature structure, deliverable paths, and any assumptions that affect edits.
