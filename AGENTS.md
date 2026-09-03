# AGENTS.md

Diese Datei beschreibt, wie ein Coding-Agent in diesem Repository arbeiten soll.

## Grundprinzipien

- **Nicht unnötig kompliziert coden.** Bevorzuge einfache, gut lesbare und wartbare Lösungen.
- **Nicht alles komplett umbauen, wenn es nicht ausdrücklich verlangt ist.** Änderungen sollen so klein und zielgerichtet wie möglich bleiben.
- **Lieber nachfragen, wenn Anforderungen unklar sind.** Keine weitreichenden Annahmen treffen, wenn die Richtung nicht eindeutig ist.
- **Lieber früher stoppen und nachfragen, ob weitergemacht werden soll.** Besonders bei größeren Refactorings, strukturellen Änderungen oder Folgearbeiten.
- **An bestehendem Code orientieren.** Nutze vorhandene Patterns, Konventionen, Dateistrukturen und Stilmittel im Repository.

## Vorgehen bei Änderungen

- Arbeite bevorzugt **inkrementell** statt mit großen Rundum-Umbauten.
- Passe vorhandene Lösungen an, bevor du neue Abstraktionen oder neue Architekturen einführst.
- Vermeide "clevere" Lösungen, wenn eine einfache Lösung ausreicht.
- Halte Diffs klein und nachvollziehbar.
- Wenn eine Änderung potentiell mehrere sinnvolle Richtungen hat, stelle erst eine Rückfrage.

## Rückfragen sind besonders sinnvoll, wenn

- Anforderungen mehrdeutig sind.
- ein Refactoring über den eigentlichen Auftrag hinausgehen würde.
- bestehende Strukturen, APIs oder Dateiformate verändert werden müssten.
- zusätzliche Folgearbeiten naheliegen, aber nicht ausdrücklich beauftragt wurden.
- eine schnelle Minimaländerung ebenso möglich wäre wie eine größere "saubere" Lösung.

## Orientierung an bestehendem Repository-Kontext

- Bestehende Konventionen und Dokumentation im Repository haben Vorrang.
- Vorhandene Hilfsfunktionen, Utilities und Muster sollen bevorzugt wiederverwendet werden.
- Neue Strukturen nur dann einführen, wenn der vorhandene Aufbau dafür nicht geeignet ist.

## Ziel

Der Agent soll pragmatisch arbeiten: **einfach, passend zum Bestand, minimal-invasiv und mit rechtzeitigen Rückfragen statt unnötig großer Umbauten.**


## Die .ai-usage-info.md Datei

Diese Datei sollte für alle Pakete uptodate gehalten werden. In dieser sollten alle Informationen enthalten sein, um 
die AI zu informieren, damit sie die Anforderungen der Pakete versteht und entsprechend coden kann. In dieser Datei
sollten hauptsächlich Beispiele enthalten sein. Suche ggf auch nach .ai-usage-info.md Dateien in anderen Paketen, um zu sehen, wie diese aufgebaut sind. (auch in node-modules)

## Repository-Regeln

### Library-Projekt und externe Änderungen

Dieses Repository ist ein Library-Projekt. Werden Änderungen von außerhalb dieses Repositories durchgeführt, insbesondere wenn es als Workspace, eingebundene Abhängigkeit oder Teil eines anderen Repositories beziehungsweise übergeordneten Projekts bearbeitet wird, müssen vor jeder Änderung zuerst alle Dateien, die geändert, neu angelegt oder gelöscht werden sollen, kurz und konkret aufgelistet werden; anschließend muss die ausdrückliche Zustimmung des Users zu genau diesen vorgesehenen Änderungen eingeholt werden, und erst nach dieser Zustimmung dürfen die Änderungen ausgeführt werden. Erfolgt die Entwicklung dagegen direkt innerhalb dieses Repositories als eigentliche Arbeitsumgebung und Ziel der Aufgabe, ist aufgrund dieser Library-Regel keine zusätzliche Zustimmung erforderlich.

### Sprachregel

Bezeichner, technische Namen, Paketnamen, Optionen und APIs werden immer auf Englisch geschrieben. Kommentare und Demos werden auf Deutsch verfasst, sofern sie sich sinnvoll übersetzen lassen. Logs und Fehlermeldungen bleiben immer auf Englisch. Bestehende englische Texte werden nur geändert, wenn die Änderung das Projekt nicht beeinflusst. `ARCHITECTURE.md`- und `SKILLS.md`-Dateien werden auf Deutsch verfasst.