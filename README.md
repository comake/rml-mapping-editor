<div align="center">
  <h1>RML Mapping Editor</h1>
  <p>
    A no-code, easy to use interface for building and editing [RML](https://rml.io/) mappings.
  </p>
</div>

## 🚧 Under development

This project is a work in progress. Check back soon for v0.

## 🎁 Planned Features

- 3 views to build and edit mappings:
  - Drag and drop view - click and drag to make connections between the input schema to the desired output schema. Also click and drag functions from the list of predefined functions
  - Manual selection view - construct mappings by searching for and selecting available fields and functions from dropdown menus
  - Code view - edit mappings in JSON-LD code
- Automatic input schema generation from:
  - JSON
  - CSV
  - XML
  - OpenAPI spec
- Live mapping output based on sample data

## 🛠 Development

To get started contributing:
1. See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines
2. Checkout the [Project Board](https://github.com/orgs/comake/projects/1) to find TODO tasks, or [reach out to the maintainers on Discord](https://discord.gg/stvfSB8kpG?ref=https://github.com/comake/rml-mapping-editor)
3. Clone the repo or create your own fork to get started:

```console
git clone https://github.com/comake/rml-mapping-editor.git
cd rml-mapping-editor
```

Although this module is just a React Component, the repo comes with webpack-dev-server installed so that you can run and test it out locally. Just run:

```console
npm install
npm run start
```