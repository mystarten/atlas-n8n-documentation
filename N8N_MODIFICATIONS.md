# Modifications à faire dans n8n

## 🎯 Objectif
Adapter le workflow n8n pour gérer "enterprise" (sans accent) et utiliser le branding personnalisé.

---

## MODIFICATION 1 : Transformer "enterprise" → "entreprise"
──────────────────────────────────────────────────────────

### Où : Dans le premier node "Code" après le webhook

**Ajouter ce code au début du node :**

```javascript
const input = $input.first().json;

// Transformer "enterprise" (anglais) en "entreprise" (français) pour compatibilité
const userPlan = input.user_plan === 'enterprise' ? 'entreprise' : input.user_plan;

// Déterminer le branding à utiliser
const brandingName = (userPlan === 'entreprise' && input.company_name) 
  ? input.company_name 
  : 'ATLAS';

// Récupérer le nom du template
const templateName = input.template_name || `workflow_${Date.now()}`;

console.log('📊 User Plan:', userPlan);
console.log('🏢 Branding:', brandingName);
console.log('📝 Template Name:', templateName);

// Passer ces variables au reste du workflow
return {
  ...input,
  user_plan: userPlan,           // "entreprise" au lieu de "enterprise"
  branding_name: brandingName,   // Nom à utiliser partout
  template_name: templateName    // Nom du template
};
```

---

## MODIFICATION 2 : Utiliser le branding dans les prompts PDF
─────────────────────────────────────────────────────────────

### Dans le node qui génère le prompt pour Claude (génération PDF)

**Remplacer les mentions "ATLAS" par la variable `branding_name` :**

**AVANT :**
```
<div class="header">
  <h1>⚡ ATLAS</h1>
  <p>Documentation Workflow N8N</p>
</div>

<div class="watermark">
  📄 Généré par ATLAS
</div>
```

**APRÈS :**
```javascript
const brandingName = $json.branding_name || 'ATLAS';

const htmlTemplate = `
<div class="header">
  <h1>⚡ ${brandingName}</h1>
  <p>Documentation Workflow N8N</p>
</div>

<div class="watermark">
  📄 Généré par ${brandingName}
</div>

<div class="footer">
  <p>Documentation by ${brandingName}</p>
</div>
`;
```

**Ou dans le prompt Claude :**
```
Génère un PDF HTML avec le titre : "${brandingName}"
Remplace toutes les mentions "ATLAS" par "${brandingName}" dans le document.
```

---

## MODIFICATION 3 : Utiliser le branding dans les notes n8n
───────────────────────────────────────────────────────────

### Dans le node Code qui génère les post-it

**Remplacer les mentions "ATLAS" :**

**AVANT :**
```javascript
const guideContent = `# ⚡ QUICK START\n\n` +
  `Documentation générée par ATLAS\n\n` +
  `🌐 atlasbuilder.app`;
```

**APRÈS :**
```javascript
const brandingName = $json.branding_name || 'ATLAS';

const guideContent = `# ⚡ QUICK START\n\n` +
  `Documentation générée par ${brandingName}\n\n`;
  // Enlever la mention du site si branding personnalisé
```

**Pour les notes de nœuds :**
```javascript
// AVANT
const note = `⚡ Configuration\n\n` +
  `✨ ATLAS Quick Start`;

// APRÈS
const brandingName = $json.branding_name || 'ATLAS';
const note = `⚡ Configuration\n\n` +
  `✨ ${brandingName} Quick Start`;
```

---

## MODIFICATION 4 : Utiliser le nom du template
───────────────────────────────────────────────

### Dans le nom du fichier de sortie

**Si tu retournes un fichier JSON ou PDF :**

```javascript
const templateName = $json.template_name || `workflow_${Date.now()}`;

// Pour un PDF
const pdfFileName = `${templateName}_documentation.pdf`;

// Pour un JSON
const jsonFileName = `${templateName}_documented.json`;

return {
  ...result,
  file_name: pdfFileName,
  template_name: templateName
};
```

---

## MODIFICATION 5 : Switch selon le plan
────────────────────────────────────────

### Ajouter un node "Switch" après la transformation

**Expression à évaluer :**
```javascript
{{ $json.user_plan }}
```

**Routes :**
- **Route 0** : `user_plan === 'free'`
  - Notes n8n uniquement
  - Watermark ATLAS (ou branding si défini)
  
- **Route 1** : `user_plan === 'starter'`
  - Notes n8n OU PDF (selon `output_format`)
  - Watermark ATLAS (ou branding)
  
- **Route 2** : `user_plan === 'pro'`
  - Notes n8n OU PDF (selon `output_format`)
  - Sans watermark
  
- **Route 3** : `user_plan === 'entreprise'`
  - Notes n8n OU PDF (selon `output_format`)
  - Sans watermark
  - Branding personnalisé (`branding_name`)

---

## MODIFICATION 6 : Switch selon output_format
──────────────────────────────────────────────

### Après le switch du plan, ajouter un switch pour le format

**Expression :**
```javascript
{{ $json.output_format }}
```

**Routes :**
- **Route "notes"** : Générer notes et post-it n8n
- **Route "pdf"** : Générer PDF

---

## PAYLOAD COMPLET REÇU PAR N8N

```json
{
  "workflowJson": "{ ... }",
  "notes": "Notes utilisateur",
  "webhookUrl": "https://...",
  "executionMode": "production",
  "user_id": "22d90ff5-ea14-4721-9e7f-fec1d01ccd86",
  "user_plan": "enterprise",
  "output_format": "pdf",
  "template_name": "workflow_crm_automation",
  "company_name": "Ma Super Société",
  "branding": "Ma Super Société",
  "generated_at": "2025-10-16T10:30:00.000Z"
}
```

**Après transformation dans n8n :**
```json
{
  ...
  "user_plan": "entreprise",        // Transformé pour compatibilité française
  "branding_name": "Ma Super Société",
  "template_name": "workflow_crm_automation"
}
```

---

## EXEMPLE COMPLET DE CODE N8N

### Node 1 : Transformation après webhook

```javascript
const input = $input.first().json;

// Transformation plan
const userPlan = input.user_plan === 'enterprise' ? 'entreprise' : input.user_plan;

// Déterminer le branding
const brandingName = (userPlan === 'entreprise' && input.company_name) 
  ? input.company_name 
  : 'ATLAS';

// Nom du template
const templateName = input.template_name || `workflow_${Date.now()}`;

// Retourner tout
return {
  ...input,
  user_plan: userPlan,
  branding_name: brandingName,
  template_name: templateName,
  workflow_data: JSON.parse(input.workflowJson)
};
```

### Node 2 : Génération PDF avec branding

```javascript
const brandingName = $json.branding_name || 'ATLAS';
const templateName = $json.template_name;

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>${brandingName} - ${templateName}</title>
  <style>
    .header { 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      text-align: center;
    }
    .watermark {
      position: fixed;
      bottom: 20px;
      right: 20px;
      opacity: 0.3;
      font-size: 0.8rem;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>⚡ ${brandingName}</h1>
    <h2>${templateName}</h2>
    <p>Documentation Workflow N8N</p>
  </div>
  
  <div class="content">
    ${documentationContent}
  </div>
  
  ${$json.user_plan !== 'pro' && $json.user_plan !== 'entreprise' ? 
    `<div class="watermark">📄 Généré par ${brandingName}</div>` : 
    ''}
</body>
</html>
`;

return { html: htmlContent, template_name: templateName };
```

---

## RÉSUMÉ DES CHANGEMENTS N8N

1. ✅ Node transformation : "enterprise" → "entreprise"
2. ✅ Node transformation : Extraire branding_name
3. ✅ Node transformation : Extraire template_name
4. ✅ Prompts PDF : Utiliser `${brandingName}` au lieu de "ATLAS"
5. ✅ Notes n8n : Utiliser `${brandingName}` dans les post-it
6. ✅ Nom fichier : Utiliser `${templateName}`
7. ✅ Watermark : Conditionnel selon le plan

---

## TESTER

1. **Plan Free :**
   - Génère un template
   - Nom : "test_free"
   - Vérifie : Watermark "ATLAS" présent

2. **Plan Starter :**
   - Génère en PDF
   - Nom : "test_starter"
   - Vérifie : Watermark "ATLAS" présent

3. **Plan Pro :**
   - Génère en PDF
   - Nom : "test_pro"
   - Vérifie : Pas de watermark

4. **Plan Enterprise avec company_name :**
   - Définis company_name = "Ma Société"
   - Génère en PDF
   - Nom : "test_enterprise"
   - Vérifie : 
     - Pas de watermark
     - "Ma Société" partout au lieu de "ATLAS"
     - Fichier : `test_enterprise_atlas.json`





