# DER GIPFEL 2026 — Nationaler Deutsch-Wettbewerb

> Offizielle Wettkampf-Plattform für den nationalen Deutsch-Wettbewerb **DER GIPFEL 2026**. Umfasst Kandidatenregistrierung, offizielle Gruppenbildung, Live-Ranglisten (*The Climb*), interaktive Bewertungskonsolen und ein rollenbasiertes Spielleiter-Dashboard für den Obersten Quizmeister und Sub-Quizmeister.

---

## 🚀 Features

- **Öffentlicher Bereich**:
  - **Interaktiver Runden-Zeitplan**: 4 Wettkampfstufen von regionalen Qualifikationen bis zum Bundesfinale in Berlin.
  - **Kandidaten-Registrierung**: Vollständige Registrierung mit Klassenstufe (01–05), Sprachzertifikaten (A1–C2) und Qualifikationsprojekten.
  - **Offizielle Klassenteams**: Team Alpha bis Echo mit dynamischer Zuteilung und Namensanpassung.
  - **Live Rangliste (*The Climb*)**: Echtzeit-Punkteverteilung, Rangberechnung und dynamische Fortschrittsbalken.
  - **Sound & Celebration Effects**: Web Audio API Soundeffekte und Konfetti-Animationen bei Rundenfreigaben.
  - **Vollständige Datenpersistenz**: Automatische Speicherung aller Kandidaten, Teams, Punkte und Spielleiter in `localStorage`.

- **Quizmeister-Leitzentrale (Geschützter Bereich)**:
  - **Oberster Quizmeister (Head Quiz Master)**:
    - Vollständige Punkteerfassung (+5, +10, +25, manuelle Eingabe, Punktabzug).
    - Offizielle Rundenverkündigung mit persönlicher Urkunde/Notiz.
    - Zuteilung von Kandidaten in offizielle Klassenteams.
    - **Gruppennamen bearbeiten**: Umbenennung jedes Klassenteams direkt im Dashboard.
    - **Sub-Quizmeister Verwaltung**: Generierung von IDs, sicheren Passwörtern und Zuweisung von Klassenbereichen.
  - **Sub-Quizmeister Portal**:
    - Eingeschränkter Zugang für Hilfsspielleiter.
    - Anwesenheitsprüfung (Anwesend, Abwesend, Offen).
    - Live-Punkte-Monitor (Read-only Schutz vor Manipulation).

---

## 🔐 Standard-Zugangsdaten

| Rolle | ID / Benutzername | Passwort | Berechtigung |
| :--- | :--- | :--- | :--- |
| **Oberster Quizmeister** | `sharon360` | `Sharon@360Medicare` | Vollzugriff, Punkteverwaltung, Teambenennung, Sub-Master Zuweisung |
| **Sub-Quizmeister (Demo)** | `sub_berlin` | `SubBerlin@2026` | Anwesenheitsprüfung & Live-Monitor |

*Hinweis: Neue Sub-Quizmeister können direkt im Head-Master-Dashboard unter "3. Sub-Quizmeister Zuweisen" angelegt werden.*

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

## 🌐 Bereitstellung auf GitHub Pages (GitHub Hosting)

Dieses Repository ist bereits für die Bereitstellung auf **GitHub Pages** vorkonfiguriert:

1. **Repository auf GitHub pushen**:
   ```bash
   git add .
   git commit -m "Configure for GitHub hosting"
   git push origin main
   ```

2. **GitHub Pages aktivieren**:
   - Öffnen Sie Ihr Repository auf GitHub.
   - Navigieren Sie zu **Settings** > **Pages**.
   - Wählen Sie unter **Build and deployment** > **Source**: **GitHub Actions**.

3. **Automatisches Deployment**:
   - Die in `.github/workflows/deploy.yml` hinterlegte GitHub Action baut die Anwendung automatisch bei jedem Push auf den Branch `main` (oder `master`) und veröffentlicht sie auf:
     `https://<ihr-github-benutzername>.github.io/<repository-name>/`
   - Dank der relativen Basis-URL (`base: './'` in `vite.config.ts`) und dem SPA-Fallback (`public/404.html`) funktioniert die App auf jedem GitHub-Pfad fehlerfrei.

---

## 💻 Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 8
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Effekte**: Canvas Confetti & Web Audio API Chimes
