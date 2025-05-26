#!/usr/bin/env bash
# ---------------------------------------------------------------------------
#  USAGE : bash collect.sh /chemin/projet  [fichier_sortie]
# ---------------------------------------------------------------------------
set -euo pipefail

PROJECT_DIR="${1:?❌  Donne le dossier projet en 1er argument}"
OUTPUT="${2:-project_context.txt}"
MAX_SIZE=81920                # 80 KB par fichier

DIR_SKIP="node_modules|\\.nuxt|dist|target|\\.git|\\.idea|\\.vscode|\\.m2|\\.gradle"
FILE_SKIP="package-lock\\.json|yarn\\.lock|pnpm-lock\\.yaml|gradle\\.lockfile"

# ────────────── (ré)initialisation du fichier de sortie ────────────────
[ -f "$OUTPUT" ] && rm -f "$OUTPUT"

TMP_CONTENT=$(mktemp)          # corps complet
summary=()                     # chemins pour l’index

echo "⏳ Collecte dans '$PROJECT_DIR'…"

# ---------- boucle sur les fichiers texte utiles -----------------------
while IFS= read -r -d '' file; do
  rel="${file#"$PROJECT_DIR"/}"
  printf '\r→ %s' "$rel"
  summary+=("$rel")

  # Ignore binaires >1 KB
  if ! grep -Iq . "$file" 2>/dev/null && [ "$(stat -c%s "$file")" -gt 1024 ]; then
    continue
  fi

  printf '<<< %s >>>\n' "$rel" >>"$TMP_CONTENT"

  size=$(stat -c%s "$file")
  if (( size <= MAX_SIZE )); then
    cat "$file" >>"$TMP_CONTENT"
  else
    half=$((MAX_SIZE/2))
    head -c "$half" "$file" >>"$TMP_CONTENT"
    echo -e "\n--- [TRONQUÉ : >${MAX_SIZE} octets] ---" >>"$TMP_CONTENT"
    tail -c "$half" "$file" >>"$TMP_CONTENT"
  fi
  echo -e "\n" >>"$TMP_CONTENT"
done < <(
  find "$PROJECT_DIR" -type f -print0 \
    | grep -zEv "/(${DIR_SKIP})/" \
    | grep -zEv "(${FILE_SKIP})$"
)

# ---------- construction du sommaire + assemblage final -----------------
{
  echo "# Index (${#summary[@]} fichiers)"
  for p in "${summary[@]}"; do echo "- $p"; done
  echo
  cat "$TMP_CONTENT"
} >"$OUTPUT"

chmod 777 "$OUTPUT"
rm -f "$TMP_CONTENT"

echo -e "\n✅  Contexte écrit dans '$OUTPUT' ($(du -h "$OUTPUT" | cut -f1))"
