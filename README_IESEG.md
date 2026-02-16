# 🎓 IÉSEG School of Management - Web Scraper

Scraper organizado para extrair informações do site da IÉSEG School of Management.

## 📋 Sobre a IÉSEG

**IÉSEG School of Management** é uma escola de negócios francesa de prestígio com:

### 📊 Números-Chave
- **8.900 estudantes**
- **81% de professores internacionais**
- **342 universidades parceiras**
- **2.500 empresas parceiras**

### 🏆 Rankings Destacados

#### Financial Times
- 26º - Master in Management
- 31º - Executive Custom Programs
- 15º - Master in Finance

#### QS World University Ranking (Diversidade)
- 8º mundial - Master in AI & Data Analytics
- 2º mundial - Master in Management
- 4º mundial - Master in Finance
- 5º mundial - Global MBA
- 6º mundial - Master in Digital Marketing

### 🎓 Acreditações
- EQUIS
- AACSB
- AMBA
- CGE
- EESPIG

### 🏫 Campus
1. **Lille**: 3 rue de la Digue - 59000 Lille
2. **Paris La Défense**: 1 parvis de La Défense - 92044 Paris

## 🚀 Como Usar o Scraper

### 1. Instalar Dependências

```bash
pip install -r requirements.txt
```

### 2. Executar o Scraper

```bash
python ieseg_scraper.py
```

### 3. Resultado

O script irá:
- ✅ Extrair informações do site
- ✅ Exibir um resumo no terminal
- ✅ Salvar dados completos em `ieseg_data.json`

## 📦 Estrutura dos Dados Extraídos

```json
{
  "timestamp": "Data/hora da extração",
  "school_info": {
    "slogan": "Slogan da escola",
    "phone": "Telefone de contato",
    "social_media": [...]
  },
  "key_figures": {
    "students": 8900,
    "international_professors_percentage": 81,
    ...
  },
  "rankings": { ... },
  "accreditations": [ ... ],
  "programs": [
    {
      "name": "Nome do programa",
      "target": "Público-alvo",
      "description": "Descrição",
      "url": "Link para mais informações"
    }
  ],
  "news": [ ... ],
  "events": [ ... ],
  "campuses": [ ... ]
}
```

## 📚 Programas Oferecidos

### Para Estudantes (High School/University)
1. **Grande École Program** - Programa principal para graduados
2. **Bachelor in International Business** - Graduação em negócios internacionais
3. **Specialized Masters** - Mestrados especializados

### Para Profissionais
4. **MBA / Global MBA** - Para gestores e executivos
5. **Executive Education** - Educação executiva

## 🔧 Funcionalidades do Scraper

- ✅ Extração de informações institucionais
- ✅ Números-chave e estatísticas
- ✅ Rankings e posições
- ✅ Acreditações
- ✅ Programas oferecidos
- ✅ Notícias recentes
- ✅ Eventos próximos
- ✅ Informações dos campus
- ✅ Exportação para JSON
- ✅ Resumo formatado no terminal

## 📞 Contato da IÉSEG

- 📱 Telefone: (+33) 3.20.54.58.92
- 🌐 Website: https://www.ieseg.fr/en/
- 📧 Newsletter: Disponível no site
- 📍 Lille & Paris La Défense, França

## 🔗 Links Úteis

- [Site Oficial](https://www.ieseg.fr/en/)
- [Programas](https://www.ieseg.fr/en/programs/)
- [Admissões](https://www.ieseg.fr/en/prospective-student/)
- [Rankings](https://www.ieseg.fr/en/about-ieseg/rankings/)
- [Alumni Network](https://ieseg-network.com/)

## 💡 Dicas

1. Os dados são salvos em formato JSON para fácil análise
2. Execute o scraper regularmente para dados atualizados
3. Use o arquivo JSON para criar relatórios ou análises
4. Personalize o scraper conforme suas necessidades

---

**Missão da IÉSEG**: *"Empowering changemakers for a better society"* 🌍
