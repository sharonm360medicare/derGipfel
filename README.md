# DER GIPFEL 2026 — Competition Entry & Qualification Portal

> Offizielles Eintritts- und Qualifikationsportal für den nationalen Deutsch-Wettbewerb **DER GIPFEL 2026**. Die Plattform dient als bundesweites Tor für Schülerinnen und Schüler zur Vorbereitung in der offenen Übungsarena und zur Absolvierung der zeitgesteuerten, individuellen Qualifikationsprüfung (Stufe 01).

---

## 🏔️ Hauptfunktionen

### 1. Offene Übungsarena (Vor dem Wettbewerb)
- **4 Wissensgebiete**: Fragen aus *Geschichte*, *Kultur & Kunst*, *Essen & Kulinarik* sowie *Geografie & Land* mit jeweils 4 Antwortoptionen.
- **Sofort-Feedback**: Interaktive Farbrückmeldung, Trefferquoten-Statistik, Streaks und Audio-Chimes (Web Audio API).
- **Kultur- & Hintergrundnotizen**: Detaillierte Wissenserklärungen zu jeder Frage zur gezielten Vorbereitung auf den Wettbewerb.

### 2. Live-Countdown & Zeitgesteuerte Freigabe
- **Präziser Countdown**: Tage, Stunden, Minuten und Sekunden bis zum offiziellen Prüfungsstart.
- **Vollständige Spielleiter-Kontrolle**: Der Quizmeister kann den Starttermin, die Startuhrzeit, den Titel des Countdowns sowie die Prüfungsdauer jederzeit anpassen.
- **Sofort-Freigabe-Schalter**: Manueller Überbrückungsschalter ("Prüfung Sofort Freischalten"), um Prüfungen für synchronisierte Klassen oder Tests vorzeitig zu öffnen.

### 3. Offizielle Qualifikationsprüfung (Stufe 01)
- **Individuelle Teilnahme**: Erfassung von Name, E-Mail, Klassenstufe (Klasse 01–05), Schule/Stadt und Bestätigung des Fairplay-Ehrenkodex.
- **Prüfungsuhr**: 20 Minuten Zeitlimit mit Fortschrittsbalken, Vor/Zurück-Navigation und automatischer Abgabe bei Zeitablauf.
- **Sofortige Auswertung & Urkunde**: Live-Berechnung der Punktzahl (z.B. 14/15, 93%), Konfetti-Feier bei Erreichen der 70%-Qualifikationsgrenze für die Gruppenphase (Stufe 02) und Eintrag in die Bestenliste.

### 4. Dynamische Wettbewerbsregeln & 4-Stufen-Ablauf
- **Aktuelle Richtlinien**: Ablauf, Teilnahmevoraussetzungen, Bewertungsmethodik und Fairplay-Kodex.
- **Live-Synchronisation**: Änderungen durch den Spielleiter werden sofort auf der Website aktualisiert.

### 5. Qualifikations-Bestenliste
- Live-Rangliste sortiert nach Punktzahl und benötigter Bearbeitungszeit.
- Filterbar nach Klassenstufen (Klasse 01 bis 05) mit Suchfunktion für Schulen und Namen.

### 6. Spielleiter-Leitzentrale (Geschützter Bereich)
- **Zugangsdaten**: `sharon360` / `Sharon@360Medicare` (oder `quizmaster` / `Gipfel2026!`).
- **Tab 1: Timer & Zeitplan**: Ändern von Datum/Uhrzeit, Hero-Titel, Untertitel, Prüfungsdauer und Qualifikationsgrenze.
- **Tab 2: Fragen-Verwaltung (Visueller Editor)**: Fragen erstellen, bearbeiten oder löschen; Zuordnung zu Wissensgebieten, Schwierigkeitsgraden und Optionen.
- **Tab 3: Regeln bearbeiten**: Regeln hinzufügen, anpassen oder entfernen.
- **Tab 4: Abgaben & CSV-Export**: Übersicht aller Prüfungsergebnisse und Ein-Klick-Download als CSV-Tabelle für die Schulverwaltung.

---

## 🔐 Spielleiter-Zugangsdaten

| Benutzerkennung | Passwort | Berechtigungen |
| :--- | :--- | :--- |
| `sharon360` | `Sharon@360Medicare` | Vollzugriff auf Prüfungssteuerung, Fragen-Editor, Regeln und CSV-Export |
| `quizmaster` | `Gipfel2026!` | Alternativer Spielleiter-Zugang |

---

## 🛠️ Lokale Entwicklung

```bash
# 1. Abhängigkeiten installieren
npm install

# 2. Entwicklungsserver starten (Port 3000)
npm run dev

# 3. Produktions-Build erstellen
npm run build

# 4. TypeScript-Typen überprüfen
npm run lint
```

---

## 🌐 GitHub Pages Bereitstellung

Das Repository ist für **GitHub Pages** vorkonfiguriert:
- Push auf den Branch `main` startet den GitHub Actions Workflow `.github/workflows/deploy.yml`.
- Dynamische Basis-URL (`/derGipfel/`) in `vite.config.ts`.
- Automatische SPA-Routenführung über `public/404.html`.
