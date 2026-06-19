import os
import re

app_dir = r"d:\git\cafe-blockchain\cafe-blockchain-web\src\app"
html_files_with_cards = []

for root, dirs, files in os.walk(app_dir):
    for file in files:
        if file.endswith(".html"):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            if "app-card" in content or "app-card-interactive" in content:
                # Count occurrences
                count_normal = len(re.findall(r'class="[^"]*app-card[^"]*"', content))
                count_interactive = len(re.findall(r'class="[^"]*app-card-interactive[^"]*"', content))
                if count_normal > 0 or count_interactive > 0:
                    html_files_with_cards.append((path, count_normal, count_interactive))

print(f"Total HTML files found: {len(html_files_with_cards)}")
for path, cn, ci in sorted(html_files_with_cards):
    rel_path = os.path.relpath(path, app_dir)
    print(f"- {rel_path} (app-card: {cn}, app-card-interactive: {ci})")
