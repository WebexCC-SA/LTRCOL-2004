# Cisco Codec EQ: Cross View and Presenter Track Camera — xAPI Reference

**Document version:** 1.0  
**Applicable devices:** Cisco Codec EQ (RoomOS)  
**Reference:** [RoomOS xAPI](https://roomos.cisco.com/xapi)

---

## Export to PDF

- **PDF generated:** `docs/cisco_codec_eq_crossview_presentertrack_xapi.pdf` (4 pages).
- **To regenerate or create a new PDF:** Open `docs/cisco_codec_eq_crossview_presentertrack_xapi.html` in Chrome or Safari → **File → Print → Save as PDF** (or **Print → PDF → Save as PDF** on macOS).

---

## 1. Overview

The **Cisco Codec EQ** is a RoomOS-based video conferencing endpoint that supports advanced camera features:

- **Cross View** — AI-driven cinematic meeting views using multiple cameras (PTZ 4K or Quad) to automatically choose the best angles and frame participants.
- **Presenter Track** — Camera automatically follows the active presenter/speaker when using a PTZ 4K or Precision 60 camera.

Control and automation are done via **xAPI** (RoomOS XML/HTTP API), which provides Commands, Configuration, Status, and Events for cameras and video.

---

## 2. Cross View

### 2.1 What Is Cross View?

Cross View uses multiple cameras and room analytics to:

- Analyze room activity and speaker position
- Recognize and track participants
- Select optimal camera angles and compose cinematic views

### 2.2 Typical Codec EQ Cross View Setup

| Component | Role |
|----------|------|
| **Codec EQ** | Main room codec |
| **Two side cameras** | PTZ 4K or Quad (left/right) |
| **One Quad camera** | Above the display |
| **Ceiling or Table Microphones Pro** | For speaker location and framing |

### 2.3 Setup and Calibration

- Follow Cisco **Multi Camera Setup Guidelines** (room dimensions, camera placement, table, seating, microphones, lighting).
- Use the **Multi camera director** setup wizard on the device or in the web UI.
- Use the **calibration board** during the wizard for correct alignment.
- Configure **SpeakerTrack** with external microphones for better framing (see SpeakerTrack xAPI below).

### 2.4 Related xAPI Areas for Cross View

Cross View uses multi-camera and SpeakerTrack behavior. Relevant xAPI namespaces include:

- **Cameras** — camera list, roles, placement, presets
- **Cameras SpeakerTrack** — tracking, frames, multi-camera, meeting zone
- **Video Input** — which camera/connector is used as main video source
- **Configuration.Cameras.Camera[n].Role** — assign camera roles (e.g. for left/right/overhead)

Example: set camera role (syntax may vary by RoomOS version):

```xml
Configuration.Cameras.Camera[1].Role
Configuration.Cameras.Camera[2].Role
Configuration.Cameras.Camera[3].Role
```

---

## 3. Presenter Track

### 3.1 What Is Presenter Track?

Presenter Track uses a **PTZ 4K** or **Precision 60** camera to:

- Detect when a person is in the presenter area (trigger zone)
- Track the presenter’s head and keep them framed
- Automatically turn off when switching presets, changing camera, or going to standby (unless using Persistent mode)

### 3.2 Enable Presenter Track (Configuration)

Before using commands, enable the feature:

| xAPI Path | Type | Description |
|-----------|------|-------------|
| `Configuration.Cameras.PresenterTrack.Enabled` | Config | Enable/disable Presenter Track |
| `Configuration.Cameras.PresenterTrack.Connector` | Config | Connector used for the PTZ/presenter camera |
| `Configuration.Cameras.PresenterTrack.TriggerZone` | Config | Define the trigger zone for presenter detection |
| `Configuration.Cameras.PresenterTrack.PresenterDetectedStatus` | Config | Whether to show “presenter detected” on screen |
| `Configuration.Cameras.PresenterTrack.CameraPosition.Pan` | Config | Default/limit pan |
| `Configuration.Cameras.PresenterTrack.CameraPosition.Tilt` | Config | Default/limit tilt |
| `Configuration.Cameras.PresenterTrack.CameraPosition.Zoom` | Config | Default/limit zoom |

### 3.3 Presenter Track Commands

#### Command.Cameras.PresenterTrack.Set

Set the presenter tracking **mode**. Only applies when a PTZ 4K or Precision 60 is used for presenter tracking and Presenter Track is enabled.

**Syntax (JavaScript):**

```javascript
xapi.Command.Cameras.PresenterTrack.Set({ Mode: value });
```

**Modes:**

| Mode | Description |
|------|-------------|
| **Off** | Turn off presenter tracking |
| **Follow** | Turn on presenter tracking (default when activated from UI). Turns off when preset changes, another camera is selected, or standby is activated |
| **Diagnostic** | Show trigger zone and tracking state on screen (red = trigger zone, green = tracked head, etc.) for troubleshooting |
| **Background** | Used by codec scripts; tracking on without cropping |
| **Setup** | Used by web UI to show trigger zone during setup |
| **Persistent** | Tracking stays on until explicitly turned off (e.g. preset change turns it off) |

**Example (Follow):**

```javascript
xapi.Command.Cameras.PresenterTrack.Set({ Mode: 'Follow' });
```

**Example (Off):**

```javascript
xapi.Command.Cameras.PresenterTrack.Set({ Mode: 'Off' });
```

**Example (Diagnostic):**

```javascript
xapi.Command.Cameras.PresenterTrack.Set({ Mode: 'Diagnostic' });
```

**Applicable products (among others):** Codec EQ, Codec Pro, Board Pro 55/55 G2/75/75 G2, Room 70 Dual G2, Room 70 Single G2, Room Bar Pro.

---

#### Command.Cameras.PresenterTrack.StorePosition

Store the current camera position as the presenter track position.

```javascript
xapi.Command.Cameras.PresenterTrack.StorePosition();
```

---

#### Command.Cameras.PresenterTrack.ClearPosition

Clear the stored presenter track position.

```javascript
xapi.Command.Cameras.PresenterTrack.ClearPosition();
```

---

### 3.4 Presenter Track Status

| xAPI Path | Description |
|-----------|-------------|
| `Status.Cameras.PresenterTrack.Availability` | Whether Presenter Track is available |
| `Status.Cameras.PresenterTrack.Status` | Current status |
| `Status.Cameras.PresenterTrack.PresenterDetected` | Whether a presenter is currently detected |

**Example (read status):**

```javascript
const status = await xapi.Status.Cameras.PresenterTrack.Status.get();
const detected = await xapi.Status.Cameras.PresenterTrack.PresenterDetected.get();
```

---

## 4. SpeakerTrack (Multi-Camera / Cross View)

SpeakerTrack controls how the system tracks speakers and composes views; it is used together with Cross View and multi-camera setups.

### 4.1 SpeakerTrack Commands

| Command | Description |
|---------|-------------|
| `Command.Cameras.SpeakerTrack.Activate` | Activate SpeakerTrack |
| `Command.Cameras.SpeakerTrack.Deactivate` | Deactivate SpeakerTrack |
| `Command.Cameras.SpeakerTrack.Set` | Set SpeakerTrack behavior/options |
| `Command.Cameras.SpeakerTrack.Closeup.Activate` | Activate close-up view |
| `Command.Cameras.SpeakerTrack.Closeup.Deactivate` | Deactivate close-up view |
| `Command.Cameras.SpeakerTrack.Frames.Activate` | Activate frame view |
| `Command.Cameras.SpeakerTrack.Frames.Deactivate` | Deactivate frame view |
| `Command.Cameras.SpeakerTrack.ViewLimits.Activate` | Use view limits |
| `Command.Cameras.SpeakerTrack.ViewLimits.Deactivate` | Ignore view limits |
| `Command.Cameras.SpeakerTrack.ViewLimits.StorePosition` | Store current position as limit |
| `Command.Cameras.SpeakerTrack.Whiteboard.StorePosition` | Store whiteboard position |
| `Command.Cameras.SpeakerTrack.Whiteboard.ActivatePosition` | Activate whiteboard position |

### 4.2 SpeakerTrack Configuration (Selected)

| Configuration | Description |
|---------------|-------------|
| `Configuration.Cameras.SpeakerTrack.Mode` | SpeakerTrack mode |
| `Configuration.Cameras.SpeakerTrack.Closeup` | Close-up behavior |
| `Configuration.Cameras.SpeakerTrack.DefaultBehavior` | Default behavior when activated |
| `Configuration.Cameras.SpeakerTrack.TrackingMode` | Tracking mode |
| `Configuration.Cameras.SpeakerTrack.Frames.Mode` | Frames (multi-camera) mode |
| `Configuration.Cameras.SpeakerTrack.Frames.RowConfiguration` | Row layout for frames |
| `Configuration.Cameras.SpeakerTrack.MeetingZone.Mode` | Meeting zone mode |
| `Configuration.Cameras.SpeakerTrack.MeetingZone.Area` | Meeting zone area |
| `Configuration.Cameras.SpeakerTrack.MultiCamera.CalibrationMonitoring` | Multi-camera calibration |
| `Configuration.Cameras.Camera[1..15].SpeakerTrack.Overview` | Per-camera overview |

### 4.3 SpeakerTrack Status

| Status | Description |
|--------|-------------|
| `Status.Cameras.SpeakerTrack.Availability` | Whether SpeakerTrack is available |
| `Status.Cameras.SpeakerTrack.State` | Current state |
| `Status.Cameras.SpeakerTrack.Status` | Status string |
| `Status.Cameras.SpeakerTrack.ActiveConnector` | Active camera connector |
| `Status.Cameras.SpeakerTrack.Frames.Availability` | Frames feature available |
| `Status.Cameras.SpeakerTrack.Frames.Status` | Frames status |
| `Status.Cameras.SpeakerTrack.ViewLimits.Pan/Tilt/Zoom` | Current view limits |

---

## 5. Camera Configuration (Relevant to Codec EQ)

### 5.1 Camera Roles and Identity

| Configuration | Description |
|---------------|-------------|
| `Configuration.Cameras.Camera[n].Role` | Role of camera n (e.g. for Cross View left/right/overhead) |
| `Configuration.Cameras.Camera[n].PtzAutoFraming` | PTZ auto-framing on/off |
| `Configuration.Cameras.Camera[n].DefaultPosition.Pan/Tilt/Zoom` | Default PTZ position |
| `Configuration.Cameras.Camera[n].Placement.X/Y/Z` | Physical placement (for multi-camera) |
| `Configuration.Cameras.Camera[n].Focus.Mode` | Focus mode (e.g. Auto) |
| `Configuration.Cameras.Camera[n].Standby.Mode` | Standby behavior |

### 5.2 Camera Status

| Status | Description |
|--------|-------------|
| `Status.Cameras.Camera[n].Connected` | Camera connected |
| `Status.Cameras.Camera[n].Position.Pan/Tilt/Zoom` | Current PTZ position |
| `Status.Cameras.Camera[n].Model` | Camera model |
| `Status.Cameras.Camera[n].DetectedConnector` | Connector used |

---

## 6. Connecting to xAPI

You can talk to the Codec EQ over:

- **SSH** — run `xapi` or send commands in the CLI
- **HTTP/HTTPS** — POST XML or JSON to the device (e.g. `/putxml`)
- **WebSocket** — for real-time status/events
- **RS-232** — for control systems

**Example HTTP (conceptual):**

```http
POST /putxml HTTP/1.1
Host: <codec-ip>
Content-Type: application/xml

<Command>
  <Cameras>
    <PresenterTrack>
      <Set>
        <Mode>Follow</Mode>
      </Set>
    </PresenterTrack>
  </Cameras>
</Command>
```

---

## 7. Quick Reference — Presenter Track

| Goal | xAPI |
|------|------|
| Turn presenter track on | `Command.Cameras.PresenterTrack.Set({ Mode: 'Follow' })` |
| Turn presenter track off | `Command.Cameras.PresenterTrack.Set({ Mode: 'Off' })` |
| Troubleshoot on screen | `Command.Cameras.PresenterTrack.Set({ Mode: 'Diagnostic' })` |
| Enable feature | `Configuration.Cameras.PresenterTrack.Enabled` = true |
| Check if presenter detected | `Status.Cameras.PresenterTrack.PresenterDetected` |
| Store presenter position | `Command.Cameras.PresenterTrack.StorePosition()` |

---

## 8. References

- **RoomOS xAPI:** https://roomos.cisco.com/xapi  
- **PresenterTrack.Set:** https://roomos.cisco.com/xapi/Command.Cameras.PresenterTrack.Set/  
- **Cameras domain:** https://roomos.cisco.com/xapi/domain/?domain=Cameras  
- **Cisco Multi Camera Setup / Cross View:** See Cisco Multi Camera Setup Guidelines and Cross-View setup and guidelines (help.webex.com, cisco.com documentation).  
- **RoomOS API Reference Guide (PDF):** Cisco documentation portal (e.g. roomos-1114 or later API Reference Guide).

---

*This document is a concise reference for Cisco Codec EQ Cross View and Presenter Track with xAPI. For exact parameters and product support matrix, use the official RoomOS xAPI reference and device-specific release notes.*
