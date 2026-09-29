# Fusion Python API patterns

Use this reference while writing a Fusion script. The linked Autodesk pages are the authority for API details; check them for operations beyond this pattern.

## Entry point and editable design

Fusion calls `run(context)` in a script. The `adsk` modules are available in Fusion's Python environment. For an existing document, obtain and validate the active design before editing it. `Design.designType` distinguishes direct from parametric modeling; converting a parametric design to direct removes its timeline. See [Creating a Script or Add-In](https://help.autodesk.com/cloudhelp/ENU/Fusion-360-API/files/WritingDebugging_UM.htm) and [Design.designType](https://help.autodesk.com/cloudhelp/ENU/Fusion-360-API/files/fusion_Design_designType.htm).

```python
import traceback
import adsk.core
import adsk.fusion


def run(context):
    app = adsk.core.Application.get()
    ui = app.userInterface
    try:
        design = adsk.fusion.Design.cast(app.activeProduct)
        if not design:
            raise RuntimeError('Open or create a Fusion design first.')
        if design.designType != adsk.fusion.DesignTypes.ParametricDesignType:
            raise RuntimeError('Use a parametric design with design history enabled.')
        # Call small functions that create parameters, components, sketches,
        # and features in a deliberate order.
    except Exception:
        ui.messageBox(traceback.format_exc())
```

The snippet is an entry point, not a complete model. A generator that must create a new document should explicitly implement that behavior instead of assuming the active product is a design.

## Parameters, sketches, and features

- `design.userParameters.add(name, ValueInput, units, comment)` creates a visible user parameter. Use string expressions with explicit units, such as `ValueInput.createByString('40 mm')`. A real-valued input is interpreted in internal units, which are centimeters for length. [UserParameters.add](https://help.autodesk.com/cloudhelp/ENU/Fusion-360-API/files/fusion_UserParameters_add.htm)
- A driving sketch dimension has a model parameter. Set its `parameter.expression` to the user parameter name, such as `outer_diameter`. A diameter dimension can be added with `sketch.sketchDimensions.addDiameterDimension(circle, textPoint)`. [SketchDimension.parameter](https://help.autodesk.com/cloudhelp/ENU/Fusion-360-API/files/fusion_SketchDimension_parameter.htm), [diameter dimension sample](https://help.autodesk.com/cloudhelp/ENU/Fusion-360-API/files/SketchDimension_addDiameterDimension_Sample.htm)
- Create a profile-based extrusion with `extrudeFeatures.createInput(profile, operation)`, then set an extent with `DistanceExtentDefinition.create(ValueInput.createByString('body_length'))` and `input.setOneSideExtent(extent, adsk.fusion.ExtentDirections.PositiveExtentDirection)`, followed by `extrudeFeatures.add(input)`. The older `setDistanceExtent` is retired. [setOneSideExtent](https://help.autodesk.com/cloudhelp/ENU/Fusion-360-API/files/fusion_ExtrudeFeatureInput_setOneSideExtent.htm), [ExtrudeFeatureInput](https://help.autodesk.com/cloudhelp/ENU/Fusion-360-API/files/fusion_ExtrudeFeatureInput.htm)

For example, a circular part can have user parameters `outer_diameter = 40 mm` and `body_length = 60 mm`. Create a circle in a named sketch, add a diameter dimension, assign `dimension.parameter.expression = 'outer_diameter'`, then extrude its profile using `body_length`. Give the extrusion and resulting body functional names. The circle's initial coordinates are only a seed; the dimension and geometric constraints should define its intended size and position.

## Components, timeline, and export

- `rootComponent.occurrences.addNewComponent(Matrix3D.create())` creates both a component and its first occurrence. Build that part's sketches and features in `occurrence.component`. For repeated identical parts, add another occurrence of the existing component. [Occurrences.addNewComponent](https://help.autodesk.com/cloudhelp/ENU/Fusion-360-API/files/fusion_Occurrences_addNewComponent.htm), [components and proxies](https://help.autodesk.com/cloudhelp/ENU/Fusion-360-API/files/ComponentsProxies_UM.htm)
- Related, consecutive timeline items can be grouped with `design.timeline.timelineGroups.add(startIndex, endIndex)` and the returned group's `name`. Groups cannot contain other groups. [TimelineGroups.add](https://help.autodesk.com/cloudhelp/ENU/Fusion-360-API/files/fusion_TimelineGroups_add.htm)
- Fusion archives preserve the Fusion design for handoff. `design.exportManager.createFusionArchiveExportOptions(...)` creates options, then `design.exportManager.execute(options)` performs export. Check the target format and assembly behavior before promising a specific extension. [ExportManager](https://help.autodesk.com/cloudhelp/ENU/Fusion-360-API/files/fusion_ExportManager.htm), [export sample](https://help.autodesk.com/cloudhelp/ENU/Fusion-360-API/files/ExportManager_Sample.htm)

Run the script from Fusion's [Scripts and Add-Ins dialog](https://help.autodesk.com/cloudhelp/ENU/Fusion-Model/files/SLD-MANAGE-SCRIPTS-ADD-INS.htm). A system Python syntax check can catch parsing errors, but it cannot validate `adsk` behavior or feature recomputation.
