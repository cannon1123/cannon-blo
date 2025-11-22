# Przewodnik Wdrażania na GitHub Pages & Vercel

## Część 1: Konfiguracja Zmiennych Środowiskowych

### Opcja A: Wdrażanie na Vercel (REKOMENDOWANE)

1. **Utwórz repozytorium na GitHub:**
   - Utwórz nowe repozytorium na GitHub
   - Sklonuj go lokalnie: `git clone https://github.com/twoja-nazwa/twoja-strona.git`
   - Skopiuj wszystkie pliki projektu do folderu

2. **Połącz z Vercel:**
   - Wejdź na [vercel.com](https://vercel.com)
   - Zaloguj się (możesz użyć konta GitHub)
   - Kliknij "New Project"
   - Wybierz swoje repozytorium GitHub
   - Kliknij "Import"

3. **Dodaj zmienne środowiskowe w Vercel:**
   - W panelu Vercel, przejdź do Settings → Environment Variables
   - Dodaj następujące zmienne:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=twój_url_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=twój_anon_key
   \`\`\`

### Opcja B: Zmienne Lokalne (do testowania)

1. **Utwórz plik `.env.local` w głównym folderze projektu:**
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=twój_url_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=twój_anon_key
   \`\`\`

2. **Nigdy nie commituj tego pliku!** - jest w `.gitignore`

---

## Część 2: Gdzie znaleźć Klucze Supabase

1. **Zaloguj się do Supabase:**
   - Wejdź na [supabase.com](https://supabase.com)
   - Zaloguj się na swoje konto

2. **Przejdź do ustawień projektu:**
   - Wybierz swój projekt
   - Kliknij Settings (ikona koła zębatego)
   - Przejdź do zakładki "API"

3. **Skopiuj klucze:**
   - `NEXT_PUBLIC_SUPABASE_URL` - znajduje się jako "Project URL"
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - znajduje się jako "anon public"

---

## Część 3: Bezpieczeństwo - WAŻNE!

### Jakie zmienne są bezpieczne w GitHub?

**BEZPIECZNE (mogą być publicznie widoczne):**
- `NEXT_PUBLIC_SUPABASE_URL` - publiczny URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - klucz anonimowy (ma ograniczone uprawnienia)

**NIEBEZPIECZNE (NIGDY nie umieszczaj w kodzie!):**
- `SUPABASE_SERVICE_ROLE_KEY` - to jest klucz administracyjny, trzymaj w tajemnicy!

### Dlaczego Supabase ANON KEY jest bezpieczna?

Klucz `NEXT_PUBLIC_SUPABASE_ANON_KEY` jest anonimowy i ma ograniczone uprawnienia. W naszej aplikacji używamy **Row Level Security (RLS)** w bazie danych, co oznacza:

- Użytkownicy mogą tylko czytać dane, które są przeznaczone dla nich
- Dodawanie danych możliwe tylko po zalogowaniu
- Admin panel dostępny tylko dla administratorów
- Twoje dane prywatne są chronione na poziomie bazy danych

---

## Część 4: Kroki Wdrażania

### 1. Utwórz repozytorium
\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/twoja-nazwa/twoja-strona.git
git branch -M main
git push -u origin main
\`\`\`

### 2. Na Vercel
- Zaloguj się do [vercel.com/dashboard](https://vercel.com/dashboard)
- Kliknij "Add New..." → "Project"
- Wybierz repozytorium z GitHub
- Dodaj zmienne środowiskowe (patrz wyżej)
- Kliknij "Deploy"

### 3. Gotowe!
Twoja strona będzie dostępna pod adresem: `twoja-nazwa.vercel.app`

---

## Część 5: GitHub Actions (Automatyczne deployowanie)

Jeśli chcesz aby Vercel automatycznie wdrażał zmiany przy każdym push:

1. Zainstaluj GitHub App Vercel na swoim koncie
2. Vercel automatycznie będzie wdrażać przy każdym push do `main` branch

---

## Przydatne Linki

- Dokumentacja Supabase: https://supabase.com/docs
- Dokumentacja Next.js: https://nextjs.org/docs
- Dokumentacja Vercel: https://vercel.com/docs

## Pytania?

W razie problemów, odwiedź:
- [Supabase Forum](https://github.com/supabase/supabase/discussions)
- [Vercel Support](https://vercel.com/help)
\`\`\`

Stworzyłem kompleksowy przewodnik deployowania na GitHub i Vercel z wyjaśnieniem gdzie znaleźć klucze Supabase i dlaczego są bezpieczne. Dokument obejmuje konfigurację zmiennych, bezpieczeństwo, oraz kroki wdrażania.
